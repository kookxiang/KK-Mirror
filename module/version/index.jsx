import Snackbar from "../../snackbar";
import cssClass from "./style.scss";
import React from "react";
import { AppBar } from "react-toolbox/lib/app_bar";
import { ProgressBar } from "react-toolbox/lib/progress_bar";
import { List, ListItem } from "react-toolbox/lib/list";
import { browserHistory } from "react-router";

function formatSize(size) {
    let i = -1;
    const byteUnits = [" KB", " MB", " GB", " TB", " PB", " EB", " ZB", " YB"];
    do {
        size = size / 1024;
        i++;
    } while (size > 1024);

    return Math.max(size, 0.01).toFixed(2) + byteUnits[i];
}

export class Version extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            folderName: props.params.folderName,
            version: props.params.version,
            projectName: "",
            releaseNote: "",
            files: []
        };
    }

    loadData() {
        this.setState({ loading: true });
        fetch(`/${this.state.folderName}/${this.state.version}/release.json`)
            .then(response => response.json())
            .then(data => {
                this.setState(Object.assign(data, { loading: false }));
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
            <AppBar fixed title={this.state.loading ? this.state.version : `${this.state.projectName} - ${this.state.version}`} leftIcon="arrow_back" onLeftIconClick={browserHistory.goBack} />
            {this.state.loading ? <ProgressBar mode='indeterminate' /> : []}
            <div className={this.state.loading ? cssClass.hidden : cssClass.container}>
                <h5>{this.state.projectName}- {this.state.version}:</h5>
                <div className={cssClass.content}>{this.state.releaseNote}</div>
            </div>
            <List ripple className={this.state.loading ? cssClass.hidden : cssClass.container}>
                {this.state.files.map(file => {
                    return <ListItem key={file.name} leftIcon="file_download" caption={file.name} legend={formatSize(file.size) + " Bytes"} to={`/${this.state.folderName}/${this.state.version}/${file.name}`} />;
                })}
            </List>
        </div>;
    }
}

export default Version;
