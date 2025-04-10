import "./bootstrap";

import Alpine from "alpinejs";

window.Alpine = Alpine;

Alpine.start();

import dragscroll from "dragscroll";

class ImageSlider {
    constructor(sliderElement, timer = 3000) {
        this.sliderElement = sliderElement;
        this.images = this.sliderElement.querySelectorAll("img");
        this.currentIndex = 0;
        this.timer = timer;
        this.intervalId = null;

        // Show the first image
        this.images[this.currentIndex].style.display = "block";

        // Start the slider
        this.startSlider();

        // Add mouse events
        this.sliderElement.addEventListener("mouseover", () =>
            this.stopSlider()
        );
        this.sliderElement.addEventListener("mouseout", () =>
            this.startSlider()
        );

        // Add keyboard navigation
        document.addEventListener("keydown", (event) =>
            this.handleKeydown(event)
        );

        // Add wheel event for scrolling
        this.sliderElement.addEventListener("wheel", (event) =>
            this.handleWheel(event)
        );
    }

    changeImage() {
        // Hide the current image
        this.images[this.currentIndex].style.display = "none";

        // Update the index to the next image
        this.currentIndex = (this.currentIndex + 1) % this.images.length;

        // Show the next image
        this.images[this.currentIndex].style.display = "block";
    }

    startSlider() {
        this.intervalId = setInterval(() => this.changeImage(), this.timer);
    }

    stopSlider() {
        clearInterval(this.intervalId);
    }

    nextImage() {
        this.images[this.currentIndex].style.display = "none";
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.images[this.currentIndex].style.display = "block";
    }

    previousImage() {
        this.images[this.currentIndex].style.display = "none";
        this.currentIndex =
            (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.images[this.currentIndex].style.display = "block";
    }

    handleKeydown(event) {
        if (this.sliderElement.matches(":hover")) {
            if (event.key === "ArrowRight") {
                this.nextImage();
            } else if (event.key === "ArrowLeft") {
                this.previousImage();
            }
        }
    }

    handleWheel(event) {
        if (this.sliderElement.matches(":hover")) {
            event.preventDefault(); // Prevent default scroll behavior
            if (event.deltaY > 0) {
                this.nextImage(); // Scroll down
            } else {
                this.previousImage(); // Scroll up
            }
        }
    }
}

// Instantiate the sliders
document.addEventListener("DOMContentLoaded", () => {
    const sliders = document.querySelectorAll(".slider");
    sliders.forEach((slider) => new ImageSlider(slider));
});
