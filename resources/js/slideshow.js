import axios from "axios";
window.axios = axios;
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

import ImageGallery from "./ImageGallery";
import ScrollHelper from "./ScrollHelper.js";

document.addEventListener("DOMContentLoaded", () => {
    for (let i = 1; i <= 10; i++) {
        new ImageGallery(`card-${i}`);
    }
});

const scrollHelper = new ScrollHelper({
    scrollSpeed: 10,
    scrollInterval: 30,
    dragScrollMultiplier: 1,
});

scrollHelper.enable();
