import { Route, Router, browserHistory } from "react-router";
import React from "react";

import Index from "./module/index/";
import Project from "./module/project/";
import Version from "./module/version/";

module.exports = <Router history={browserHistory}>
    <Route path="/:folderName/:version" component={Version} />
    <Route path="/:folderName" component={Project} />
    <Route path="/" component={Index} />
</Router>;