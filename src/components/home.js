import React from 'react';
import Post from './post.js';
import LoginModal from './loginModal.js';
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

        var postDate = new Date().toLocaleString();
        const post = {
            author: this.props.ActiveUser.user,
            authorId: this.props.ActiveUser.uid,
            text: this.state.post,
            likes: 0,
            date: postDate
        }

        try {
            var newPostKey = Firebase.database().ref().child('users/' + this.props.ActiveUser.uid + '/posts').push().key;

            var updates = {};
            updates['users/' + this.props.ActiveUser.uid + '/posts/' + newPostKey] = post;
            updates['userPosts/' + newPostKey] = post;
            Firebase.database().ref().update(updates);

            document.getElementById('post').value = "";

            this.getData();
        } catch (error) {
            console.log(error);
        }
    }


    getData() {
        //Get Usernames of following users
        const followingQuery = Firebase.database().ref('users/' + this.props.ActiveUser.uid + '/following');
        var following = [];

        followingQuery.once('value', snapshot => {
            snapshot.forEach(function (childSnapshot) {
                var key = childSnapshot.key;
                following.push(key);
            })
            following.push(this.props.ActiveUser.user);

            this.setState({
                following: following
            })
        })

        const feedQuery = following === [] ? null : Firebase.database().ref('userPosts/');

        feedQuery.once('value', snapshot => {
            let data = snapshot.val() ? snapshot.val() : {};
            //let fullData = { ...data };
            this.setState({
                display: data
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
        if (this.state.display === null) {
            this.getData();
        }
        var display = this.state.display;
        var following = this.state.following;

        return (
            <div className="container padding">
                <form className="row row-cols-lg-auto g-3 align-items-center mb-3" onSubmit="">
                    <div className="col-12">
                        <div className="input-group">
                            <textarea id="post" className="form-control" placeholder="Enter Text Here" onChange={this.onInputChange} />
                            <button className="btn btn-outline-primary" onClick={this.sendPost}>Send</button>
                        </div>
                    </div>
                </form>
                <div className="Content-posts">
                    {(display !== null && following !== null) ?
                        Object.keys(display).reverse().map((key, index) => {
                            let post = display[key];
                            try {
                                if (following.includes(post.author)) {
                                    return (<Post
                                        key={key}
                                        FollowUid={post.authorId}
                                        date={post.date}
                                        postKey={key}
                                        post={true}
                                        author={post.author}
                                        text={post.text} />)
                                }
                                else {
                                    return null;
                                }
                            } catch (error) {
                                console.error(error);
                            };
                            return null;
                        }
                        )
                        : null}
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="container-fluid">
                {this.props.ActiveUser.Authenticated ? this.renderUser() : <LoginModal {...this.state.props} ActiveUser={this.props.ActiveUser} inline={false} />}
            </div>
        );
    }
}

export default Home;