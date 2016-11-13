import cssClass from "./css/main.scss";
import React from "react";
import ReactDom from "react-dom";
import Route from "react-router/lib/Route";
import Router from "react-router/lib/Router";
import IndexRoute from "react-router/lib/IndexRoute";
import BrowserHistory from "react-router/lib/browserHistory";
import "whatwg-fetch";

import Index from "./module/index/";
import Project from "./module/project/";

window.hideLoadingDiv = function () {
    const loadingDiv = document.getElementById("loading");
    loadingDiv.classList.add(cssClass.loadingFadeOut);
    setTimeout(() => document.body.removeChild(loadingDiv), 1000);
    window.hideLoadingDiv = function () { };
};

const container = document.getElementById("container");
setTimeout(() => {
    ReactDom.render(
        <Router history={BrowserHistory}>
            <Route path="/">
                <IndexRoute component={Index} />
                <Route path=":folderName/" component={Project} />
            </Route>
        </Router>, container);
}, 100);
