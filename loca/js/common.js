$(function() {

    $('.form-select').selectric();

    $('.hamburger').click(function(e){
        e.preventDefault();
        $(this).toggleClass('is-active');
        $('html').toggleClass('is-menu');
    })

    $('.header-hamburger .btn').click(function(){

    })

    $('.tabs-content_item:not(.tabs-content_cateory) .tabs-content_title').click(function(e){
        $(this).next().slideToggle().parent().toggleClass('is-active');
    })
    $('.tabs-content_hidden .btn').click(function(e){
        $(this).parent().slideUp().parent().removeClass('is-active');
    })

    $('.reviews-answer').click(function(){
        $(this).hide().next().slideDown();
    })

    $('.results-control').click(function(e){
        e.preventDefault();
        $(this).parent().toggleClass('is-open');
        $('html').toggleClass('is-results');
    })

    $('.aside-control').click(function(e){
        e.preventDefault();
        $(this).parent().toggleClass('is-open');
        $('html').toggleClass('is-index');
    })

    $(".aside").click(function(e) {
        var offset = $(this).offset();
        var relativeX = (e.pageX - offset.left);
        var relativeY = (e.pageY - offset.top);
        if ( $(window).outerWidth() < 576 && relativeY < 20) {
            $(this).toggleClass('is-open');
            $('body').toggleClass('is-index');
        }
        });

    $(".results").click(function(e) {
        var offset = $(this).offset();
        var relativeX = (e.pageX - offset.left);
        var relativeY = (e.pageY - offset.top);
        if ( $(window).outerWidth() < 768 && relativeY < 20) {
            $(this).toggleClass('is-open');
            $('body').toggleClass('is-results');
        }
    });

    $('.map-control .btn').click(function(e){
        e.preventDefault();
        if ( $(this).parent().not('.is-active') ) $(this).parent().addClass('is-active').siblings('.is-active').removeClass('is-active');
    })

    var settings = {
        autoReinitialise: true,
        contentWidth: '0px'
	};
    $('.scroll-pane').jScrollPane(settings);
    $('.filter-scroll').jScrollPane(settings);
    $('.aside-catalog').jScrollPane(settings);
    $('.menu-content').jScrollPane(settings);
    $('.catalog-sections').jScrollPane(settings);
    $('.catalog-category').jScrollPane(settings);
    $('.catalog-company').jScrollPane({autoReinitialise: true});
    
    var resultsCarousel = $('.results-carousel_big').owlCarousel({
        'dots': false,
        'autoWidth': true,
        'margin': 13,
        'navText': ['<button class="btn btn-big btn-primary btn-icon btn-round"><svg class="icon icon-aright"><use xlink:href="#icon-aright"></use></svg></button>','<button class="btn btn-big btn-primary btn-icon btn-round"><svg class="icon icon-aright"><use xlink:href="#icon-aright"></use></svg></button>'],
        'nav': true
    })

    $('.results-carousel_medium').owlCarousel({
        'dots': false,
        'autoWidth': true,
        'margin': 20,
        'navText': ['<button class="btn btn-big btn-primary btn-icon btn-round"><svg class="icon icon-aright"><use xlink:href="#icon-aright"></use></svg></button>','<button class="btn btn-big btn-primary btn-icon btn-round"><svg class="icon icon-aright"><use xlink:href="#icon-aright"></use></svg></button>'],
        'nav': true
    })

    $('.results-thumb').owlCarousel({
        'dots': false,
        'autoWidth': true,
        'margin': 10
    })

    $('.card-carousel').owlCarousel({
        'dots': false,
        'autoWidth': true,
        'margin': 10,
        'navText': ['<button class="btn btn-big btn-primary btn-icon btn-round"><svg class="icon icon-aright"><use xlink:href="#icon-aright"></use></svg></button>','<button class="btn btn-big btn-primary btn-icon btn-round"><svg class="icon icon-aright"><use xlink:href="#icon-aright"></use></svg></button>'],
        'nav': true
    })

    $('.results-thumb_image').click(function(e){
        e.preventDefault();
        resultsCarousel.trigger('to.owl.carousel',$(this).parent().index());
    })

    $('[data-toggle="tooltip"]').tooltip({ trigger: "hover" })

    $('.filter-category_btn').click(function(e){
        e.preventDefault();
        var serf = $(this);
        if ( $(window).outerWidth() > 991 ) {
            $(this).parent().addClass('is-show').siblings('.is-show').removeClass('is-show');
        } else {
            $.fancybox.open({ 
                src: serf.data('id')
            });
        }
    })
    $('.filter-popup .btn-icon').click(function(e){
        e.preventDefault();
        $(this).closest('.filter-category').removeClass('is-show');
    })

    // $('.header-city_select').click(function(e){
    //     e.preventDefault();
    //     $(this).toggleClass('is-open');
    // })
    // $('.header-city_link').click(function(e){
    //     e.preventDefault();
    //     $('.header-city_name').text($(this).text());
    // })

    $('#catalog-open').click(function(e){
        e.preventDefault();
        $('html').addClass('is-catalog');
    })
    $('#catalog-close').click(function(e){
        e.preventDefault();
        $('html').removeClass('is-catalog');
    })
    $('.catalog-sections_link').click(function(e){
        e.preventDefault();
        $(this).parent().addClass('is-active').siblings('.is-active').removeClass('is-active');
        $('.catalog-block_details').not('.is-show').addClass('is-show');
    })
    $('.catalog-category_all').click(function(e){
        e.preventDefault();
        $('.list-rolled').addClass('is-show');
        $(this).hide();
    })
    $('#catalog-back').click(function(e){
        e.preventDefault();
        $(this).closest('.catalog-block_details').removeClass('is-show');
    })

    $('#menu-open').click(function(e){
        e.preventDefault();
        $('html').addClass('is-menu');
    })
    $('#menu-close').click(function(e){
        e.preventDefault();
        $('html').removeClass('is-menu');
    })

    if ( $('.form-rating').length > 0 ) {

        var rating = $('.form-rating').data('rating'),
            badge = $('.form-rating .badge');

        badge.text(rating);
        $('.form-rating .form-rating_item').each(function(index){
            if ( index < rating ) {
                $(this).addClass('is-active');
            }
        })
        $('.form-rating .form-rating_item').hover(function(){
            $(this).parent().prevAll().children().addClass('is-active');
            $(this).parent().nextAll().children().removeClass('is-active');
        })
        $('.form-rating .form-rating_item').click(function(){
            var index = $(this).parent().index() + 1;
            $(this).addClass('is-active');
            badge.text(index);
            $(this).closest('.form-rating').attr('data-rating', index);
        })
        $('.form-rating_box').mouseleave(function(){
            rating = $('.form-rating').attr('data-rating');
            $(this).find('.form-rating_item').each(function(index){
                ( index < rating ) ? $(this).addClass('is-active') : $(this).removeClass('is-active')
            })
        })

    }

});
