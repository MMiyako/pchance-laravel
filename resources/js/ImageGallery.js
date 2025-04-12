import ImageSlider from "./ImageSlider";

class ImageGallery {
    constructor(card) {
        this.card = document.getElementById(card);
        this.generatorSelect = this.card.querySelector(".select-generator");
        this.gallerySelect = this.card.querySelector(".select-gallery");
        this.fromInput = this.card.querySelector(".input-from");
        this.toInput = this.card.querySelector(".input-to");
        this.timerInput = this.card.querySelector(".input-timer");
        this.submitButton = this.card.querySelector(".button-submit");
        this.slider = this.card.querySelector(".slider");

        this.init();
    }

    init() {
        this.generatorSelect.addEventListener("change", (event) => {
            let generator = event.target.value;
            if (generator) this.loadGalleries(generator);
        });
        this.submitButton.addEventListener("click", (event) => {
            event.preventDefault();
            this.loadImages();
        });
    }

    loadGalleries(generator) {
        axios
            .get(`/slideshow/generators/${generator}/galleries`)
            .then((response) => {
                this.populateGalleries(response.data);
            })
            .catch((error) => {
                console.error("Error loading galleries:", error);
            });
    }

    populateGalleries(galleries) {
        this.gallerySelect.innerHTML = "";
        galleries.forEach((gallery) => {
            const option = document.createElement("option");
            option.value = gallery.id;
            option.textContent = `${gallery.name} (${gallery.images_count})`;
            option.setAttribute("data-count", gallery.images_count);
            this.gallerySelect.appendChild(option);
        });
    }

    loadImages() {
        let gallery = this.gallerySelect.value;
        let from = +this.fromInput.value;
        let to = +this.toInput.value;
        let count =
            +this.gallerySelect.options[
                this.gallerySelect.selectedIndex
            ].getAttribute("data-count");

        if (!gallery || !from || !to) {
            alert("Please fill all fields before submitting.");
            return;
        }

        if (to < from) {
            alert("'To' should be greater than 'From'.");
            return;
        }

        if (from > count || to > count) {
            alert(`Should be less or equal to ${count}`);
            return;
        }

        axios
            .get(`/slideshow/galleries/${gallery}/images`, {
                params: {
                    from,
                    to,
                },
            })
            .then((response) => {
                this.displayImages(response.data);
                this.displaySlider();
            })
            .catch((error) => {
                console.error("Error loading images:", error);
            });
    }

    displayImages(images) {
        this.slider.innerHTML = "";
        images.forEach((image) => {
            const imgElement = document.createElement("img");
            imgElement.src = image.url;
            imgElement.alt = image.name;
            this.slider.appendChild(imgElement);
        });
    }

    displaySlider() {
        let settings = this.card.querySelector(".settings");
        settings.style.display = "none";

        let timer = +this.timerInput.value;

        if (timer) {
            new ImageSlider(this.slider, +this.timerInput.value * 1000);
        } else {
            new ImageSlider(this.slider);
        }
    }
}

export default ImageGallery;
