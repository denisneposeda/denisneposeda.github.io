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

    var catalogCarousel = $('.catalog-carousel').owlCarousel({
        loop:false,
        margin:10,
        nav:false,
        dots:false,
        mouseDrag: false,
        touchDrag: false,
        smartSpeed: 750,
        items: 1
    })

    $('.catalog-carousel_btn').eq(0).addClass('is-active');
    $('.catalog-carousel_btn').click(function(e){
        e.preventDefault();
        if (  $(this).not('.is-active') ) {
            $(this).addClass('is-active').parent().siblings().children('.is-active').removeClass('is-active');
            var index = $(this).parent().index();
            catalogCarousel.trigger('to.owl.carousel', index);
        }
    })

    $('.photo-carousel').owlCarousel({
        loop:false,
        margin:30,
        nav:true,
        dots:false,
        smartSpeed: 750,
        slideBy: 1,
        responsive:{
            0:{
                items:1
            },
            415:{
                items:2
            },
            768:{
                items:3
            }
        }
    })

    $('.menu-list_link').click(function(e){
        var href = $(this).attr('href')
        if ( $(href).length > 0 ) {
            e.preventDefault();
            $('html,body').animate({
                scrollTop: $(href).offset().top - 20
              }, 1000);
        } else {
            if(href.indexOf('#') + 1){
                e.preventDefault();
                location.href = "./index.html"+href;
            }
        }
    })

});
