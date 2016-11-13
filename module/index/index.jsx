import Snackbar from "../../snackbar";
import cssClass from "./style.scss";
import React from "react";
import { AppBar } from "react-toolbox/lib/app_bar";
import { ProgressBar } from "react-toolbox/lib/progress_bar";
import { List, ListItem, ListSubHeader } from "react-toolbox/lib/list";
import browserHistory from "react-router/lib/browserHistory";

let unlock_time = 0, unlock_clicks = 1;

export default class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            showHidden: localStorage["showHidden"],
            group: []
        };
        this.onLock = this.onLock.bind(this);
        this.onUnlock = this.onUnlock.bind(this);
    }

    loadData() {
        this.setState({ loading: true });
        fetch("/.cache/global.json")
            .then(response => response.json())
            .then(data => {
                this.setState({ loading: false, group: data.group });
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

    componentWillUnmount() {
        Snackbar.Hide();
    }

    onUnlock() {
        if (this.state.showHidden) return;
        if (Date.now() - unlock_time > 1000) {
            unlock_time = Date.now();
            unlock_clicks = 1;
            return;
        }
        if (unlock_clicks < 5) {
            unlock_clicks++;
        } else {
            localStorage["showHidden"] = true;
            this.setState({ showHidden: true });
            Snackbar.Show({
                content: "Displaying all projects",
                timeout: 3000,
                action: "UNDO",
                onAction: (hide) => { this.onLock(); hide(); }
            });
        }
    }

    onLock() {
        if (!this.state.showHidden) return;
        delete localStorage["showHidden"];
        this.setState({ showHidden: false });
    }

    redirect(target, e) {
        e.preventDefault();
        browserHistory.push(target);
    }

    render() {
        return <div>
            <AppBar fixed title="KK's Mirror" />
            {this.state.loading ? <ProgressBar mode='indeterminate' /> : []}
            {this.state.group.filter(x => this.state.showHidden || !x.hidden).map(group => {
                return <List key={group.name} ripple className={this.state.loading ? cssClass.hidden : cssClass.container}>
                    <ListSubHeader caption={group.name} />
                    {group.project.filter(x => this.state.showHidden || !x.hidden).map(project => {
                        return <ListItem key={project.folder} avatar={project.image || "/images/folder.png"} caption={project.name} legend={project.description} to={project.folder + "/"} onClick={this.redirect.bind(this, project.folder + "/")} />;
                    })}
                </List>;
            })}
            <List ripple className={this.state.loading ? cssClass.hidden : cssClass.container}>
                <ListSubHeader caption='Sync Project' />
                {this.state.showHidden ? <ListItem leftIcon="visibility_off" caption="Hide Blocked Project" legend="Hide projects which is not allow to post here" onClick={this.onLock} /> : []}
                <ListItem leftIcon="sync" caption="Sync" legend="Last sync at 2016-11-12 16:20:40" />
                <ListItem leftIcon="send" caption="Feedback" legend="Contact server manager" to="mailto:kookxiang@gmail.com?subject=KK's Mirror Feedback" />
                <ListItem leftIcon="info" caption="About KK's Mirror" legend="V2.0.0 Beta" onClick={this.onUnlock} />
            </List>
        </div>;
    }
}
