class ImageGallery {
    constructor(card) {
        // Constants
        this.constants = {
            SELECTORS: {
                GENERATOR: ".select-generator",
                GALLERY: ".select-gallery",
                FROM_INPUT: ".input-from",
                TO_INPUT: ".input-to",
                TIMER_INPUT: ".input-timer",
                SUBMIT_BUTTON: ".button-submit",
                SLIDER: ".slider",
                SETTINGS: ".settings",
                FLASH_OVERLAY: ".flash-overlay",
                STATUS_OVERLAY: ".status-overlay",
                PAUSE_STATUS: ".pause-status",
                COUNTDOWN_TIMER: ".countdown-timer",
                IMAGE_STATUS: ".image-status",
                MODE_SELECT: ".select-mode",
            },
            KEYCODES: {
                S: 83,
                ARROW_RIGHT: 39,
                ARROW_LEFT: 37,
                ARROW_UP: 38,
                ARROW_DOWN: 40,
                P: 80,
                H: 72,
            },
            HOVER_CLASS: "card-hover",
            DEFAULT_TIMER: 7000,
        };

        // DOM Elements
        this.card = document.getElementById(card);
        this.elements = {
            generatorSelect: this.card.querySelector(
                this.constants.SELECTORS.GENERATOR
            ),
            gallerySelect: this.card.querySelector(
                this.constants.SELECTORS.GALLERY
            ),
            fromInput: this.card.querySelector(
                this.constants.SELECTORS.FROM_INPUT
            ),
            toInput: this.card.querySelector(this.constants.SELECTORS.TO_INPUT),
            timerInput: this.card.querySelector(
                this.constants.SELECTORS.TIMER_INPUT
            ),
            submitButton: this.card.querySelector(
                this.constants.SELECTORS.SUBMIT_BUTTON
            ),
            slider: this.card.querySelector(this.constants.SELECTORS.SLIDER),
            settings: this.card.querySelector(
                this.constants.SELECTORS.SETTINGS
            ),
            flashOverlay: this.card.querySelector(
                this.constants.SELECTORS.FLASH_OVERLAY
            ),
            statusOverlay: this.card.querySelector(
                this.constants.SELECTORS.STATUS_OVERLAY
            ),
            pauseStatus: this.card.querySelector(
                this.constants.SELECTORS.PAUSE_STATUS
            ),
            countdownTimer: this.card.querySelector(
                this.constants.SELECTORS.COUNTDOWN_TIMER
            ),
            imageStatus: this.card.querySelector(
                this.constants.SELECTORS.IMAGE_STATUS
            ),
            modeSelect: this.card.querySelector(
                this.constants.SELECTORS.MODE_SELECT
            ),
        };

        // State
        this.currentIndex = 0;
        this.isPaused = false;
        this.isHovered = false;
        this.isOverlayHidden = false;
        this.isManualPause = false;
        this.isCardHovered = false;
        this.isSettingsVisible = true;

        // Timing controls
        this.timer = this.constants.DEFAULT_TIMER;
        this.intervalId = null;
        this.countdownId = null;
        this.flashTimeoutId = null;
        this.remainingTime = this.timer / 1000;

        // Initialize
        this.initialize();
    }

    /* ------------------- Initialization ------------------- */

    initialize() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Form controls
        this.elements.generatorSelect.addEventListener(
            "change",
            this.handleGeneratorChange.bind(this)
        );
        this.elements.submitButton.addEventListener(
            "click",
            this.handleSubmit.bind(this)
        );

        // Card hover state
        this.card.addEventListener(
            "mouseenter",
            () => (this.isCardHovered = true)
        );
        this.card.addEventListener(
            "mouseleave",
            () => (this.isCardHovered = false)
        );

        // Slider controls
        this.elements.slider.addEventListener("mouseover", () => {
            this.isHovered = true;
            if (!this.isManualPause) {
                this.stopSlider();
                this.elements.pauseStatus.classList.remove("pause-manual");
            }
        });

        this.elements.slider.addEventListener("mouseout", () => {
            this.isHovered = false;
            if (!this.isPaused || this.isManualPause) {
                this.startSlider();
            }
        });

        this.elements.slider.addEventListener("wheel", (e) =>
            this.handleWheel(e)
        );
        document.addEventListener("keydown", (e) => this.handleKeydown(e));
    }

    /* ------------------- Gallery Controls ------------------- */

    async handleGeneratorChange(event) {
        const generator = event.target.value;
        if (generator) await this.loadGalleries(generator);
    }

    async loadGalleries(generator) {
        try {
            const params = {};
            if (this.elements.modeSelect.value === 'favourite') {
                params.is_favourite = 1;
            }
            
            const response = await axios.get(
                `/slideshow/generators/${generator}/galleries`,
                { params }
            );
            this.populateGalleries(response.data);
        } catch (error) {
            this.handleError("Error loading galleries:", error);
        }
    }

    populateGalleries(galleries) {
        const fragment = document.createDocumentFragment();

        galleries.forEach((gallery) => {
            const option = new Option(
                `${gallery.name} (${gallery.images_count})`,
                gallery.id,
                false,
                false
            );
            option.dataset.count = gallery.images_count;
            fragment.appendChild(option);
        });

        this.elements.gallerySelect.replaceChildren(fragment);
    }

    async handleSubmit(event) {
        event.preventDefault();

        const validation = this.validateInputs();
        if (!validation.isValid) {
            alert(validation.message);
            return;
        }

        try {
            const response = await this.fetchImages();
            this.displayImages(response.data);
            this.initializeSlider();
        } catch (error) {
            this.handleError("Error loading images:", error);
        }
    }

    validateInputs() {
        const { gallerySelect, fromInput, toInput } = this.elements;
        const count = parseInt(
            gallerySelect.selectedOptions[0]?.dataset.count || 0
        );
        const from = parseInt(fromInput.value);
        const to = parseInt(toInput.value);

        if (!gallerySelect.value || !from || !to) {
            return {
                isValid: false,
                message: "Please fill all fields before submitting.",
            };
        }

        return { isValid: true };
    }

    async fetchImages() {
        const { gallerySelect, fromInput, toInput, modeSelect } = this.elements;
        const baseUrl = `/slideshow/galleries/${gallerySelect.value}/images`;
        const url = modeSelect.value === 'favourite' 
            ? `${baseUrl}/favourite` 
            : baseUrl;
    
        return axios.get(url, {
            params: {
                from: fromInput.value,
                to: toInput.value,
            },
        });
    }

    displayImages(images) {
        this.elements.slider.replaceChildren(
            ...images.map((image) => this.createImageElement(image))
        );
    }

    createImageElement(image) {
        const img = document.createElement("img");
        img.src = image.url;
        img.alt = image.name;
        img.hidden = true;
        return img;
    }

    toggleSettingsVisibility() {
        this.isSettingsVisible = !this.isSettingsVisible;

        if (this.isSettingsVisible) {
            this.elements.settings.style.display = "flex";
            this.elements.slider.style.display = "none";
            this.toggleOverlay("hide");
        } else {
            this.elements.settings.style.display = "none";
            this.elements.slider.style.display = "block";
            this.toggleOverlay("show");
        }
    }

    /* ------------------- Slider Controls ------------------- */

    initializeSlider() {
        this.toggleSettingsVisibility();
        this.images = this.elements.slider.querySelectorAll("img");
        this.timer =
            Number(this.elements.timerInput.value) * 1000 ||
            this.constants.DEFAULT_TIMER;

        this.showImage(this.currentIndex);
        this.updateImageStatus();
        this.startSlider();
    }

    startSlider() {
        if (this.intervalId || this.isPaused || this.isHovered) return;

        this.intervalId = setInterval(() => this.nextImage(), this.timer);
        this.startCountdown();
        this.updateStatusOverlay();
        this.setPauseStatus("", false);
    }

    stopSlider() {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.clearCountdown();
        this.setPauseStatus("❚❚", true);
    }

    nextImage() {
        this.changeImage((this.currentIndex + 1) % this.images.length);
    }

    previousImage() {
        this.changeImage(
            (this.currentIndex - 1 + this.images.length) % this.images.length
        );
    }

    changeImage(index) {
        this.currentIndex = index;
        this.showImage(this.currentIndex);
        this.updateImageStatus();
        this.handleManualChange();
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        this.isManualPause = this.isPaused;

        if (this.isPaused) {
            this.stopSlider();
            this.showFlashOverlay("❚❚");
            this.updatePauseIndicator(true);
        } else {
            this.isManualPause = false;
            this.updatePauseIndicator(false);
            if (!this.isHovered) this.startSlider();
            this.showFlashOverlay("▶");
            this.resetCountdown();
        }

        this.updateStatusOverlay();
    }

    /* ------------------- Countdown Controls ------------------- */

    startCountdown() {
        this.remainingTime = this.timer / 1000;
        this.elements.countdownTimer.textContent = this.remainingTime;

        this.countdownId = setInterval(() => {
            this.remainingTime--;
            this.elements.countdownTimer.textContent =
                this.remainingTime > 0 ? this.remainingTime : this.timer / 1000;

            if (this.remainingTime <= 0) {
                clearInterval(this.countdownId);
                this.countdownId = null;
            }
        }, 1000);
    }

    resetCountdown() {
        this.clearCountdown();
        if (!this.isPaused && !this.isHovered && !this.isOverlayHidden) {
            this.startCountdown();
        }
    }

    clearCountdown() {
        clearInterval(this.countdownId);
        this.countdownId = null;
        this.remainingTime = this.timer / 1000;
        this.elements.countdownTimer.textContent = this.isOverlayHidden
            ? ""
            : this.remainingTime;
    }

    /* ------------------- UI Updates ------------------- */

    updatePauseIndicator(isManual) {
        this.elements.pauseStatus.classList.toggle("pause-manual", isManual);
        this.setPauseStatus("❚❚", true);
    }

    showImage(index) {
        this.images.forEach((img, i) => {
            img.style.display = i === index ? "block" : "none";
        });
    }

    updateImageStatus() {
        this.elements.imageStatus.textContent = `${this.currentIndex + 1}/${
            this.images.length
        }`;
    }

    setPauseStatus(text, show) {
        this.elements.pauseStatus.textContent = text;
        this.elements.pauseStatus.style.display = show ? "flex" : "none";
    }

    showFlashOverlay(text) {
        clearTimeout(this.flashTimeoutId);
        this.elements.flashOverlay.textContent = text;
        this.elements.flashOverlay.style.display = "block";
        this.flashTimeoutId = setTimeout(() => {
            this.elements.flashOverlay.style.display = "none";
        }, 800);
    }

    updateStatusOverlay() {
        this.elements.statusOverlay.style.display = this.isOverlayHidden
            ? "none"
            : "block";
    }

    /* ------------------- Event Handlers ------------------- */

    handleKeydown(e) {
        // Handle card-level key commands (like 'S' for settings)
        if (this.isCardHovered && e.keyCode === this.constants.KEYCODES.S) {
            this.toggleSettingsVisibility();
            return;
        }

        // Handle slider key commands
        if (!this.elements.slider.matches(":hover")) return;

        const actions = {
            [this.constants.KEYCODES.ARROW_RIGHT]: () => this.nextImage(),
            [this.constants.KEYCODES.ARROW_LEFT]: () => this.previousImage(),
            [this.constants.KEYCODES.ARROW_UP]: () => this.adjustTimer(1000),
            [this.constants.KEYCODES.ARROW_DOWN]: () => this.adjustTimer(-1000),
            [this.constants.KEYCODES.P]: () => this.togglePause(),
            [this.constants.KEYCODES.H]: () => this.toggleOverlay(),
        };

        if (actions[e.keyCode]) {
            e.preventDefault();
            actions[e.keyCode]();
        }
    }

    handleWheel(e) {
        if (!this.elements.slider.matches(":hover")) return;
        e.preventDefault();
        e.deltaY > 0 ? this.nextImage() : this.previousImage();
    }

    /* ------------------- Helper Methods ------------------- */

    adjustTimer(change) {
        this.timer = Math.max(1000, this.timer + change);
        this.showFlashOverlay(this.timer);
        this.resetCountdown();
    }

    toggleOverlay(state = null) {
        if (state === "hide") {
            this.isOverlayHidden = true;
        } else if (state === "show") {
            this.isOverlayHidden = false;
        } else {
            this.isOverlayHidden = !this.isOverlayHidden;
        }
        this.updateStatusOverlay();
        if (!this.isOverlayHidden) {
            this.elements.countdownTimer.textContent = this.remainingTime;
        }
    }

    handleManualChange() {
        if (!this.isPaused && !this.isHovered && !this.isOverlayHidden) {
            this.resetCountdown();
        } else {
            this.clearCountdown();
        }
    }

    clearIntervals() {
        clearInterval(this.intervalId);
        clearInterval(this.countdownId);
        clearTimeout(this.flashTimeoutId);
    }

    handleError(message, error) {
        console.error(message, error);
        // Consider implementing a user-friendly error display
    }

    destroy() {
        this.clearIntervals();
        this.elements.slider.removeEventListener(
            "mouseover",
            this.handleMouseOver
        );
        this.elements.slider.removeEventListener(
            "mouseout",
            this.handleMouseOut
        );
        this.elements.slider.removeEventListener("wheel", this.handleWheel);
        document.removeEventListener("keydown", this.handleKeydown);

        this.images.forEach((img) => (img.style.display = "none"));
        this.elements.statusOverlay.style.display = "none";
        this.elements.flashOverlay.style.display = "none";
    }
}

export default ImageGallery;
