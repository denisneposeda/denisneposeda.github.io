$(function() {

	$('.lazy').Lazy({
      scrollDirection: 'vertical',
      effect: 'fadeIn',
      visibleOnly: true,
      onError: function(element) {
          console.log('error loading ' + element.data('src'));
      }
    });

    makeShops();
    function makeShops() {
        $('.shops-block').css({
            'padding-left': ($(window).outerWidth() - $('.container').outerWidth()) / 2
        })
    };

    $('.shops-search').click(function(e){
        e.preventDefault();
        $('html, body').animate({
            'scrollTop':   $('#shops').offset().top
        }, 500);
    });

    var page = window.location.hash;
    if (page) {
        $('.header-fixed').find('.header-nav_link[href="'+ page +'"]').addClass('is-active');
    }

    var lastId,
    topMenu = $(".header-fixed"),
    menuItems = topMenu.find('.header-nav_link'),
    scrollItems = menuItems.map(function(){
      var item = $($(this).attr("href"));
      if (item.length) { return item; }
    });

    $(window).scroll(function(event){
        var fromTop = $(this).scrollTop()+topMenu.outerHeight() + $(window).outerHeight()*.25;
        ( $(this).scrollTop() > $('.header:not(.header-fixed)').outerHeight() ) ? topMenu.addClass('is-show') : topMenu.removeClass('is-show');  
        ( $(this).scrollTop() > ($('.header:not(.header-fixed)').outerHeight() + $(window).outerHeight()*.25)) ? $('.section-control').addClass('is-show') : $('.section-control').removeClass('is-show');  
        var cur = scrollItems.map(function(){
          if ($(this).offset().top < fromTop)
            return this;
        });
        cur = cur[cur.length-1];
        var id = cur && cur.length ? cur[0].id : "";
        
        if (lastId !== id) {
            lastId = id;
            menuItems
                .removeClass('is-active')
                .filter('[href="#'+id+'"]').addClass('is-active');
        }
        ( id == 'shops' ) ? $('.section-control_next').parent().fadeOut() : $('.section-control_next').parent().fadeIn();
    });
    
    $('.header-nav_link').click(function(e){
        e.preventDefault();
        var link = $(this).attr('href'),
            parent =  $(this).closest('.header').is('.header-fixed');
        (parent) ? $(this).addClass('is-active').parent().siblings().children('.is-active').removeClass('is-active') : $('.header-fixed').find('.header-nav_link[href="'+ link +'"]').addClass('is-active').parent().siblings().children('.is-active').removeClass('is-active');
        if ( $('html').is('.is-menu') ) {
            $('html').removeClass('is-menu');
            $('.hamburger').removeClass('is-active');
        }
        $('html, body').animate({
            'scrollTop':   $(link).offset().top - $('.header-fixed').outerHeight()
        }, 500);       
    });

    $('.section-control_prev').click(function(e){
        e.preventDefault();
        var menuActive = $('.header-fixed .header-nav_link.is-active');
        if (menuActive.attr('href')== '#about') {
            $('html, body').animate({
                'scrollTop':   0
            }, 500);  
        } else {
            menuActive.parent().prev().children('.header-nav_link').click();
        }
    });
    $('.section-control_next').click(function(e){
        e.preventDefault();
        $('.header-fixed .header-nav_link.is-active').parent().next().children('.header-nav_link').click();
    });

    $('.hamburger').click(function(e){
        e.preventDefault();
        $(this).toggleClass('is-active');
        $('html').toggleClass('is-menu');
    })

});
