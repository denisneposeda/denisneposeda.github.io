import $ from 'jquery'
window.jQuery = $
window.$ = $

require('~/app/libs/owl.carousel/dist/owl.carousel.min.js')
require('~/app/libs/fancybox/dist/jquery.fancybox.min.js')

document.addEventListener('DOMContentLoaded', () => {

	updateVh();
	window.addEventListener('resize', () => {
		updateVh();
	});
	function updateVh() {
		document.querySelector(':root').style
			.setProperty('--vh', window.innerHeight / 100 + 'px');
	}

	const DESKTOP = 992;

	var observer = void 0;
	var config = {
		rootMargin: "250px 0px",
		threshold: .01
	};
	var images = window.document.querySelectorAll('.lazy');
	window.preloadImage = function preloadImage(element) {
		if (element.dataset && element.dataset.srcset) {
			element.srcset = element.dataset.srcset;
		}
		if (element.dataset && element.dataset.src) {
			element.src = element.dataset.src;
		}
		element.classList.remove('lazy');
	};
	window.preloadOnIntersection = function preloadOnIntersection(entries) {
		entries.forEach(function (entry) {
			if (entry.intersectionRatio > 0) {
				observer.unobserve(entry.target);
				preloadImage(entry.target);
			}
		});
	};
	if (!('IntersectionObserver' in window)) {
		Array.prototype.slice.call(images, 0).forEach(function (image) {
			return window.preloadImage(image);
		});
	} else {
		observer = new IntersectionObserver(window.preloadOnIntersection, config);
		Array.prototype.slice.call(images, 0).forEach(function (image) {
			observer.observe(image);
		});
	}

	$('.nav__link').on('click', function (e) {
		e.preventDefault();
		let id = $(this).attr('href');
		if ($('body').hasClass('nav-opened')) $('.hamburger').trigger('click');
		window.scrollTo({
			top: $(id).offset().top,
			behavior: "smooth"
		});
	})

	$('.hamburger').on('click', function () {
		$('body').toggleClass('nav-opened');
	})

	$('form').on('submit', function (e) {
		e.preventDefault();
		var serf = $(this);
		$.ajax({
			url: 'mail.php',
			type: "POST",
			dataType: "html",
			data: serf.serialize(),
			success: function (response) {
				serf.trigger("reset");
				serf.append('<div class="form-success">Ваша заявка отправлена!</div>');
				setTimeout(function () {
					$('.form-success').remove();
				}, 3000);
			},
			error: function (response) {
				console.log('error');
			}
		});
	});
})