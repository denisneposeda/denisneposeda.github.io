document.querySelectorAll('.blog-spoiler__action').forEach(button =>
	button.addEventListener('click', () => button.parentElement.classList.toggle('is-expanded'))
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

new Swiper(".equipment-items__slider", {
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
		},
		1200: {
			slidesPerView: 4
		}
	},
});

const portfolioGallery = document.querySelector(".portfolio-gallery__slider");
const portfolioGalleryItem = portfolioGallery.querySelectorAll(".portfolio-gallery__element");
const portfolioGalleryModal = document.querySelector(".gallery__modal");

portfolioGalleryItem.forEach((slide) => {
	slide.addEventListener("click", () => {
		const imageSrc = slide.querySelector("img").src;
		portfolioGalleryModal.innerHTML = `<img src="${imageSrc}" class="gallery__modal-source">`;
		portfolioGalleryModal.classList.add("gallery__modal_active");
	});
});

portfolioGalleryModal.addEventListener("click", (event) => {
	if (event.target.classList.contains("gallery__modal")) {
		portfolioGalleryModal.classList.remove("gallery__modal_active");
	}
});