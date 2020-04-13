$(function() {

	$('.lazy').Lazy({
      scrollDirection: 'vertical',
      effect: 'fadeIn',
      visibleOnly: true,
      onError: function(element) {
          console.log('error loading ' + element.data('src'));
      }
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

    if ( window.location.hash.replace("#","") != '' && $('.college-control').length ) {
        $('.college-control_link[data-tab="'+ window.location.hash.replace("#","") +'"]').click();
    }

    $('.header-nav_link').mouseenter(function(){
        if ( $(this).is('.header-nav_child') && $(window).outerWidth() > '992') {
            var index = $(this).parent().index();
            $(this).closest('.header').addClass('is-dropdown');
        } else {
            $('.header').mouseleave();
        }
    })

    $('.header').mouseleave(function(){
        if ( $(window).outerWidth() > '992' ) {
            $(this).removeClass('is-dropdown');
        }
    })

    $('.header-mob_open').click(function(e){
        $('html').addClass('is-menu');
    })

    $('.header-mob_close').click(function(e){
        if ( $('.header').is('.is-dropdown') ) {
            $('.header').removeClass('is-dropdown');
        } else {
            $('html').removeClass('is-menu');
        }
    })

    $('.header-nav_child').click(function(e){
        if ( $('html').is('.is-menu') ) {
            e.preventDefault();
            $('.header').addClass('is-dropdown');
        }
    })

    initRating();


    function initRating() {
        $('.reviews-rating').each(function(){
            var left = $(this).data('position')
            $(this).find('.reviews-rating_pointer').css({'left':left+'%'})
        })
    }

    $('.reviews-rating_item').click(function(e){
        e.preventDefault();
        var index = $(this).index(),
            position = 0,
            widthElem = 100/7,
            widthHalfElem = 100/16;
            rating = $(this).closest('.reviews-rating');
        rating.prev().val(index+1);
        switch (index) {
            case 0: position = 0; break;
            case 4: position = 50; break;
            case 8: position = 100; break;
            default: position = (widthHalfElem * index) + (widthHalfElem * index )
        }
        rating.data('position', position);
        initRating();
    })

});
