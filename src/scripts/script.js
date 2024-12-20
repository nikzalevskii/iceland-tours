$(document).ready(function () {
    // wow js

    var wow = new WOW({
        boxClass:     'wow',
        animateClass: 'animate__animated',
        offset:       200,
        mobile:       true,
        live:         true
    })
    wow.init();

    // Burger menu
    $('#burger').click(function () {
        $('#menu').addClass('open');
    })

    $('.close').click(function () {
        $('#menu').removeClass('open');
    })

    // Order. Scroll
    $("a[href^='#']").on("click", function () {
        let href = $(this).attr("href");
        $("html, body").animate({scrollTop: $(href).offset().top}, 1300);
        return false;
    });


    // SLICK

    $('.gallery-slider').slick({
        // mobileFirst:true,
        dots: true,
        infinite: true,
        speed: 300,
        variableWidth: true,
        slidesToShow: 4,
        slidesToScroll: 4,
        responsive: [
            {
                breakpoint: 769,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 427,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 4,
                    infinite: true,
                    dots: false,
                    arrows: false
                }
            }
        ]

    });

    //magnificPopup для просмотра фото на карточках
    $('.gallery-slider-collection').magnificPopup({
        type: 'image'
    });
    $('.gallery-slider-image').magnificPopup({type: 'image'});


    // Уникальные места Исландии
    let places_numbers = $('.places_item-map-number');
    let places_blocks = $('.places_item-block');
    places_numbers.click(function () {
        places_numbers.removeClass('number__active');
        $(this).addClass('number__active');
        let index = $(this).index() - 3;
        places_blocks.removeClass('places-block-active');
        places_blocks.eq(index).addClass('places-block-active');
    })

//     Видео Youtube
    $('.video__play-btn-pic').click(function () {
        $('.video-wrap').css('display', 'none');
        $('.video-youtube').css('display', 'block');
    })

//     Программа тура

    let program_images = $('.program__items-image-pic-wrap-img');
    $('.prev-program-arrow').click(function () {
        let currentBlock = $('.program__items-block.program-block-active');
        let currentBlockIndex = currentBlock.index();
        let prevBlock = currentBlock.prev();
        let prevBlockIndex = currentBlockIndex - 1;
        currentBlock.removeClass('program-block-active');
        program_images.removeClass('program__pic-active');

        if (prevBlockIndex === ($('.program__items-block:first').index() - 1)) {
            $('.program__items-block:last').addClass('program-block-active');
            $('.program__items-image-pic-wrap-img:last').addClass('program__pic-active');
        } else {
            prevBlock.addClass('program-block-active');
            program_images.eq(prevBlockIndex).addClass('program__pic-active');
        }
    })
    $('.next-program-arrow').click(function () {
        let currentBlock = $('.program__items-block.program-block-active');
        let currentBlockIndex = currentBlock.index();
        let nextBlock = currentBlock.next();
        let nextBlockIndex = currentBlockIndex + 1;
        currentBlock.removeClass('program-block-active');
        program_images.removeClass('program__pic-active');

        if (nextBlockIndex === ($('.program__items-block:last').index() + 1)) {
            $('.program__items-block:first').addClass('program-block-active');
            $('.program__items-image-pic-wrap-img:first').addClass('program__pic-active');
        } else {
            nextBlock.addClass('program-block-active');
            program_images.eq(nextBlockIndex).addClass('program__pic-active');
        }
    })

//     Отзывы
    let feedback_images = $('.feedback__image-pic');
    $('.feedback__section-arrows-left').click(function () {
        let currentBlock = $('.feedback__section-block.feedback__section-block-active');
        let currentBlockIndex = currentBlock.index();
        let prevBlock = currentBlock.prev();
        let prevBlockIndex = currentBlockIndex - 1;
        currentBlock.removeClass('feedback__section-block-active');
        feedback_images.removeClass('feedback__image-active');

        if (prevBlockIndex === ($('.feedback__section-block:first').index() - 1)) {
            $('.feedback__section-block:last').addClass('feedback__section-block-active');
            $('.feedback__image-pic:last').addClass('feedback__image-active');
        } else {
            prevBlock.addClass('feedback__section-block-active');
            feedback_images.eq(prevBlockIndex).addClass('feedback__image-active');
        }
    })
    $('.feedback__section-arrows-right').click(function () {
        let currentBlock = $('.feedback__section-block.feedback__section-block-active');
        let currentBlockIndex = currentBlock.index();
        let nextBlock = currentBlock.next();
        let nextBlockIndex = currentBlockIndex + 1;
        currentBlock.removeClass('feedback__section-block-active');
        feedback_images.removeClass('feedback__image-active');

        if (nextBlockIndex === ($('.feedback__section-block:last').index() + 1)) {
            $('.feedback__section-block:first').addClass('feedback__section-block-active');
            $('.feedback__image-pic:first').addClass('feedback__image-active');
        } else {
            nextBlock.addClass('feedback__section-block-active');
            feedback_images.eq(nextBlockIndex).addClass('feedback__image-active');
        }
    })

//     Форма
//     order__input
    let loader = $('.loader');
    let inputElements = $('.order__input');
    let radioElements = $('.custom-radio-input');
    $('.order__btn').click(function () {
        let hasError = false;
        for (let i = 0; i < inputElements.length; i++) {
            inputElements.eq(i).css('border-color', 'white')
            inputElements.eq(i).next().css('visibility', 'hidden');
            radioElements.eq(0).parent().parent().next().css('visibility', 'hidden');
            if (!inputElements.eq(i).val()) {
                // inputElements.eq(i).next().show();
                inputElements.eq(i).next().css('visibility', 'visible');
                inputElements.eq(i).css('border-color', 'red')
                hasError = true;
            }

            if ($('#num_1').prop('checked') || $('#num_2').prop('checked') ||
                $('#num_3').prop('checked') || $('#num_4').prop('checked') ||
                $('#num_5').prop('checked') || $('#num_6').prop('checked') ||
                $('#num_7').prop('checked') ) {
                radioElements.eq(0).parent().parent().next().css('visibility', 'hidden');
            } else {
                radioElements.eq(0).parent().parent().next().css('visibility', 'visible');
                hasError = true;
            }

        }

        if (!hasError) {
            loader.css('display', 'flex');
            $.ajax({
                method: "POST",
                url: "http://testologia.ru/checkout",
                data: {
                    // product: inputElements.eq(0).val(),
                    name: inputElements.eq(0).val(),
                    phone: inputElements.eq(1).val()
                }
            })
                .done(function (msg) {
                    console.log(msg);
                    loader.hide();
                    if (msg.success) {
                        $('.order__form').hide();
                        $('.order__title').text('Спасибо за заказ! Мы свяжемся с Вами');
                    } else {
                        alert('Произошла ошибка. Попробуйте снова.')
                    }
                });
        } else {
            return;
        }
    })
})

