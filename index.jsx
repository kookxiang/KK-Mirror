import cssClass from "./css/main.scss";
import React from "react";
import ReactDom from "react-dom";
import { Route, Router, IndexRoute, browserHistory } from "react-router";
import "whatwg-fetch";

import Index from "./module/index/";
import Project from "./module/project/";
import Version from "./module/version/";

window.hideLoadingDiv = function () {
    const loadingDiv = document.getElementById("loading");
    loadingDiv.classList.add(cssClass.loadingFadeOut);
    setTimeout(() => document.body.removeChild(loadingDiv), 1000);
    window.hideLoadingDiv = function () { };
};

const container = document.getElementById("container");
setTimeout(() => {
    ReactDom.render(
        <Router history={browserHistory}>
            <Route path="/:folderName/:version" component={Version} />
            <Route path="/:folderName" component={Project} />
            <Route path="/" component={Index} />
        </Router>, container);
}, 100);
