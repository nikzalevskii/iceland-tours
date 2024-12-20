'use strict';

const { src, dest, watch, series, parallel } = require('gulp');
const less = require('gulp-less');
const concatCss = require('gulp-concat-css');
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const htmlReplace = require('gulp-html-replace');
const replace = require('gulp-replace');

// Динамический импорт для del
async function clean() {
    const { deleteAsync } = await import('del');
    return deleteAsync(['./dist']);
}

// Компиляция LESS -> CSS
function styles() {
    return src('./src/styles/*.less')
        .pipe(less())
        .pipe(concatCss("styles.css"))
        .pipe(cssmin())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('./dist/src/styles'));
}

// Копирование и минификация JS
function scripts() {
    return src('./src/scripts/*.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('./dist/src/scripts'));
}

// Копирование HTML и минификация
function html() {
    return src('./index.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest('./dist'));
}

// Копирование статических файлов (шрифты, изображения)
function assets() {
    return src('./{fonts,images}/**/*')
        .pipe(dest('./dist'));
}

// Копирование зависимостей
function copyDependencies() {
    return src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/jquery-ui/dist/jquery-ui.min.js',
        'node_modules/jquery-ui-css/jquery-ui.min.css',
        'node_modules/slick-carousel/slick/slick.min.js',
        'node_modules/slick-carousel/slick/slick.css',
        'node_modules/slick-carousel/slick/slick-theme.css',
        'node_modules/slick-carousel/slick/fonts//**/*',
        'node_modules/slick-carousel/slick/ajax-loader.gif',
        'node_modules/magnific-popup/dist/jquery.magnific-popup.min.js',
        'node_modules/magnific-popup/dist/magnific-popup.css',
        'node_modules/animate.css/animate.min.css',
        'node_modules/hover.css/css/hover-min.css',
        'node_modules/wowjs/dist/wow.min.js'
    ], { base: 'node_modules' })
        .pipe(dest('./dist/libs'));
}


function updateHtmlPaths() {
    return src('./dist/index.html')
        .pipe(replace('src="src/scripts/less.js"', 'src="src/scripts/less.min.js"')) // заменяем только less.js
        .pipe(replace('src="src/scripts/script.js"', 'src="src/scripts/script.min.js"')) // заменяем только script.js
        .pipe(replace('href="src/styles/styles.less"', 'href="src/styles/styles.min.css"')) // заменяем путь к стилям
        .pipe(replace('href="node_modules/', 'href="libs/')) // заменяем пути для node_modules
        .pipe(replace('src="node_modules/', 'src="libs/')) // заменяем пути для node_modules
        .pipe(htmlReplace({
            js: [
                'libs/jquery/dist/jquery.min.js',
                'libs/jquery-ui/dist/jquery-ui.min.js',
                'libs/slick-carousel/slick/slick.min.js',
                'libs/magnific-popup/dist/jquery.magnific-popup.min.js',
                'libs/wowjs/dist/wow.min.js',
                'src/scripts/script.min.js' // Ваш скрипт подгружается последним
            ]
        }))
        .pipe(dest('./dist'));
}

// Наблюдение за изменениями
function watchFiles() {
    watch('./src/styles/*.less', styles);
    watch('./index.html', html);
    watch('./node_modules/**/*', copyDependencies);  // Наблюдение за изменениями в зависимостях
    watch('./src/scripts/*.js', scripts);
}

// Сборка
exports.default = series(
    clean,
    parallel(styles, html, assets, copyDependencies, scripts),  // Добавлен копирование зависимостей в сборку
    updateHtmlPaths  // Обновление путей в HTML в конце сборки
);

// Задача для наблюдения
exports.watch = watchFiles;
