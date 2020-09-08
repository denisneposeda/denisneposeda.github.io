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
        items:3,
        center: true,
        loop: false,
        nav: false,
        dots: false,
        startPosition: 1
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
        items:3,
        margin: 20,
        loop: false,
        nav: true,
        dots: false,
    })

});
