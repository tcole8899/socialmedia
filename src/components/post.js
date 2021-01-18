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
        this.followStatus();
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
            this.setState({ likes: data });
        })
    }

    followStatus() {
        const author = this.props.author;
        const user = Firebase.auth().currentUser;

        var followStatus = Firebase.database().ref('users/' + user.uid + '/following/');
        console.log(followStatus);

        followStatus.once('value', snapshot => {
            let data = snapshot.val() ? snapshot.val() : {};
            let status = Object.keys(data).includes(author);

            this.setState({
                followed: status
            });

            console.log(status);
        } )
    }


    followUser() {
        const author = this.props.author;
        const FollowUid = this.props.FollowUid;
        const followed = this.state.followed;

        var user = Firebase.auth().currentUser;
        console.log(user);

        var updates = {};
        updates['users/' + user.uid + '/following/' + author] = followed ? null : FollowUid;
        updates['users/' + FollowUid + '/followers/' + user.uid] = followed ? null : user.displayName;

        Firebase.database().ref().update(updates);

        this.setState({ followed: !followed });
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
            <div className="border border-secondary rounded mb-2">
                <div className="row mt-1">
                    <div className="col-md-2">
                        <p><b>@{this.props.author}</b></p>
                    </div>
                    <div className="col-md-10 text-left">
                        <p>{this.props.text}</p>
                    </div>
                </div>
                <div className="row mb-1">
                    <div className="col-md-3 btn-group ml-4" role="group">
                        <div className="btn btn-sm btn-outline-secondary mt-1 mb-1">{this.state.likes} Likes</div>
                        <button className="btn btn-sm btn-outline-danger mt-1 mb-1" onClick={this.likePost}>{text}</button>
                        {comment ? null :
                                <button className="btn btn-sm btn-outline-primary m-1 float-right" onClick={this.toggleComments}>Comment</button>
                        }
                    </div>
                    <div className="col-md float-right">
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
                    {this.state.followed ? <button onClick={this.followUser}>Unfollow</button> : <button onClick={this.followUser}>Follow</button>}
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