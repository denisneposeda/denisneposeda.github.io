AOS.init({
  once: true, // whether animation should happen only once - while scrolling down
});

$('.command .slider__content').slick({
	arrows: true,
	prevArrow: $('.command .slider__arrow_prev'),
	nextArrow: $('.command .slider__arrow_next'),
	dots: true,
	infinite: true,
	slidesToShow: 2,
	slidesToScroll: 2,
	swipe: true,
	appendDots: $('.command .slider__pagination'),
	responsive: [
	{
	breakpoint: 1024,
	settings: {
	slidesToShow: 2,
	slidesToScroll: 2
	}
	},
	{
	breakpoint: 768,
	settings: {
	slidesToShow: 1,
	slidesToScroll: 1
	}	
	},
	{
	breakpoint: 641,
	settings: {
	slidesToShow: 1,
	slidesToScroll: 1,
	swipe: true
	}
	}
	]
	});
$(document).ready(function() {
    // $(".input-phone").mask("+7(999)-999-99-99");

    "use strict";
    
    $(window).scroll(function() {

        "use strict";
        
        if ($(window).scrollTop() > 80) {    

            $("nav").addClass("nav_scrool");
            $(".mobile_logo").slideUp(0);
            // $("nav .row").css({'flex-direction':'row'});
            $("nav .row").css({'padding':'5px 0'});

        }
         else {
            $("nav").removeClass("nav_scrool"); 
            $(".mobile_logo").slideDown(400);  
             // $("nav .row").css({'flex-direction':'column'}); 
             $("nav .row").css({'padding':'0'});   
        }
    });
});

function showPopup() {
	$(".popup").show(300);
}
function hidePopup() {
	$(".popup").hide(300);
}
function show_spain_Popup() {
	$(".popup_spain").show(300);
}
function hide_spain_Popup() {	
	$(".popup_spain_content .card").hide(300, function() {
        $('.popup_spain_content .card').remove(); 
    }); 
	$(".popup_spain").hide(300);
}
$(function () {
    $('.card .small_btn').on('click', function () {
        var clo = $(this).closest(".card").clone();
        $(clo).prependTo( ".popup_spain_content");
    });
});
$(function() {
      $('.form').submit(function(e) {
        var $form = $(this);
          $.ajax({
              type: $form.attr('method'),
              url: $form.attr('action'),
              data: $form.serialize()
          }).done(function() {
            swal("Спасибо", "Ваша заявка принята, с вами свяжуться в ближайшее время", "success");
            $(".form").trigger("reset");
          }).fail(function() {
              swal("Плохо", "Что-то не сработало", "error");
          });
          //отмена действия по умолчанию для кнопки submit
          e.preventDefault();
          hidePopup();
      });
  });
$(function() {
      $('.formm').submit(function(e) {
        var $form = $(this);
          $.ajax({
              type: $form.attr('method'),
              url: $form.attr('action'),
              data: $form.serialize()
          }).done(function() {
            swal("Спасибо", "Ваша заявка принята, с вами свяжуться в ближайшее время", "success");
            $(".formm").trigger("reset");
          }).fail(function() {
              swal("Плохо", "Что-то не сработало", "error");
          });
          //отмена действия по умолчанию для кнопки submit
          e.preventDefault();
      });
  });
$(function() {
      $('.forma').submit(function(e) {
        var $form = $(this);
          $.ajax({
              type: $form.attr('method'),
              url: $form.attr('action'),
              data: $form.serialize()
          }).done(function() {
            swal("Спасибо", "Ваша заявка принята, с вами свяжуться в ближайшее время", "success");
            $(".forma").trigger("reset");
          }).fail(function() {
             swal("Плохо", "Что-то не сработало", "error");
          });
          //отмена действия по умолчанию для кнопки submit
          e.preventDefault();
          hide_spain_Popup();
      });
  });
$(".categories").on("click","a", function (event) {
        event.preventDefault();
        var id  = $(this).attr('href');
        var  top = $(id).offset().top;
        $('body,html').animate({scrollTop: top}, 1500);
    });
    $(".logo").on("click","a", function (event) {
        event.preventDefault();
        var id  = $(this).attr('href');
        var  top = $(id).offset().top;
        $('body,html').animate({scrollTop: top}, 1500);
    });

  $('.carousel').each(function(){
    $(this).slick({
      fade: true,
      lazyLoad: 'ondemand'
    });
  });
  $(function () {
  $('.info-control_link').click(function(e){
    e.preventDefault();
    var id = $(this).attr('href');
    console.log(id);
    $(this).addClass('is-active').siblings('.is-active').removeClass('is-active');
    $(id).show().siblings().hide();
    $(id).find('.carousel').slick('reinit');
  });
});

  $(function () {
    $('.info-content .small_btn').on('click', function () {
        var id = $(this).data('hotel'),
            clo = $('[data-id="'+ id +'"]').clone();
        // console.log(id);
        $(clo).prependTo( ".popup_spain_content");
    });
});