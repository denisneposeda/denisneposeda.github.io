$(function() {

	$('.lazy').Lazy({
      scrollDirection: 'vertical',
      effect: 'fadeIn',
      visibleOnly: true,
      onError: function(element) {
          console.log('error loading ' + element.data('src'));
      }
    });

    $('.form-select').selectric();
    $('.form-date').datepicker({timepicker: true});
    $('.form-phone').mask('+375 (99) 999-99-99');
    $('.form-checkout').click(function(e){
        e.preventDefault();
        if ( $('.checkout').is(':hidden') ) {
            var id = '#'+$(this).closest('.form').find('.checkout').attr('id');
            $.fancybox.open({
                src  : id,
                type : 'inline'
            });
        } else {
            $(this).closest('.form').addClass('is-checkout');
        }
    })
    $('.checkout-edit, .checkout-close').click(function(e){
        e.preventDefault();
        $(this).closest('.form').removeClass('is-checkout');
    })
    $('.form-map').click(function(){
        if ( $('.checkout').is(':hidden') ) {
            var id = '#'+$(this).closest('.form').find('.map').attr('id');
            $.fancybox.open({
                src  : id,
                type : 'inline'
            });
        } else {
            $(this).closest('.form').find('.map').addClass('is-show');
        }
    })
    $(document).mouseup(function (e){
        var div = $('.map');
        if (!div.is(e.target) && div.is(':visible')
            && div.has(e.target).length === 0) {
            div.removeClass('is-show');
        }
    })

    makeBody();
    
    function makeBody() {
        ( $(window).outerHeight() < ($('.header').outerHeight() + $('.form').outerHeight() + $('.footer').outerHeight() + 75) ) ? $('body').addClass('is-scrolled') : $('body').removeClass('is-scrolled');
    }

    $(window).resize(function(){
        makeBody();
        updateAnchors();
    })

    var anchors = [];
    var currentAnchor = -1;
    var isAnimating  = false;
        
    function updateAnchors() {
        anchors = [];
        $('.section').each(function(i, element){
            anchors.push( {id: $(element).attr('id'), scroll: $(element).offset().top} );
        });
    }

    

    $('body').on('mousewheel', function(e){
        e.preventDefault();
        e.stopPropagation();        
        if( isAnimating || $('body').is('.is-scrolled') ) {
            return false;
        } else {
            $('.map').removeClass('is-show');
        }
        // Increase or reset current anchor
        if( e.originalEvent.wheelDelta >= 0 ) {
            currentAnchor--;
        }else{
            currentAnchor++;
        }
        if( currentAnchor > (anchors.length - 1) ) {
            currentAnchor = anchors.length - 1;
        }
             
        if( currentAnchor < 0  ) {
            currentAnchor = 0;
        }
        isAnimating  = true;
        $('html, body').animate({
            scrollTop: parseInt( anchors[currentAnchor].scroll )
        }, 500, 'swing', function(){
            isAnimating  = false;
            $('.nav-list_link[href="#'+ anchors[currentAnchor].id +'"]').addClass('is-active').parent().siblings().children('.is-active').removeClass('is-active');
        });
    });

    updateAnchors();

    $('.nav-list_link').click(function(e){
        e.preventDefault();
        $(this).addClass('is-active').parent().siblings().children('.is-active').removeClass('is-active');
        var id = $(this).attr('href');
        $('html').removeClass('is-menu');
        $('.hamburger').removeClass('is-active');
        $('html, body').animate({
            scrollTop:  $(id).offset().top
        }, 500);
    })

    function getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }

    $('.hamburger').click(function(e){
        e.preventDefault();
        $(this).toggleClass('is-active');
        $('html').toggleClass('is-menu');
    })

});
