import React, { Component } from 'react';
import Layout from '../src/layout'

class index extends Component {
    render() {
        return (
            <Layout>
                <h1 style={{ textAlign: 'center' }}>Welcome to back office of Bor Bork Team.</h1>
                <img style={{ marginLeft: '45%', marginTop: 80 }} src="http://game.sritown.com/images/shooting_game_47.jpg" />
            </Layout>
        );
    }
}

export default index;