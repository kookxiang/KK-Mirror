import Snackbar from "../../snackbar";
import cssClass from "./style.scss";
import React from "react";
import { AppBar } from "react-toolbox/lib/app_bar";
import { ProgressBar } from "react-toolbox/lib/progress_bar";
import { List, ListItem } from "react-toolbox/lib/list";
import { browserHistory } from "react-router";

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
        fetch(`/.cache/${this.state.folderName}.json`)
            .then(response => response.json())
            .then(data => {
                data.versions = data.versions.sort((left, right) => {
                    if (typeof left.version + typeof right.version != "stringstring")
                        return false;
                    var a = left.version.split("."), b = right.version.split("."), i = 0, len = Math.max(a.length, b.length);
                    for (; i < len; i++) {
                        if ((a[i] && !b[i] && parseInt(a[i]) > 0) || (parseInt(a[i]) > parseInt(b[i]))) {
                            return -1;
                        } else if ((b[i] && !a[i] && parseInt(b[i]) > 0) || (parseInt(a[i]) < parseInt(b[i]))) {
                            return 1;
                        }
                    }
                    return 0;
                });
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
                    return <ListItem key={data.version} leftIcon={isLatest ? "folder_open" : "folder"} rightIcon={isLatest ? "star" : undefined} caption={data.version} legend={(isLatest ? "Latest Version. " : "") + "Release at: " + data.updateTime} to={`/${this.state.folderName}/${data.version}/`} onClick={this.redirect.bind(this, `/${this.state.folderName}/${data.version}/`)} />;
                })}
            </List>
        </div>;
    }
}

export default Project;
