import Snackbar from "../../snackbar";
import cssClass from "./style.scss";
import React from "react";
import { AppBar } from "react-toolbox/lib/app_bar";
import { ProgressBar } from "react-toolbox/lib/progress_bar";
// import { List, ListItem, ListSubHeader } from "react-toolbox/lib/list";
import browserHistory from "react-router/lib/browserHistory";

export default class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            folderName: props.routeParams.folderName,
            project: {
                name: props.routeParams.folderName,
                readme: "",
                versions: []
            }
        };
    }

    loadData() {
        this.setState({ loading: true });
        fetch(`/.cache/${this.state.folderName}.json`)
            .then(response => response.json())
            .then(data => {
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
            <AppBar fixed title={this.state.project.name} leftIcon="keyboard_arrow_left" onLeftIconClick={browserHistory.goBack} />
            {this.state.loading ? <ProgressBar mode='indeterminate' /> : []}
            <div className={cssClass.container}>
                <h5>{this.state.project.name}</h5>
                <div className={cssClass.content}>{this.state.project.description}</div>
            </div>
        </div>;
    }
}
