import React, {Component} from "react";
import {Route, Switch, withRouter} from "react-router-dom";
import ClusterWS from "clusterws-client-js";
import LoginScreen from "../Screens/LoginScreen";
import LobbyScreen from "../Screens/LobbyScreen";
import Context from "../Context/App";

@withRouter
export default class App extends Component {
    state = {
        loading: true,
        connected: false,
        game: null,
        arena: null,
        floor: 1,
        player: null,
        socket: null,
    };

    getContext() {
        return {
            loading: this.state.loading,
            connected: this.state.connected,
            game: this.state.game,
            arena: this.state.arena,
            floor: this.state.floor,
            player: this.state.player,
            connect: this.connect,
            disconnect: this.disconnect,
            changeFloor: this.changeFloor,
        };
    }

    changeFloor = floor => {
        this.setState({floor});
    };

    connect = async player => {
        const socket = new ClusterWS({
            url: `ws://localhost:3000/${encodeURI(JSON.stringify(player))}`,
        });

        await this.setState({socket, player});

        this.state.socket.on('connect', async () => {
            this.state.socket.send('connect', player);
            await this.setState({connected: true});
            this.props.history.push('/lobby');
        });

        this.state.socket.on('disconnect', () => {
            this.disconnect();
        });
    };

    disconnect = () => {
        this.setState({connected: false, socket: null, player: null});
    };

    async componentDidMount() {
        if (this.props.location.pathname !== '/') {
            this.props.history.push('/');
        }
        this.setState({loading: false});
    }

    render() {
        if (this.state.loading) {
            return null;
        }

        return (
            <Context.Provider value={this.getContext()}>
                <Switch>
                    <Route exact path="/" component={LoginScreen}/>
                    <Route exact path="/lobby" component={LobbyScreen}/>
                </Switch>
            </Context.Provider>
        );
    }
}
