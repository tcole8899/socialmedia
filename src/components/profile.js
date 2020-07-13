import React from 'react';
import Firebase from '../Config/Firebase.js';
import Post from './post.js';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            post: null,
            display: null
        };
    }

    componentDidUpdate() {
        if (this.state.display === null) {
            this.readProfile();
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
            updates['userPosts/' + newPostKey] = post;
            Firebase.database().ref().update(updates);
            this.readProfile();
        } catch (error) {
            console.log(error);
        }
    }

    readProfile() {
        const postQuery = Firebase.database().ref('users/' + this.props.ActiveUser.uid + '/posts').orderByKey();

        postQuery.once('value', snapshot => {
            let data = snapshot.val() ? snapshot.val() : {};
            let fullData = {...data};
            this.setState({
                display: fullData
            })
        })
    }

    render() {
        var display = this.state.display;
        if(display !== null){
            console.log(display);
        }
        return (
            <div className="Content">
                <div className="Content-input">
                    <textarea className="Post-input" placeholder="Enter Text Here" onChange={this.onInputChange} />
                    <button onClick={this.sendPost}>Send</button>
                </div>
                <div className="Content-posts">
                    {display !== null ? 
                            Object.keys(display).reverse().map((key, index) => {
                                let post = display[key];
                                return <Post key={key} post={true} author={post.author} text={post.text} />
                            })
                    : null}
                </div>
            </div>
        );
    }

}

export default Profile;