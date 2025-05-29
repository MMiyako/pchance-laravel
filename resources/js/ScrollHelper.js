export default class ScrollHelper {
    constructor(config = {}) {
        this.config = {
            scrollSpeed: config.scrollSpeed || 20,
            scrollInterval: config.scrollInterval || 30,
            dragScrollMultiplier: config.dragScrollMultiplier || 2,
            ...config,
        };

        // State variables
        this.scrollUpActive = false;
        this.scrollDownActive = false;
        this.scrollIntervalId = null;
        this.isDragging = false;
        this.startY = 0;
        this.startScrollY = 0;

        // Bind methods to maintain 'this' context
        this.handleContinuousScroll = this.handleContinuousScroll.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleWindowBlur = this.handleWindowBlur.bind(this);
    }

    // ===== Core Methods =====
    handleContinuousScroll() {
        if (this.scrollUpActive) {
            window.scrollBy({
                top: -this.config.scrollSpeed,
                behavior: "instant",
            });
        } else if (this.scrollDownActive) {
            window.scrollBy({
                top: this.config.scrollSpeed,
                behavior: "instant",
            });
        }
    }

    // ===== Event Handlers =====
    handleKeyDown(e) {
        // Numpad 8 (up)
        if (
            e.key === "8" &&
            e.location === KeyboardEvent.DOM_KEY_LOCATION_NUMPAD
        ) {
            if (!this.scrollUpActive) {
                this.scrollUpActive = true;
                this.scrollIntervalId = setInterval(
                    this.handleContinuousScroll,
                    this.config.scrollInterval
                );
            }
            e.preventDefault();
        }
        // Numpad 2 (down)
        else if (
            e.key === "2" &&
            e.location === KeyboardEvent.DOM_KEY_LOCATION_NUMPAD
        ) {
            if (!this.scrollDownActive) {
                this.scrollDownActive = true;
                this.scrollIntervalId = setInterval(
                    this.handleContinuousScroll,
                    this.config.scrollInterval
                );
            }
            e.preventDefault();
        }
    }

    handleKeyUp(e) {
        if (
            (e.key === "8" || e.key === "2") &&
            e.location === KeyboardEvent.DOM_KEY_LOCATION_NUMPAD
        ) {
            this.scrollUpActive = false;
            this.scrollDownActive = false;
            clearInterval(this.scrollIntervalId);
        }

        if (e.key === "Control" && this.isDragging) {
            this.isDragging = false;
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        }
    }

    handleMouseDown(e) {
        if (e.ctrlKey) {
            this.isDragging = true;
            this.startY = e.clientY;
            this.startScrollY = window.scrollY;
            document.body.style.cursor = "grabbing";
            document.body.style.userSelect = "none";
            e.preventDefault();
        }
    }

    handleMouseMove(e) {
        if (this.isDragging) {
            const deltaY =
                (e.clientY - this.startY) * this.config.dragScrollMultiplier;
            window.scrollTo({
                top: this.startScrollY - deltaY,
                behavior: "instant",
            });
        }
    }

    handleMouseUp() {
        if (this.isDragging) {
            this.isDragging = false;
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        }
    }

    handleWindowBlur() {
        this.scrollUpActive = false;
        this.scrollDownActive = false;
        clearInterval(this.scrollIntervalId);

        if (this.isDragging) {
            this.isDragging = false;
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        }
    }

    // ===== Public Methods =====
    enable() {
        document.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("keyup", this.handleKeyUp);
        document.addEventListener("mousedown", this.handleMouseDown);
        document.addEventListener("mousemove", this.handleMouseMove);
        document.addEventListener("mouseup", this.handleMouseUp);
        window.addEventListener("blur", this.handleWindowBlur);
    }

    disable() {
        document.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("keyup", this.handleKeyUp);
        document.removeEventListener("mousedown", this.handleMouseDown);
        document.removeEventListener("mousemove", this.handleMouseMove);
        document.removeEventListener("mouseup", this.handleMouseUp);
        window.removeEventListener("blur", this.handleWindowBlur);

        // Clean up any active states
        this.scrollUpActive = false;
        this.scrollDownActive = false;
        clearInterval(this.scrollIntervalId);

        if (this.isDragging) {
            this.isDragging = false;
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        }
    }
}
