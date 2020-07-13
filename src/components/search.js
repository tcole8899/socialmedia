import React from 'react';
import Firebase from '../Config/Firebase.js';
import Post from './post.js';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: null,
            display: null,
            profile: false
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.renderProfile = this.renderProfile.bind(this);
    }

    onInputChange = event => {
        this.setState({
            search: event.target.value
        })
    }

    onSubmit() {
        const search = this.state.search;
        const userQuery = Firebase.database().ref('users/').orderByChild('username/').equalTo(search);

        userQuery.once('value', snapshot => {
            let data = snapshot.val() ? snapshot.val() : {};
            let fullData = { ...data };
            this.setState({
                display: fullData,
                profile: false
            })
        })
    }

    renderProfile() {
        this.setState({
            profile: true
        })
    }

    render() {
        var display = this.state.display;
        const profile = this.state.profile;
        if (display !== null) {
            console.log(display);
        }
        return (
            <div className="Content">
                <div className="Content-input">
                    <input className="Search" placeholder="Search Users" onChange={this.onInputChange} />
                    <button onClick={this.onSubmit}>Search</button>
                </div>
                <div className="Content-posts">
                    {display !== null && !profile ?
                        Object.keys(display).map((key, index) => {
                            let user = display[key];
                            console.log(user.posts);
                            return <Post key={key} post={false} renderProfile={this.renderProfile} FollowUid={key} author={user.username} />
                        })
                        : null}
                    {profile ?
                        Object.keys(display).map((key, index) => {
                            let user = display[key];
                            console.log(user);
                            return Object.keys(user.posts).map((keyP, indexP) => {
                                let post = user.posts[keyP];
                                console.log(post);
                                return <Post key={keyP} post={true} author={post.author} text={post.text} />
                            })
                        })
                        : null}
                </div>
            </div>
        );
    }
}

export default Search;