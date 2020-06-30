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
    
    $('.topbar-close').click(function(e){
        $(this).closest('.topbar').slideUp();
    })

    $('.recommended-carousel').owlCarousel({
        loop:false,
        margin:20,
        nav:true,
        responsive:{
            0:{
                items:2,
                autoWidth: true
            },
            576:{
                items:3,
                autoWidth: false
            },
            1000:{
                items:5,
                autoWidth: false
            }
        }
    })

    $('.faq-block_control').click(function(e){
        e.preventDefault();
        $(this).toggleClass('is-active').next().slideToggle().parent().siblings().find('.is-active').removeClass('is-active').next().slideUp();
    })

    $('.description-control').click(function(e){
        e.preventDefault();
        $(this).slideUp().prev().addClass('show').height($(this).prev().children().outerHeight());
    })

    $('.description-link').click(function(e){
        e.preventDefault();
        $('body,html').animate({
            scrollTop: $('.description').offset().top
        }, 400);
    })

    $('.slidetop').click(function (e) {
        e.preventDefault();
        $('body,html').animate({
            scrollTop: 0
        }, 400);
    })

    $('.card-images_small .image').eq(0).addClass('current');

    var cardCarousel = $('.card-images_carousel').owlCarousel({
        loop:false,
        margin:12,
        nav:false,
        dots:false,
        items:1,
        mouseDrag:false,
        touchDrag:false
      })
    
      $('.card-thumb_carousel').owlCarousel({
        items: 7,
        loop: false,
        autoWidth:true,
        autoHeight:true,
        margin: 5,
        nav: true,
        dots: false
      })
    
      $('.card-images_small .image').click(function(e){
        e.preventDefault();
        if ( $(this).not('.current') ) {
            $(this).addClass('current').parent().siblings().children('.current').removeClass('current');
            cardCarousel.trigger('to.owl.carousel', [ $(this).parent().index() ]);
        }
      })
});
