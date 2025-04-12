import axios from "axios";
window.axios = axios;
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

import ImageGallery from "./ImageGallery";

document.addEventListener("DOMContentLoaded", () => {
    for (let i = 1; i <= 10; i++) {
        new ImageGallery(`card-${i}`);
    }
});
