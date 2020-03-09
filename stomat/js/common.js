$(function() {

	$('.lazy').Lazy({
      scrollDirection: 'vertical',
      effect: 'fadeIn',
      visibleOnly: true,
      onError: function(element) {
          console.log('error loading ' + element.data('src'));
      }
    });

    $('.about-carousel').owlCarousel({
        loop:true,
        margin:10,
        nav:true,
        dots:false,
        items:1,
        smartSpeed:750
    })

    $('#map').width($('.contact-content').offset().left);
    $(window).resize(function(e){
        $('#map').width($('.contact-content').offset().left);
    })

    $('.hamburger').click(function(e){
        e.preventDefault();
        $(this).toggleClass('is-active');
        $('html').toggleClass('is-menu');
    })

});
