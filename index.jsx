import cssClass from "./css/main.scss";
import ReactDom from "react-dom";
import "whatwg-fetch";

window.hideLoadingDiv = function () {
    const loadingDiv = document.getElementById("loading");
    loadingDiv.classList.add(cssClass.loadingFadeOut);
    setTimeout(() => document.body.removeChild(loadingDiv), 1000);
    window.hideLoadingDiv = function () { };
};

const container = document.getElementById("container");
var render = function () {
    ReactDom.render(require("./router.jsx"), container);
};

setTimeout(render, 100);

if (process.env.NODE_ENV == "dev" && module.hot) {
    module.hot.accept("./router.jsx", () => {
        ReactDom.unmountComponentAtNode(container);
        render();
    });
}
