$(function() {

	$('.lazy').Lazy({
      scrollDirection: 'vertical',
      effect: 'fadeIn',
      visibleOnly: true,
      onError: function(element) {
          console.log('error loading ' + element.data('src'));
      }
    })

    $('.stock-carousel').owlCarousel({
        loop:true,
        margin:24,
        nav:true,
        dots:false,
        smartSpeed: 750,
        responsive:{
            0:{
                items:2
            },
            576:{
                items:3
            },
            992:{
                items:5
            }
        }
    })

});
