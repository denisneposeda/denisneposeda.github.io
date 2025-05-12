document.querySelectorAll('.blog-spoiler__action').forEach(button =>
	button.addEventListener('click', () => button.parentElement.classList.add('is-expanded'))
);

new Swiper(".portfolio-gallery__slider", {
	slidesPerView: 1,
	spaceBetween: 20,
	loop: false,
	navigation: {
		nextEl: ".swiper-button-next",
		prevEl: ".swiper-button-prev",
	},
	breakpoints: {
		768: {
			slidesPerView: 2,
		},
		992: {
			slidesPerView: 3,
		}
	},
});