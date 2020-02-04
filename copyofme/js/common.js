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

    $('.promo-carousel').owlCarousel({
        nav: true,
        dots: false,
        items: 1,
        smartSpeed: 750,
        'navText': ['<button class="btn btn-s btn-icon"><svg class="icon icon-arrow icon-white"><use xlink:href="#icon-arrow"></use></svg></button>','<button class="btn btn-s btn-icon"><svg class="icon icon-arrow icon-white"><use xlink:href="#icon-arrow"></use></svg></button>']
    })

    $('.events-carousel').owlCarousel({
        nav: true,
        dots: false,
        items: 1,
        smartSpeed: 750,
        'navText': ['<button class="btn btn-s btn-icon"><svg class="icon icon-arrow icon-white"><use xlink:href="#icon-arrow"></use></svg></button>','<button class="btn btn-s btn-icon"><svg class="icon icon-arrow icon-white"><use xlink:href="#icon-arrow"></use></svg></button>'],
        responsive : {
            0 : {
                nav: false
            },
            410: {
                nav: true
            }
        },
        margin: 10
    })

    $('.products-carousel').owlCarousel({
        dots: false,
        smartSpeed: 750,
        margin: 30,
        nav: true,
        'navText': ['<button class="btn btn-s btn-icon"><svg class="icon icon-arrow"><use xlink:href="#icon-arrow"></use></svg></button>','<button class="btn btn-s btn-icon"><svg class="icon icon-arrow"><use xlink:href="#icon-arrow"></use></svg></button>'],
        responsive : {
            0 : {
                items: 1,
                nav: false
            },
            410: {
                items: 2,
                nav: true
            },
            576 : {
                items: 3
            },
            768 : {
                items: 4
            }
        }
    })

    var cardCarousel = $('.card-carousel').owlCarousel({
        nav: false,
        dots: false,
        items: 1,
        smartSpeed: 750,
        margin: 10,
        URLhashListener:true,
        mouseDrag: false,
        touchDrag: false
    })

    $('.card-thumb_carousel').owlCarousel({
        nav: true,
        dots: false,
        items: 5,
        smartSpeed: 750,
        margin: 10,
        'navText': ['<button class="btn btn-xs btn-icon"><svg class="icon icon-arrow icon-small"><use xlink:href="#icon-arrow"></use></svg></button>','<button class="btn btn-xs btn-icon"><svg class="icon icon-arrow icon-small"><use xlink:href="#icon-arrow"></use></svg></button>'],
        responsive : {
            0 : {
                items: 2
            },
            410: {
                items: 3
            },
            576 : {
                items: 5
            }
        }
    })

    $('.card-thumb_block').first().parent().addClass('is-active');
    $('.card-thumb_block').click(function(){
        var index = $(this).parent().index();
        $(this).parent().addClass('is-active').siblings('.is-active').removeClass('is-active');
        cardCarousel.trigger('to.owl.carousel', index);
    })

    $('.form-search').submit(function(e){
        e.preventDefault();
        $.fancybox.open({ 
            src: '#search'
        });
    })

    $('[data-change]').click(function(e){
        e.preventDefault();
        var input = $(this).closest('.products-count').find('.form-control');
        ( $(this).data('change') == '+' ) ? input.val(parseInt(input.val()) + 1) : input.val(parseInt(input.val()) - 1);
    })

    $('.sets-delete').click(function(e){
        e.preventDefault();
    })

    if ( $('#uo').length > 0 ) {

        var softSlider = document.getElementById('uo');

        noUiSlider.create(softSlider, {
            range: {
                'min': 500,
                'max': 5000
            },
            start: [750, 3400],
            connect: true,
            pips: {
                mode: 'values',
                values: [500, 5000],
                density: 4
            },
            format: wNumb({
                decimals: 0
            })
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

    $('.hamburger').click(function(e){
        e.preventDefault();
        $(this).toggleClass('is-active');
        $('html').toggleClass('is-menu');
    })

    $('.aside-filter_text').click(function(e){
        e.preventDefault();
        $(this).parent().next().toggleClass('is-show');
    })


});
