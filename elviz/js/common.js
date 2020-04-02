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

    var image_carousel = $('.item-image .item-image_carousel').owlCarousel({
        loop:false,
        margin:10,
        nav:false,
        dots:false,
        items:1,
        smartSpeed: 750,
        animateOut: 'fadeOut',
        touchDrag: false,
        mouseDrag: false
    })
    
    $('.item-image_small .item-image_carousel').owlCarousel({
        loop:false,
        margin:10,
        nav:false,
        dots:false,
        items:4,
        autoWidth:true,
        smartSpeed: 750
    })

    $('.item-image_control').eq(0).addClass('is-active');
    $('.item-image_control').click(function(e){
        e.preventDefault();
        var index = $(this).parent().index();
        if ( $(this).not('.is-active') ) {
            $(this).addClass('is-active').parent().siblings().children('.is-active').removeClass('is-active');
            image_carousel.trigger('to.owl.carousel', index);
        }
    });

    var page = window.location.hash,
    lastBlock = $('.main').children().first(),
    scrollItems = $('.main').children().map(function(){
      var item = $(this);
      if (item.length) { return item; }
    });

    $(window).scroll(function(event){
        var fromTop = $(this).scrollTop() + $(window).outerHeight()*.25;
        var cur = scrollItems.map(function(){
          if ($(this).offset().top < fromTop)
            return this;
        });

        cur = cur[cur.length-1];
        var Block = cur && cur.length ? cur : "";
        
        if (lastBlock !== Block) {
            lastBlock = Block;
        }
    });

    $('.scroll-btn_prev').click(function(e){
        e.preventDefault();
        if ( lastBlock.prev().length ) {
            $('html, body').animate({
                'scrollTop': lastBlock.prev().offset().top
            }, 500);
        }
    });
    $('.scroll-btn_next').click(function(e){
        e.preventDefault();
        if ( lastBlock.next().length ) {
            $('html, body').animate({
                'scrollTop': lastBlock.next().offset().top
            }, 500);
        }
    });

    $('input[name=y-phone]').mask("+375 (99) 999-99-99");
    $('input[name=y-phone]').click(function(){
        if($(this).val() == '+375 (__) ___-__-__'){
            $(this).setCursorPosition(6);
        }
	});			
	// set cursore position
    $.fn.setCursorPosition = function(pos) {
        if ($(this).get(0).setSelectionRange) {
            $(this).get(0).setSelectionRange(pos, pos);
        } else if ($(this).get(0).createTextRange) {
            var range = $(this).get(0).createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    };

    if ( window.location.hash.replace("#","") == 'entity' && $('.buying-control').length ) {
        $('.buying-control .btn').eq(1).click();
    }

});
