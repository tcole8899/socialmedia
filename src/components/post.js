import React from 'react';
import Firebase from '../Config/Firebase.js';

class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            post: true,
            followed: false
        }
        this.followUser = this.followUser.bind(this);
    }

    componentDidMount() {
        this.setState({
            post: this.props.post
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

    renderPost() {
        return (
            <div className="Post">
                <div className="Post-author">
                    <h5>@{this.props.author}</h5>
                </div>
                <div className="Post-text">
                    <p>{this.props.text}</p>
                </div>
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