import React from 'react';
import Firebase from '../Config/Firebase.js';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            post: null
        };
    }

    onInputChange = event => {
        this.setState({
            post: event.target.value
        });
    }

    sendPost = async event => {
        event.preventDefault();
        const { post } = this.state;

        Firebase.database().ref('users/' + this.props.ActiveUser.uid + '/posts').set({
            post: post
        });
    }

    renderNoUser() {
        return (
            <div>
                <h1>Welcome to my Project!</h1>
                <p>Log In to start interacting!</p>
            </div>
        );
    }

    renderUser() {
        return (
            <div className="Content">
                <textarea className="Post" placeholder="Enter Text Here" id="post" onChange={this.onInputChange} />
                <button onClick={this.sendPost}>Send</button>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.props.ActiveUser.Authenticated ? this.renderUser() : this.renderNoUser()}
            </div>
        );
    }
}

export default Home;