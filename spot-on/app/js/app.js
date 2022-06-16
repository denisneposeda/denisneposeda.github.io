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

	$('.hamburger').on('click', function () {
		$('body').toggleClass('nav-opened');
	})

	$('[type="file"]').on('change', function() {
		if ( $(this).val() != '' ) {
			let file = $(this)[0].files[0].name;
			$(this).next().addClass('form-file-item--upload');
			$(this).next().children('.form-file-item__src').text(file);
		} else {
			$(this).next().removeClass('form-file-item--upload');
		}
	});

	$('.form-file-item__delete').on('click', function(){
		$(this).closest('.form-file').find('[type="file"]').val('');
		$(this).closest('.form-file').find('[type="file"]').trigger('change');;
	})

	let loadedCarousel = false;

	$(document).on('mousemove', function() {
		if ( !loadedCarousel ) {
			loadCarousel();
		}
	})

	$(window).on('scroll', function() {
		if ( !loadedCarousel ) {
			loadCarousel();
		}
	})

	function loadCarousel() {
		loadedCarousel = true;

		$('.projects-carousel').owlCarousel({
			items:5,
			margin:0,
			dots: true,
			nav: false,
			lazyLoad: true,
			autoWidth: true,
			loop: false,
			touchDrag: true,
			mouseDrag: false,
		}).trigger('refresh.owl.carousel')
	}

	let video = $('.about__video');
	$('.about__video-control').on('click', function(){
		$(this).toggleClass('is-play');
		video[0].paused ? video[0].play() : video[0].pause()
	})
})