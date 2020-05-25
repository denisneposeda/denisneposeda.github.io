$(function() {

	$('.lazy').Lazy({
      scrollDirection: 'vertical',
      effect: 'fadeIn',
      visibleOnly: true,
      onError: function(element) {
          console.log('error loading ' + element.data('src'));
      }
    })

    $('.hamburger').click(function(e){
        e.preventDefault();
        $(this).toggleClass('is-active');
        $('html').toggleClass('is-menu');
    })

    var promoSlider = $('.promo-slider .owl-carousel').owlCarousel({
        loop:false,
        margin:0,
        nav:false,
        dots:false,
        mouseDrag:false,
        touchDrag:false,
        smartSpeed: 750,
        animateOut: 'fadeOut',
        items: 1
    })

    $('.slider-control_link').eq(0).addClass('is-active');
    $('.slider-control_link').click(function(e){
        e.preventDefault();
        if ( $(this).not('.is-active') ) {
            $(this).addClass('is-active').siblings('.is-active').removeClass('is-active');
            var index = $(this).index();
            promoSlider.trigger('to.owl.carousel', index);
        }
    })

    $('.faq-block_control').click(function(e){
        e.preventDefault();
        $(this).next().slideToggle().parent().siblings().children('.faq-block_content:visible').slideUp();
    })

    $(window).scroll(function(e){
        ( $(this).scrollTop() > $('.header:not(.header-scroll)').outerHeight() ) ? $('body').addClass('scroll') : $('body').removeClass('scroll');
    })

});
