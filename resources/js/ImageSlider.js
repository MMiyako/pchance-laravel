class ImageSlider {
    constructor(sliderElement, timer = 7000) {
        this.sliderElement = sliderElement;
        this.images = this.sliderElement.querySelectorAll("img");
        this.currentIndex = 0;
        this.timer = timer;
        this.intervalId = null;
        this.isPaused = false;

        // Show the first image
        this.images[this.currentIndex].style.display = "block";

        // Start the slider
        this.startSlider();

        // Add mouse events
        this.sliderElement.addEventListener("mouseover", () =>
            this.stopSlider()
        );
        this.sliderElement.addEventListener("mouseout", () => {
            if (!this.isPaused) {
                this.startSlider();
            }
        });

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
        if (!this.isPaused) {
            // Only start a new interval if one is not already running
            if (!this.intervalId) {
                this.intervalId = setInterval(
                    () => this.changeImage(),
                    this.timer
                );
            }
        }
    }

    stopSlider() {
        clearInterval(this.intervalId);
        this.intervalId = null; // Reset intervalId to allow restarting later
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

    togglePause() {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.stopSlider();
        } else {
            this.startSlider();
        }
    }

    handleKeydown(event) {
        if (this.sliderElement.matches(":hover")) {
            if (event.key === "ArrowRight") {
                this.nextImage();
            } else if (event.key === "ArrowLeft") {
                this.previousImage();
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                this.timer = this.timer + 1000;
            } else if (event.key === "ArrowDown") {
                event.preventDefault();
                this.timer = this.timer - 1000;
            } else if (event.key === "p") {
                this.togglePause();
            } else if (event.key === "s") {
                let settings =
                    this.sliderElement.parentElement.querySelector(".settings");
                settings.style.display = "flex";
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

export default ImageSlider;
