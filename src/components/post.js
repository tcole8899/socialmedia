import React from 'react';
import Firebase from '../Config/Firebase.js';

class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            post: true,
            likes: null,
            followed: false,
            liked: false
        }
        this.followUser = this.followUser.bind(this);
        this.likePost = this.likePost.bind(this);
    }

    componentDidMount() {
        this.setState({
            post: this.props.post
        })
        this.likeStatus();
    }

    likeStatus() {
        const postKey = this.props.postKey;
        const user = Firebase.auth().currentUser;

        var statusQuery = Firebase.database().ref('userPosts/' + postKey + '/likers');

        statusQuery.once('value', snapshot => {
            let status = snapshot.hasChild(user.displayName);
            let data = snapshot.val() ? snapshot.val() : {};
//            let fullData = { ...data };

            status = status ? data[user.displayName] : status;
            this.setState({ liked: status });
        })
    }


    followUser() {
        const author = this.props.author;
        const FollowUid = this.props.FollowUid;

        var user = Firebase.auth().currentUser;
        console.log(user);

        var updates = {};
        updates['users/' + user.uid + '/following/' + author] = FollowUid;
        updates['users/' + FollowUid + '/followers/' + user.uid] = user.displayName;

        Firebase.database().ref().update(updates);

        this.setState({ followed: true });
    }

    likePost() {
        const postKey = this.props.postKey;
        const likeUid = this.props.FollowUid;
        const user = Firebase.auth().currentUser;
        var liked = this.state.liked;

        console.log()

        var userLikeQuery = Firebase.database().ref('users/' + likeUid + '/posts/' + postKey + '/likes');
        var postLikeQuery = Firebase.database().ref('userPosts/' + postKey + '/likes');

        userLikeQuery.transaction(function (likes) {

            return liked ? likes - 1 : likes + 1;
        })

        postLikeQuery.transaction(function (likes) {
            return liked ? likes - 1 : likes + 1;
        })

        var updates = {};
        updates['users/' + likeUid + '/posts/' + postKey + '/likers/' + user.displayName] = liked ? false : true;
        updates['userPosts/' + postKey + '/likers/' + user.displayName] = liked ? false : true;

        Firebase.database().ref().update(updates);
        this.likeStatus();
    }

    renderPost() {
        var liked = this.state.liked;
        var text = liked ? "Unlike" : "Like";
        return (
            <div className="Post">
                <div className="Post-author">
                    <h5>@{this.props.author}</h5>
                    <div>
                        <div className="Post-like">
                            <p>{this.props.likes}</p>
                            <button onClick={this.likePost}>{text}</button>
                        </div>
                        <div>
                            <button>Comment</button>
                        </div>
                    </div>
                </div>
                <div className="Post-text">
                    <p>{this.props.text}</p>
                </div>

                <p>{this.props.date}</p>
            </div>
        )
    }

    renderSearch() {
        return (
            <div className="Post">
                <div className="Post-author">
                    <button onClick={this.props.renderProfile}>@{this.props.author}</button>
                </div>
                <div className="Post-follow">
                    {this.state.follow ? <button>Unfollow</button> : <button onClick={this.followUser}>Follow</button>}
                </div>
            </div>
        )
    }

    render() {
        const post = this.state.post;
        return (
            <div>
                {post ? this.renderPost() : this.renderSearch()}
            </div>
        );
    }
}

export default Post