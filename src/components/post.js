import React from 'react';
import Comments from './comments.js'
import {AiOutlineHeart, AiFillHeart} from 'react-icons/ai';
import Firebase from '../Config/Firebase.js';

class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            post: true,
            likes: null,
            followed: false,
            liked: false,
            comment: false,
            commentModal: false
        }
        this.toggleComments = this.toggleComments.bind(this);
        this.followUser = this.followUser.bind(this);
        this.likePost = this.likePost.bind(this);
    }

    componentDidMount() {
        this.setState({
            post: this.props.post,
            comment: this.props.comment
        })
        this.likeStatus();
    }

    toggleComments() {
        this.setState({
            commentModal: !this.state.commentModal
        })
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

        var likeQuery = Firebase.database().ref('userPosts/' + postKey + '/likes');

        likeQuery.once('value', snapshot => {
            let data = snapshot.val() ? snapshot.val() : 0;
            console.log(data);
            this.setState({ likes: data });
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
        var { liked, likes } = this.state;
        var newLikeCount = liked ? likes - 1 : likes + 1;
        console.log(likes);

        console.log()

        var userLikeQuery = Firebase.database().ref('users/' + likeUid + '/posts/' + postKey + '/likes');
        var postLikeQuery = Firebase.database().ref('userPosts/' + postKey + '/likes');

        userLikeQuery.transaction(function (likeCount) {

            return liked ? likeCount - 1 : likeCount + 1;
        })

        postLikeQuery.transaction(function (likeCount) {
            return liked ? likeCount - 1 : likeCount + 1;
        })

        var updates = {};
        updates['users/' + likeUid + '/posts/' + postKey + '/likers/' + user.displayName] = liked ? false : true;
        updates['userPosts/' + postKey + '/likers/' + user.displayName] = liked ? false : true;

        Firebase.database().ref().update(updates);

        this.setState({
            liked: !liked,
            likes: newLikeCount
        })
    }

    renderPost() {
        var { liked, comment } = this.state;
        var text = liked ? <AiFillHeart /> : <AiOutlineHeart />;
        return (
            <div className="Post">
                <div className="Post-author">
                    <h5>@{this.props.author}</h5>
                </div>
                <div className="Post-text">
                    <p>{this.props.text}</p>
                </div>
                <div className="Post-info">
                    <div className="Post-like">
                        <p>{this.state.likes} Likes</p>
                        <button onClick={this.likePost}>{text}</button>
                    </div>
                    <div className="Post-comment">
                        {comment ? null :
                                <button onClick={this.toggleComments}>Comment</button>
                        }
                    </div>
                    <div className="Post-date">
                        <p>{this.props.date}</p>
                    </div>
                </div>

            </div>
        )
    }

    renderComments() {
        const followUid = this.props.FollowUid;
        return (
            <div>
                <Comments
                    postId={this.props.postKey}
                    toggleComments={this.toggleComments}
                    author={this.props.author}
                    text={this.props.text}
                    date={this.props.date}
                    authorUid={followUid}
                />
            </div>
        )

    }

    renderSearch() {
        return (
            <div className="Post">
                <div className="Post-author">
                    <button onClick={this.props.renderProfile} value={this.props.author}>@{this.props.author}</button>
                </div>
                <div className="Post-follow">
                    {this.state.follow ? <button>Unfollow</button> : <button onClick={this.followUser}>Follow</button>}
                </div>
            </div>
        )
    }

    render() {
        const { post, commentModal } = this.state;
        return (
            <div>
                {post ? this.renderPost() : this.renderSearch()}
                {commentModal ? this.renderComments() : null}
            </div>
        );
    }
}

export default Post