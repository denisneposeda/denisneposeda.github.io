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

    var promoSlider = $('.promo-slider .owl-carousel').owlCarousel({
        loop:true,
        margin:0,
        nav:false,
        dots:false,
        mouseDrag:false,
        touchDrag:false,
        smartSpeed: 750,
        animateOut: 'fadeOut',
        items: 1,
        autoplay: true,
        onChanged: function(event) {
            let index = fixOwlCurrentIdx(event);
            console.log(index);
            $('.slider-control_link').eq( index ).addClass('is-active').siblings('.is-active').removeClass('is-active');
        }
    })

    function fixOwlCurrentIdx(event) {
        let current = (event.item.index + 1) - event.relatedTarget._clones.length / 2;
        let itemsCount = event.item.count;
    
        if (current > itemsCount || current == 0) {
            current = itemsCount - (current % itemsCount);
        }
    
        return current - 1;
    }

    $('.slider-control_link').click(function(e){
        e.preventDefault();
        if ( $(this).not('.is-active') ) {
            // $(this).addClass('is-active').siblings('.is-active').removeClass('is-active');
            var index = $(this).index();
            promoSlider.trigger('to.owl.carousel', index);
        }
    })

    $('.faq-block_control').click(function(e){
        e.preventDefault();
        $(this).next().slideToggle().parent().siblings().children('.faq-block_content:visible').slideUp();
    })

    $(window).scroll(function(e){
        ( $(this).scrollTop() > $('.header:not(.header-scroll)').outerHeight() ) ? $('body').addClass('scroll') : $('body').removeClass('scroll');
    })


    var sync1 = $("#sync1");
    var sync2 = $("#sync2");
    var slidesPerPage = 4; //globaly define number of elements per page
    var syncedSecondary = true;

    sync1.owlCarousel({
        items: 1,
        slideSpeed: 2000,
        nav: false,
        autoplay: false, 
        dots: false,
        loop: true,
        responsiveRefreshRate: 200}).on('changed.owl.carousel', syncPosition);

    sync2
        .on('initialized.owl.carousel', function() {
            sync2.find(".owl-item").eq(0).addClass("current");
        })
        .owlCarousel({
            items: slidesPerPage,
            dots: false,
            nav: true,
            smartSpeed: 200,
            slideSpeed: 500,
            slideBy: slidesPerPage, //alternatively you can slide by 1, this way the active slide will stick to the first item in the second carousel
            responsiveRefreshRate: 100,
            margin: 19
        }).on('changed.owl.carousel', syncPosition2);

    function syncPosition(el) {
        //if you set loop to false, you have to restore this next line
        //var current = el.item.index;

        //if you disable loop you have to comment this block
        var count = el.item.count - 1;
        var current = Math.round(el.item.index - (el.item.count / 2) - .5);

        if (current < 0) {
            current = count;
        }
        if (current > count) {
            current = 0;
        }

        //end block

        sync2
            .find(".owl-item")
            .removeClass("current")
            .eq(current)
            .addClass("current");
        var onscreen = sync2.find('.owl-item.active').length - 1;
        var start = sync2.find('.owl-item.active').first().index();
        var end = sync2.find('.owl-item.active').last().index();

        if (current > end) {
            sync2.data('owl.carousel').to(current, 100, true);
        }
        if (current < start) {
            sync2.data('owl.carousel').to(current - onscreen, 100, true);
        }
    }

    function syncPosition2(el) {
        if (syncedSecondary) {
            var number = el.item.index;
            sync1.data('owl.carousel').to(number, 100, true);
        }
    }

    sync2.on("click", ".owl-item", function(e) {
        e.preventDefault();
        var number = $(this).index();
        sync1.data('owl.carousel').to(number, 300, true);
    });

});
