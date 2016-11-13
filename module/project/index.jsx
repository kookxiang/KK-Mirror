import Snackbar from "../../snackbar";
import cssClass from "./style.scss";
import React from "react";
import { AppBar } from "react-toolbox/lib/app_bar";
import { ProgressBar } from "react-toolbox/lib/progress_bar";
import { List, ListItem } from "react-toolbox/lib/list";
import { browserHistory } from "react-router";

function version_compare(v1, v2) {
    var vm = { "dev": -6, "alpha": -5, "a": -5, "beta": -4, "b": -4, "RC": -3, "rc": -3, "#": -2, "p": 1, "pl": 1 };
    var _prepVersion = function (v) {
        v = ("" + v).replace(/[_\-+]/g, ".");
        v = v.replace(/([^.\d]+)/g, ".$1.").replace(/\.{2,}/g, ".");
        return (!v.length ? [-8] : v.split("."));
    };
    var _numVersion = function (v) {
        return !v ? 0 : (isNaN(v) ? vm[v] || -7 : parseInt(v, 10));
    };
    v1 = _prepVersion(v1);
    v2 = _prepVersion(v2);
    let x = Math.max(v1.length, v2.length);
    for (let i = 0; i < x; i++) {
        if (v1[i] === v2[i])  continue;
        v1[i] = _numVersion(v1[i]);
        v2[i] = _numVersion(v2[i]);
        if (v1[i] < v2[i]) {
            return -1;
        } else if (v1[i] > v2[i]) {
            return 1;
        }
    }
    return 0;
}

export class Project extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            folderName: props.params.folderName,
            project: {
                name: props.params.folderName,
                readme: "",
                latest: "",
                versions: []
            }
        };
    }

    loadData() {
        this.setState({ loading: true });
        fetch(`/${this.state.folderName}/metadata.json`)
            .then(response => response.json())
            .then(data => {
                data.versions = data.versions.sort((left, right) => -version_compare(left.version, right.version));
                this.setState({ loading: false, project: data });
            }).catch(() => {
                Snackbar.Show({
                    content: "Failed to load data.",
                    icon: "warning",
                    action: "RELOAD",
                    onAction: hide => {
                        this.loadData();
                        hide();
                    }
                });
            });
    }

    componentDidMount() {
        window.hideLoadingDiv();
        this.loadData();
    }

    redirect(target, e) {
        e.preventDefault();
        browserHistory.push(target);
    }

    componentWillUnmount() {
        Snackbar.Hide();
    }

    render() {
        return <div>
            <AppBar fixed title={this.state.project.name} leftIcon="arrow_back" onLeftIconClick={this.redirect.bind(this, "/")} />
            {this.state.loading ? <ProgressBar mode='indeterminate' /> : []}
            <div className={cssClass.container}>
                <h5>{this.state.project.name}</h5>
                <div className={cssClass.content}>{this.state.project.description}</div>
            </div>
            <List ripple className={this.state.loading ? cssClass.hidden : cssClass.container}>
                {this.state.project.versions.map(data => {
                    let isLatest = data.version == this.state.project.latest;
                    return <ListItem key={data.version} leftIcon={isLatest ? "folder_open" : "folder"} rightIcon={isLatest ? "star" : undefined} caption={data.version} legend={(isLatest ? "Latest Version. " : "") + "Release at: " + new Date(data.updateTime).toLocaleString()} to={`/${this.state.folderName}/${data.version}/`} onClick={this.redirect.bind(this, `/${this.state.folderName}/${data.version}/`)} />;
                })}
            </List>
        </div>;
    }
}

export default Project;
