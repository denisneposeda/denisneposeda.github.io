document.addEventListener("DOMContentLoaded", function () {
  new Swiper(".about__features--mobi", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoHeight: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    breakpoints: {
      600: {
        slidesPerView: 2,
      },
      1000: {
        slidesPerView: 3,
      },
    },
  });
  new Swiper(".gallery__slider", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      900: {
        slidesPerView: 4,
      },
      1200: {
        slidesPerView: 5,
      },
    },
  });

  const gallery = document.querySelector(".gallery__list");
  const galleryItem = gallery.querySelectorAll(".gallery__element");
  const galleryModal = document.querySelector(".gallery__modal");

  galleryItem.forEach((slide) => {
    slide.addEventListener("click", () => {
      const type = slide.querySelector(".gallery__src").tagName;
      if (type === "IMG") {
        const imageSrc = slide.querySelector("img").src;
        galleryModal.innerHTML = `<img src="${imageSrc}" class="gallery__modal-source">`;
      }
      if (type === "VIDEO") {
        const videoSrc = slide.querySelector("video").src;
        galleryModal.innerHTML = `<video controls src="${videoSrc}" class="gallery__modal-source"></video>;`;
        const video = galleryModal.querySelector("video");
        video.play();
      }
      galleryModal.classList.add("gallery__modal_active");
    });
  });

  galleryModal.addEventListener("click", (event) => {
    if (event.target.classList.contains("gallery__modal")) {
      galleryModal.classList.remove("gallery__modal_active");
    }
  });
});
