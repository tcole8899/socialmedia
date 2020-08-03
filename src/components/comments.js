import React from 'react';
import Post from './post.js';
import Firebase from '../Config/Firebase.js';

class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            postId: null,
            display: null,
            comment: null
        };
        this.sendComment = this.sendComment.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    onInputChange = event => {
        this.setState({
            comment: event.target.value
        });
    }

    sendComment = async event => {
        event.preventDefault();

        var commentDate = new Date().toLocaleString();
        const user = Firebase.auth().currentUser;

        const comment = {
            author: user.displayName,
            authorId: user.uid,
            text: this.state.comment,
            likes: 0,
            date: commentDate
        }

        try {
            var newPostKey = Firebase.database().ref().child('userPosts/' + this.props.postId + '/comments').push().key;

            var updates = {};
            updates['users/' + this.props.authorUid + '/posts/' + this.props.postId + '/comments/' + newPostKey] = comment;
            updates['userPosts/' + this.props.postId + '/comments/' + newPostKey] = comment;
            Firebase.database().ref().update(updates);
            this.getData();
        } catch (error) {
            console.log(error);
        }
    }


    getData() {
        var postId = this.props.postId
        const commentQuery = Firebase.database().ref('userPosts/' + postId + '/comments').orderByKey();

        commentQuery.once('value', snapshot => {
            let data = snapshot.val() ? snapshot.val() : {}
            console.log(data);

            this.setState({
                display: data
            })
        })
    }



    render() {
        var display = this.state.display;
        console.log(display);
        return (
            <div className="Login-background">
                <div className="Login-form">
                    <button onClick={this.props.toggleComments} >Close</button>
                    <Post
                        author={this.props.author}
                        postKey={this.props.postId}
                        text={this.props.text}
                        date={this.props.date}
                        post={true}
                        comment={true}
                    />
                    <div>
                        <div className="Content-input">
                            <textarea className="Post-input" placeholder="Enter Text Here" onChange={this.onInputChange} />
                            <button onClick={this.sendComment}>Send</button>
                        </div>
                        <div className="Content-posts">
                            {display !== null ?
                                Object.keys(display).reverse().map((key, index) => {
                                    let post = display[key];
                                    return (<Post
                                        key={key}
                                        likes={post.likes}
                                        FollowUid={post.authorId}
                                        date={post.date}
                                        postKey={key}
                                        post={true}
                                        author={post.author}
                                        text={post.text} 
                                        comment={true}
                                        />)
                                })
                                : null}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default Comments;