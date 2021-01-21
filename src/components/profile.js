import React from 'react';
import Firebase from '../Config/Firebase.js';
import Post from './post.js';
import User from './user.js';

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
            this.readProfile();
        } catch (error) {
            console.log(error);
        }
    }

    readProfile() {
        const postQuery = Firebase.database().ref('users/' + this.props.ActiveUser.uid + '/posts').orderByKey();

        postQuery.once('value', snapshot => {
            let data = snapshot.val() ? snapshot.val() : {};
            //  let fullData = {...data};
            this.setState({
                display: data
            })
        })
    }

    render() {
        if (this.state.display === null) {
            this.readProfile();
        }
        var display = this.state.display;
        var UID = this.props.ActiveUser.uid;

        return (
            <div className="container padding">
                <div className="row row-cols-lg-auto m-3">
                    <div className="col-md-3">
                        {UID ? <User uid={UID} profile={true} /> : null}
                    </div>
                    <div className="col-md-9">
                        <form className="row row-cols-lg-auto g-3 align-items-center mb-3">
                            <div className="col-12">
                                <div className="input-group">
                                    <textarea id="post" className="form-control" placeholder="Enter Text Here" onChange={this.onInputChange} />
                                    <button className="btn btn-outline-primary" onClick={this.sendPost}>Send</button>
                                </div>
                            </div>
                        </form>
                        <div className="Content-posts">
                            {display !== null ?
                                Object.keys(display).reverse().map((key, index) => {
                                    let post = display[key];
                                    try {
                                        return (<Post
                                            key={key}
                                            FollowUid={post.authorId}
                                            date={post.date}
                                            postKey={key}
                                            post={true}
                                            author={post.author}
                                            text={post.text} />)
                                    } catch (error) {
                                        console.error(error);
                                    }
                                    return null;
                                })
                                : null}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default Profile;