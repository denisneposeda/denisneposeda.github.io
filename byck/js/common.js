$(function() {

	$('.lazy').Lazy({
      scrollDirection: 'vertical',
      effect: 'fadeIn',
      visibleOnly: true,
      onError: function(element) {
          console.log('error loading ' + element.data('src'));
      }
    });

    $('.hamburger').click(function(e){
        e.preventDefault();
        $(this).toggleClass('is-active');
        $('html').toggleClass('is-menu');
    })

    $('.promo-carousel').owlCarousel({
        loop:true,
        margin:0,
        nav:false,
        dots:true,
        items:1,
        smartSpeed:750
    })

    $('.item-carousel').owlCarousel({
        loop:false,
        margin:7,
        nav:true,
        dots:false,
        smartSpeed:750,
        responsive : {
            0 : {
                items: 1
            },
            410 : {
                items: 2
            },
            576 : {
                items: 3
            },
            1200 : {
                items: 1
            },
            1600 : {
                items: 2
            }
        }
    })
    makeItem();
    $(window).resize(function(){
        makeItem();
    })
    function makeItem() {
        if ($( window ).outerWidth() > 1200) {
            $('.item-content').css({
                'padding-right': $('.container').offset().left
            })
        } else {
            $('.item-content').removeAttr('style');
        }
    }
    $('.aside-control').click(function(e){
        e.preventDefault()
        $(this).next().slideToggle();
    })


    if ( $('#uo').length > 0 ) {

        var softSlider = document.getElementById('uo');

        noUiSlider.create(softSlider, {
            range: {
                'min': 26,
                'max': 450
            },
            start: [26, 450],
            connect: true,
            format: wNumb({
                decimals: 0
            }),
            tooltips: true
        });

        var inputNumberMin = document.getElementById('input-number-min'),
            inputNumberMax = document.getElementById('input-number-max');

        softSlider.noUiSlider.on('update', function (values, handle) {
            var value = values[handle];
            if (handle) {
                inputNumberMax.value = value;
            } else {
                inputNumberMin.value = value;
            }
        });

        inputNumberMin.addEventListener('change', function () {
            softSlider.noUiSlider.set([this.value, null]);
        });

        inputNumberMax.addEventListener('change', function () {
            softSlider.noUiSlider.set([null, this.value]);
        });
    }

});
