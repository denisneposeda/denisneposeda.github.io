$(function() {

	$('.lazy').Lazy({
      scrollDirection: 'vertical',
      effect: 'fadeIn',
      visibleOnly: true,
      onError: function(element) {
          console.log('error loading ' + element.data('src'));
      }
    })

    if(!Modernizr.touch){
        myParaxify = paraxify('.paraxify');
    }

    AOS.init({disable: 'mobile'});

});
