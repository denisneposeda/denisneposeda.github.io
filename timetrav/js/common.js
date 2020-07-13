$(function() {

	$('.promo-carousel').owlCarousel({
        loop:false,
        margin:10,
        nav:false,
        items:1,
        dots:true
    })

    $('.benefits-carousel').owlCarousel({
        loop:false,
        margin:10,
        nav:false,
        items:1,
        dots:true
    })

    $('.story-carousel').owlCarousel({
        loop:false,
        margin:10,
        nav:true,
        items:1,
        dots:true
    })

    if (window.innerWidth > 768) {
        $('.offers-carousel').owlCarousel({
            loop:false,
            margin:10,
            nav:true,
            items:1,
            dots:true
        })
    }
    
    $('[data-popup]').click(function(e){
        e.preventDefault();
        var block = $(this).data('popup');
        $('html').addClass('popup-show');
        $(block).addClass('popup-open');
    })

    $('.popup-heading').click(function(e){
        e.preventDefault();
        $(this).closest('.popup').removeClass('popup-open').closest('html').removeClass('popup-show');
    })

});
