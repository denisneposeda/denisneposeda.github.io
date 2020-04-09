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

    $('.college-control_link').click(function(e){
        e.preventDefault();
        var index = $(this).parent().index();
        if ( $(this).not('.is-active') ) {
            $(this).addClass('is-active').parent().siblings().children('.is-active').removeClass('is-active');
            $('.college-tab').eq(index).show().siblings().hide();
        }
    })

    $('.colleges-search .btn').click(function(){
        $(this).find('.icon-list').fadeToggle(0);
        $(this).find('.icon-location').fadeToggle(0);
        $('.colleges-list').fadeToggle(0);
        $('.colleges-map').fadeToggle(0);
        if (!$(this).data('status')) {
            $(this).find('span').text('Показать колледжи списком');
            $(this).data('status', true);
        }
        else {
            $(this).find('span').text('Показать колледжи на карте');
            $(this).data('status', false);
        }
    });

});
