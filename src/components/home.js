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
        const post = {
            author: this.props.ActiveUser.user,
            authorId: this.props.ActiveUser.uid,
            text: this.state.post,
            likes: 0
        }

        try {
            var newPostKey = Firebase.database().ref().child('users/' + this.props.ActiveUser.uid + '/posts').push().key;

            var updates = {};
            updates['users/' + this.props.ActiveUser.uid + '/posts/' + newPostKey] = post;
            Firebase.database().ref().update(updates);
        } catch (error) {
            console.log(error);
        }
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
                <textarea className="Post-input" placeholder="Enter Text Here" id="post" onChange={this.onInputChange} />
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