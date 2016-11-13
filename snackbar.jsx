import React from "react";
import ReactDom from "react-dom";
import _Snackbar from "react-toolbox/lib/snackbar";

let SnackbarList = [];

export class Snackbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false
        };

        this.hide = this.hide.bind(this);
        this.onAction = () => {
            this.props.onAction(this.hide);
        };
        SnackbarList.push(this);
    }

    hide() {
        this.setState({ active: false });
        setTimeout(this.destroy.bind(this), 1000);
    }

    destroy() {
        if (SnackbarList.indexOf(this) >= 0) {
            delete SnackbarList[SnackbarList.indexOf(this)];
        }
        ReactDom.unmountComponentAtNode(this.props.container);
        document.body.removeChild(this.props.container);
    }

    componentDidMount() {
        this.setState({ active: true });
    }

    render() {
        return <_Snackbar action={this.props.action} active={this.state.active} icon="warning" label={this.props.content} timeout={this.props.timeout} onClick={this.onAction} onTimeout={this.hide} type={this.props.type} />;
    }

    static Show(_config) {
        let container = document.createElement("div");
        document.body.appendChild(container);

        let config = Object.assign({
            type: "cancel",
            icon: "warning",
            onAction: function (hide) { hide(); }
        }, _config);

        ReactDom.render(<Snackbar {...config} container={container} />, container);
    }

    static Hide() {
        SnackbarList.forEach(snackbar => snackbar.hide());
    }
}

export default Snackbar;
