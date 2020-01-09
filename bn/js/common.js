$(function() {

    var mobile = 1300,
        small = 768;

    $('.lazy').Lazy({
        scrollDirection: 'vertical',
        effect: 'fadeIn',
        visibleOnly: true,
        onError: function(element) {
            console.log('error loading ' + element.data('src'));
        }
    })

    var promoCarousel = $('.promo-carousel').owlCarousel({
        loop:true,
        margin:0,
        nav:false,
        dots:false,
        items:1,
        smartSpeed:750,
        animateOut: 'fadeOut',
        mouseDrag:false,
        touchDrag:false
    })
    var promoCarousel2 = $('.promo-inner-carousel').owlCarousel({
        loop:true,
        margin:0,
        nav:false,
        dots:false,
        items:1,
        smartSpeed:750,
        animateOut: 'fadeOut',
        mouseDrag:false,
        touchDrag:false
    })

    $('.coverage .form').submit(function(e){
        e.preventDefault();
        var input = $(this).find('.form-control');
        input.parent().prop('class','form-group');
        if ( input.val() != '' ) {
            ( input.val() == 'Минск' ) ? input.parent().addClass('form-true') : input.parent().addClass('form-false')
        }
    });

    $('.coverage .form-control').keyup(function(e){        
        if ( $(this).val() == '' ) {
            $(this).parent().prop('class','form-group');
        }
    });

    $('.promo-substrate_carousel').owlCarousel({
        loop:true,
        margin:0,
        nav:false,
        dots:true,
        autoplayHoverPause:true,
        autoplay:true,
        items:1,
        smartSpeed:750,
        onChanged: function(event) {
            if ( promoCarousel ) promoCarousel.trigger('to.owl.carousel', [event.item.index, 750])
            if ( promoCarousel2 ) promoCarousel2.trigger('to.owl.carousel', [event.item.index, 750])
        }
    })

    var rev = $('.additional-carousel');
rev.on('init', function(event, slick, currentSlide) {
  var
    cur = $(slick.$slides[slick.currentSlide]),
    next = cur.next(),
    prev = cur.prev();
  prev.addClass('slick-sprev');
  next.addClass('slick-snext');
  cur.removeClass('slick-snext').removeClass('slick-sprev');
  slick.$prev = prev;
  slick.$next = next;
}).on('beforeChange', function(event, slick, currentSlide, nextSlide) {
  var
    cur = $(slick.$slides[nextSlide]);
  slick.$prev.removeClass('slick-sprev');
  slick.$next.removeClass('slick-snext');
  next = cur.next(),
    prev = cur.prev();
  prev.prev();
  prev.next();
  prev.addClass('slick-sprev');
  next.addClass('slick-snext');
  slick.$prev = prev;
  slick.$next = next;
  cur.removeClass('slick-next').removeClass('slick-sprev');
});

rev.slick({
  speed: 750,
  arrows: false,
  dots: false,
  focusOnSelect: true,
  infinite: true,
  centerMode: true,
  slidesPerRow: 1,
  slidesToShow: 1,
  slidesToScroll: 1,
  centerPadding: '0',
  swipe: true,
  autoplay:true,
  customPaging: function(slider, i) {
    return '';
  }
});

    var historyEvent = $('.history-events').owlCarousel({
        loop:false,
        margin:16,
        nav:true,
        dots:false,
        items:1,
        smartSpeed:750,
        navText: ['<svg class="icon icon-arrows"><use xlink:href="#icon-arrows"></use></svg>','<svg class="icon icon-arrows"><use xlink:href="#icon-arrows"></use></svg>'],
        responsive: {
            '575' : {
                nav:true,
            },
            '0': {
                nav: false
            }
        }
    })

    var historyYear = $('.history-carousel').owlCarousel({
        loop:false,
        margin:0,
        nav:true,
        dots:false,
        items:2,
        smartSpeed:750,
        autoWidth:true,
        navText: ['<svg class="icon icon-arrows icon-small"><use xlink:href="#icon-arrows"></use></svg>','<svg class="icon icon-arrows icon-small"><use xlink:href="#icon-arrows"></use></svg>'],
        center:true,
        responsive: {
            '575' : {
                nav:true,
            },
            '0': {
                nav: false
            }
        },
        onChanged: function(event) {
            historyEvent.trigger('to.owl.carousel', [event.item.index, 750])
        }
    })

    historyEvent.on('changed.owl.carousel', function(event) {
        historyYear.trigger('to.owl.carousel', [event.item.index, 750])
    })

    $('.history-block').click(function(e){
        e.preventDefault();
        historyYear.trigger('to.owl.carousel', [$(this).parent().index(), 750])
    })

    $('.informing-control_link').click(function(e){
        e.preventDefault();
        if ( $(this).not('.is-active') ) {
            $(this).addClass('is-active').parent().siblings().children('.is-active').removeClass('is-active');
            $('.informing-tabs').toggleClass('is-change');
        }
    })

    $('#search-open').click(function(e){
        e.preventDefault();
        $('.search').addClass('is-show');
    })

    $('#search-close').click(function(e){
        e.preventDefault();
        $('.search').removeClass('is-show');
    })

    $('#up').click(function(e){
        e.preventDefault();
        $('html,body').animate({ scrollTop: 0 }, 'slow');
    });

    if ( $(window).outerWidth() > 1299 ) {

        $('.informing-carousel').owlCarousel({
            loop:false,
            margin:24,
            nav:true,
            dots:false,
            items:3,
            smartSpeed:750,
            autoWidth:true,
            navText: ['<svg class="icon icon-arrows"><use xlink:href="#icon-arrows"></use></svg>','<svg class="icon icon-arrows"><use xlink:href="#icon-arrows"></use></svg>']
        })
    
    }

    if ( $(window).outerWidth() < small ) {

        $('.contacts-block .headline-medium').click(function(e){
            e.preventDefault();
            $(this).next().stop();
            $(this).toggleClass('is-active').next().slideToggle();
        })

        $('.tariffs-burst_info').click(function(e){
            e.preventDefault();
            $.fancybox.open({
                src  : '#burst-popup',
                type : 'inline'
            });
        })

    }

    $('.header-navbar_link, .header-topbar_link').click(function(e){
        if ( $(this).children('.icon-dropdown').length > 0 ) {
            e.preventDefault();
            if ( $(window).outerWidth() < small ) {
                $(this).toggleClass('is-show').next().stop().slideToggle();
                $('.header-navbar_link, .header-topbar_link').filter('.is-show').not($(this)).removeClass('is-show').next().stop().slideUp();
            }
        }
    });

    $('.client-carousel').owlCarousel({
        loop:true,
        margin:24,
        nav:false,
        dots:false,
        autoplayHoverPause:true,
        autoplay:true,
        items:10,
        smartSpeed:750,
        autoWidth:true,
        center:true
    })

    $('#header-menu').click(function(e){
        e.preventDefault();
        $('html').addClass('is-menu');
    })

    $('#header-mobile-search').click(function(e){
        e.preventDefault();
        $('html').addClass('is-search');
    })

    $('#header-close').click(function(e){
        e.preventDefault();
        var html =  $('html');
        ( html.is('.is-menu') ) ? html.removeClass('is-menu') : html.removeClass('is-search')
    })

    $('.faq-block').click(function(e){
        e.preventDefault();
        $(this).children('.faq-block_content').stop();
        $(this).toggleClass('is-active').children('.faq-block_content').slideToggle();
    })

    $('.tv-block_title').click(function(e){
        e.preventDefault();
        $(this).closest('.tv-block_control').next().stop();
        $(this).toggleClass('is-active').closest('.tv-block_control').next().slideToggle();
    })

    $('.tv-block_btn').click(function(e){
        e.preventDefault();
        $(this).closest('.tv-block_content').toggleClass('is-show');
    })

    $('.select').selectric();

    $('.tariffs-carousel').owlCarousel({
        loop:false,
        margin:60,
        dots:false,
        smartSpeed:750,
        navText: ['<svg class="icon icon-arrows"><use xlink:href="#icon-arrows"></use></svg>','<svg class="icon icon-arrows"><use xlink:href="#icon-arrows"></use></svg>'],
        items: 3,
        responsive: {
            '992' : {
                items: 3,
                nav: true
            },
            '576' : {
                items:2,
                nav: false
            },
            '0' : {
                items: 1,
                nav: false
            }
        }
    })

    $('.tariffs-carousel_big').owlCarousel({
        loop:false,
        margin:60,
        dots:false,
        smartSpeed:750,
        navText: ['<svg class="icon icon-arrows"><use xlink:href="#icon-arrows"></use></svg>','<svg class="icon icon-arrows"><use xlink:href="#icon-arrows"></use></svg>'],
        scrollbarType: "scroll",
        items: 3,
        responsive: {
            '992' : {
                items: 3,
                nav: true
            },
            '576' : {
                items:2,
                nav: false
            },
            '0' : {
                items: 1,
                nav: false
            }
        }
    })

    $('.tariffs-carousel_stud').owlCarousel({
        loop:false,
        margin:32,
        dots:false,
        smartSpeed:750,
        navText: ['<svg class="icon icon-arrows"><use xlink:href="#icon-arrows"></use></svg>','<svg class="icon icon-arrows"><use xlink:href="#icon-arrows"></use></svg>'],
        nav:false,
        responsive: {
            '1300' : {
                items: 4
            },
            '992' : {
                items: 3
            },
            '576' : {
                items: 2
            },
            '0' : {
                items: 1
            }
        }
    })

    $('.equipment-carousel').owlCarousel({
        loop:true,
        margin:0,
        dots:false,
        items:1,
        smartSpeed:750,
        autoplayHoverPause:true,
        autoplay:true,
        navText: ['<svg class="icon icon-arrows"><use xlink:href="#icon-arrows"></use></svg>','<svg class="icon icon-arrows"><use xlink:href="#icon-arrows"></use></svg>'],
        responsive: {
            '575' : {
                nav:true,
            },
            '0': {
                nav: false
            }
        }
    })

    $('.brands-carousel').owlCarousel({
        loop:true,
        margin:24,
        dots:false,
        items:5,
        smartSpeed:750,
        autoWidth:true,
        center:true,
        autoplayHoverPause:true,
        autoplay:true,
        navText: ['<svg class="icon icon-arrows"><use xlink:href="#icon-arrows"></use></svg>','<svg class="icon icon-arrows"><use xlink:href="#icon-arrows"></use></svg>'],
        responsive: {
            '575' : {
                nav:true,
            },
            '0': {
                nav: false
            }
        }
    })

    $('.compare-carousel').owlCarousel({
        loop:false,
        margin:30,
        navs: false,
        dots:false,
        smartSpeed:750,
        navText: ['<svg class="icon icon-arrows"><use xlink:href="#icon-arrows"></use></svg>','<svg class="icon icon-arrows"><use xlink:href="#icon-arrows"></use></svg>'],
        items: 3,
        responsive: {
            '992' : {
                autoWidth: true,
                items: 3,
                scrollbarType: false
            },
            '576' : {
                items: 2,
                autoWidth: false,
                scrollbarType: "scroll"
            },
            '0' : {
                autoWidth: false,
                items: 1,
                scrollbarType: "scroll"
            }
        }
    })

});
