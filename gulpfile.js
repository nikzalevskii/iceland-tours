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
        .pipe(dest('./dist/styles'));
}

// Копирование и минификация JS
function scripts() {
    return src('./src/scripts/*.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('./dist/scripts'));
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
        'node_modules/magnific-popup/dist/jquery.magnific-popup.min.js',
        'node_modules/magnific-popup/dist/magnific-popup.css',
        'node_modules/animate.css/animate.min.css',
        'node_modules/hover.css/css/hover-min.css',
        'node_modules/wowjs/dist/wow.min.js'
    ], { base: 'node_modules' })
        .pipe(dest('./dist/libs'));
}

// Обновление путей в HTML
// function updateHtmlPaths() {
//     console.log('Обновление путей в HTML...');
//     return src('./dist/index.html')  // Берем файл из папки dist
//         .pipe(htmlReplace({
//             'css': 'styles/styles.min.css', // Обновление пути к минифицированному стилю
//             'js': 'scripts/script.min.js',  // Обновление пути к минифицированному JS
//             'jquery-ui': 'libs/jquery-ui.min.css', // Путь к библиотеке jQuery UI CSS
//             'slick': 'libs/slick.css', // Путь к библиотеке Slick CSS
//             'slick-theme': 'libs/slick-theme.css', // Путь к библиотеке Slick Theme CSS
//             'magnific-popup': 'libs/magnific-popup.css', // Путь к библиотеке Magnific Popup CSS
//             'animate': 'libs/animate.min.css', // Путь к библиотеке Animate CSS
//             'hover': 'libs/hover-min.css', // Путь к библиотеке Hover CSS
//             'wow': 'libs/wow.min.js', // Путь к библиотеке WOW.js
//         }))
//         .pipe(dest('./dist'));
// }

function updateHtmlPaths() {
    return src('./dist/index.html')
        .pipe(replace('href="node_modules/', 'href="libs/'))
        .pipe(replace('src="node_modules/', 'src="libs/'))
        .pipe(replace('href="src/styles/styles.less"', 'href="styles/styles.min.css"'))
        .pipe(replace('src="src/scripts/less.js"', 'src="scripts/script.min.js"'))
        .pipe(replace('src="src/scripts/script.js"', 'src="scripts/script.min.js"'))
        .pipe(dest('./dist'));
}

// Наблюдение за изменениями
function watchFiles() {
    watch('./src/styles/*.less', styles);
    watch('./src/scripts/*.js', scripts);
    watch('./index.html', html);
    watch('./node_modules/**/*', copyDependencies);  // Наблюдение за изменениями в зависимостях
}

// Сборка
exports.default = series(
    clean,
    parallel(styles, scripts, html, assets, copyDependencies),  // Добавлен копирование зависимостей в сборку
    updateHtmlPaths  // Обновление путей в HTML в конце сборки
);

// Задача для наблюдения
exports.watch = watchFiles;
