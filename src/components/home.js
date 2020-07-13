import React from 'react';
import Post from './post.js';
import Firebase from '../Config/Firebase.js';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            post: null,
            display: null,
            following: null
        };
    }

    componentDidUpdate() {
        if (this.state.display === null) {
            this.getData();
        }
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


    getData() {
        //Get Usernames of following users
        const followingQuery = Firebase.database().ref('users/' + this.props.ActiveUser.uid + '/following');
        var following = [];

        followingQuery.once('value', snapshot => {
            snapshot.forEach(function(childSnapshot) {
                var key = childSnapshot.key;
                following.push(key);
            })
            this.setState({
                following: following
            })
        })

        const feedQuery = following === [] ? null : Firebase.database().ref('userPosts/');

        feedQuery.once('value', snapshot => {
            let data = snapshot.val() ? snapshot.val() : {};
            let fullData = { ...data };
            this.setState({
                display: fullData
            })
        })

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
        var display = this.state.display;
        var following = this.state.following;
    
        return (
            <div className="Content">
                <div className="Content-input">
                    <textarea className="Post-input" placeholder="Enter Text Here" onChange={this.onInputChange} />
                    <button onClick={this.sendPost}>Send</button>
                </div>
                <div className="Content-posts">
                    { (display !== null && following !== null) ? 
                            Object.keys(display).reverse().map((key, index) => {
                                let post = display[key];
                                if(following.includes(post.author)){
                                    return <Post key={key} post={true} author={post.author} text={post.text} />
                                }
                            })
                    : null}
                </div>
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