$(function() {

	$('.lazy').Lazy({
      scrollDirection: 'vertical',
      effect: 'fadeIn',
      visibleOnly: true,
      onError: function(element) {
          console.log('error loading ' + element.data('src'));
      }
    });

    $('.header-nav_link').mouseenter(function(){
        if ( $(this).is('.header-nav_child') ) {
            var index = $(this).parent().index();
            $(this).closest('.header').addClass('is-dropdown').find('.header-dropdown_item').eq(index).css({'display': 'flex'}).siblings().css({'display':'none'});
        } else {
            $('.header').mouseleave();
        }
    })

    $('.header').mouseleave(function(){
        $(this).removeClass('is-dropdown').find('.header-dropdown_item').css({'display':'none'});
    })

    $('.hamburger').click(function(e){
        e.preventDefault();
        $(this).toggleClass('is-active');
        $('html').toggleClass('is-menu');
    })

    $('.buying-control .btn').click(function(e){
        e.preventDefault();
        var index = $(this).parent().index();
        if ( $(this).not('.is-active') ) {
            $(this).addClass('is-active').parent().siblings().children('.is-active').removeClass('is-active');
            $('.buying-tab').eq(index).show().siblings().hide();
        }
    })

    $('.item-image .item-image_carousel').owlCarousel({
        loop:false,
        margin:10,
        nav:false,
        dots:false,
        items:1
    })
    
    $('.item-image_small .item-image_carousel').owlCarousel({
        loop:false,
        margin:10,
        nav:false,
        dots:false,
        items:4,
        autoWidth:true
    })
});
