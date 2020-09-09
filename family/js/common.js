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

    $('.video-carousel').owlCarousel({
        loop: false,
        nav: false,
        dots: false,
        responsive: {
            0: {
                items: 1,
                startPosition: 0,
                center: false,
                margin: 15
            },
            992: {
                items: 3,
                startPosition: 1,
                center: true,
                margin: 0
            }
        }
    })

    $('.faq-item').click(function(e){
        e.preventDefault();
        $(this).toggleClass('is-open').children('.faq-item__toggle').slideToggle().parent().siblings('.is-open').removeClass('is-open').children('.faq-item__toggle').slideUp();
    })

    $('.menu li a').click(function(e){
        e.preventDefault();
        e.stopPropagation();
        $('html,body').animate({
            scrollTop: $($(this).attr('href')).offset().top - $('.header').outerHeight()
          }, 400);
        if ( $('html').is('.is-menu') ) {$('.hamburger').click()}
    })

    $('.article-carousel').owlCarousel({
        loop: false,
        dots: false,
        responsive: {
            0: {
                items: 1,
                nav: false,
                margin: 15
            },
            992: {
                items: 3,
                nav: true,
                margin: 20
            }
        }
    })

});
