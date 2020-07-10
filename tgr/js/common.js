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

    var owl = $('.tabs-carousel').eq(1).owlCarousel({
        loop:true,
        margin:10,
        nav:false,
        dots:false,
        items: 1
    })

    $('.gallery-control button').click(function(e){
        if ( $(this).not('.is-active') ) {
            $('.btn-2').text('Цена: '+$(this).data('price')+ ' руб.');
            $('.gallery-size').html($(this).data('size')+ ' м<sup>2</sup>');
            $(this).addClass('is-active').parent().siblings().children('.is-active').removeClass('is-active');
            var index = $(this).parent().index();
            owl.trigger('destroy.owl.carousel');
            owl = $('.tabs-carousel').eq(index).owlCarousel({
                loop:true,
                margin:10,
                nav:false,
                dots:false,
                items: 1
            })
        }
    })
    $('.prev').click(function(e){
        owl.trigger('prev.owl.carousel');
    })
    $('.next').click(function(e){
        owl.trigger('next.owl.carousel');
    })

    $(".demo").TimeCircles({
    start: true, // determines whether or not TimeCircles should start immediately.
    animation: "smooth", // smooth or ticks. The way the circles animate can be either a constant gradual rotating, slowly moving from one second to the other. 
    count_past_zero: true, // This option is only really useful for when counting down. What it does is either give you the option to stop the timer, or start counting up after you've hit the predefined date (or your stopwatch hits zero).
    circle_bg_color: "#ebeaea", // determines the color of the background circle.
    use_background: true, // sets whether any background circle should be drawn at all. 
    fg_width: 0.1, //  sets the width of the foreground circle. 
    bg_width: 1.2, // sets the width of the backgroundground circle. 
    text_size: 0.07, // This option sets the font size of the text in the circles. 
    total_duration: "Auto", // This option can be set to change how much time will fill the largest visible circle.
    direction: "Clockwise", // "Clockwise", "Counter-clockwise" or "Both".
    use_top_frame: false,
    start_angle: 0, // This option can be set to change the starting point from which the circles will fill up. 
    time: { //  a group of options that allows you to control the options of each time unit independently.
    Days: {
    show: true,
    text: "Дней",
    color: "#ed6e00"
    },
    Hours: {
    show: true,
    text: "Часов",
    color: "#ed6e00"
    },
    Minutes: {
    show: true,
    text: "Минут",
    color: "#ed6e00"
    },
    Seconds: {
    show: true,
    text: "Секунд",
    color: "#ed6e00"
    }
    }
})

});
