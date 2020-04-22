$(function() {

	headerToFix();

	$('.lazy').Lazy({
      scrollDirection: 'vertical',
      effect: 'fadeIn',
      visibleOnly: true,
      onError: function(element) {
          console.log('error loading ' + element.data('src'));
      }
  });

  $(window).scroll(function(){
  	headerToFix();
  });

  function headerToFix() {
  	( $(this).scrollTop() > $('.top').outerHeight() ) ? $('.header').addClass('fixed') : $('.header').removeClass('fixed');
  }

  var whatSlider = $('.what-slider .owl-carousel').owlCarousel({
    loop: false,
    margin:0,
    nav:false,
    dots:false,
    items:1,
    mouseDrag:false,
    animateOut: 'flipOutX',
    animateIn: 'flipInX',
    onInitialized: function(event) {
    	$('.what-slider_all').text('0'+event.item.count);
    },
    onChanged: function(event) {
    	$('.what-slider_current').text('0'+parseInt(event.item.index+1));
    },
    responsive : {
      0 : {
        touchDrag:true
      },
      992 : {
        touchDrag:false
      }
    }
  });

  $('.what-control').click(function(){
  	whatSlider.trigger('to.owl.carousel',$(this).index() - 1);
  });

  $('.examples-slider .owl-carousel').owlCarousel({
    loop: true,
    nav:true,
    dots:false,
    lazyLoad:true,
    mouseDrag:false,
    responsive : {
      0 : {
        items:1,
        margin:0,
        center:false,
        autoWidth:false
      },
      768 : {
        items:3,
        margin:-75,
        center:true,
        autoWidth:true
      }
    }
  });

  $('.range-slider .owl-carousel').owlCarousel({
    loop: false,
    margin:30,
    nav:true,
    dots:false,
    items:1,
    smartSpeed:750,
    mouseDrag:false
  });

  var serviceSlider = $('.service-slider .owl-carousel').owlCarousel({
    loop: false,
    margin:0,
    nav:false,
    dots:false,
    items:1,
    autoHeight:true,
    mouseDrag:false,
    touchDrag:false,
    smartSpeed:750,
    onInitialized: function(event) {
    	$('.service-tab').eq('0'+event.item.index).addClass('active');
    },
  });

  $('.service-tab').click(function(){
  	serviceSlider.trigger('to.owl.carousel',$(this).index());
  	$(this).addClass('active').siblings('.active').removeClass('active');
  });

  $('.steps-slider.owl-carousel').owlCarousel({
    loop: false,
    margin:0,
    nav:true,
    dots:false,
    items:1,
    mouseDrag:false,
    touchDrag:false,
    smartSpeed:750
  });

  $('.cookie-accept, .cookie-decept').click(function(){
  	$('.cookie').fadeOut();
  });

  $('.header-nav a').click(function(e){
  	e.preventDefault();
  	$('html,body').animate({
          scrollTop: $($(this).attr('href')).offset().top - $('.header').outerHeight()
        }, 1000);
  	if ( $('.header-hamburger').is(':visible') ) {
      $('.hamburger').removeClass('is-active');
      $('.header-nav').removeClass('is-show');
    }
    else {
      $(this).addClass('active').siblings('.active').removeClass('active');
    }
  });

  $('.hamburger').click(function(){
    $(this).toggleClass('is-active');
    $('.header-nav').toggleClass('is-show');
  });

  $('.popup-btn').click(function(){
    var title = $(this).data('title'),
        subtitle = $(this).data('subtitle'),
        button = $(this).data('button');
    $('#popup .popup-title').text(title);
    $('#popup input[name="form"]').val(title);
    $('#popup .popup-subtitle').text(subtitle);
    $('#popup button').text(button);
    $.fancybox.open($('#popup'));
  });

  $('.cookie-more,.cookie-decept').click(function(){
    $.fancybox.open($('#info-2'));
  });

});
