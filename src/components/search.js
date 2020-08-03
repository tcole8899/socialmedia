import React from 'react';
import Firebase from '../Config/Firebase.js';
import Post from './post.js';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: null,
            usernamesArr: null,
            usernamesObj: null,
            displayUsers: null,
            display: null,
            profile: false
        }
        this.onSubmit = this.onSubmit.bind(this);
        //  this.renderProfile = this.renderProfile.bind(this);
    }

    componentDidMount() {
        const userQuery = Firebase.database().ref('usernames/');

        userQuery.once('value', snapshot => {
            let data = snapshot.val() ? snapshot.val() : {};
            console.log(Object.keys(data));
            this.setState({
                usernamesArr: Object.keys(data),
                usernamesObj: data
            })
        })

    }

    onInputChange = event => {
        const usernamesArr = this.state.usernamesArr;
        let displayUsers = [];
        console.log(event.target.value);
        if (event.target.value) {
            displayUsers = usernamesArr.filter(username => username.includes(event.target.value));
            this.setState({
                displayUsers: displayUsers,
                profile: false
            })
        }
        else {
            this.setState({ displayUsers: null });
        }
    }

    onSubmit = event => {
        const search = event.target.value;
        const userQuery = Firebase.database().ref('users/').orderByChild('username/').equalTo(search);
        userQuery.once('value', snapshot => {
            let data = snapshot.val() ? snapshot.val() : {};
            console.log(snapshot.val());
            //let fullData = { ...data };
            this.setState({
                display: data,
                profile: true
            })
        })
    }

    render() {
        var { display, profile, usernamesObj, displayUsers } = this.state;
        if (display !== null) {
            console.log(display);
        }
        return (
            <div className="Content">
                <div className="Content-input">
                    <input className="Search" placeholder="Search by Username" onChange={this.onInputChange} />

                </div>
                <div className="Content-posts">
                    {displayUsers !== null && !profile ?
                        Object.keys(usernamesObj).map((key, index) => {
                            let user = usernamesObj[key];
                            if (displayUsers.includes(key)) {
                                return <Post
                                    key={user}
                                    post={false}
                                    renderProfile={this.onSubmit}
                                    FollowUid={user}
                                    author={key}
                                />
                            }
                            else {
                                return null;
                            }
                        })
                        : null}
                    {profile ?
                        Object.keys(display).map((key, index) => {
                            let user = display[key];
                            console.log(user);
                            return Object.keys(user.posts).map((keyP, indexP) => {
                                let post = user.posts[keyP];
                                console.log(post);
                                try {
                                    return (<Post
                                        key={keyP}
                                        likes={post.likes}
                                        FollowUid={post.authorId}
                                        date={post.date.replace(/,/, " -")}
                                        postKey={keyP}
                                        post={true}
                                        author={post.author}
                                        text={post.text} />)
                                } catch (error) {
                                    console.error(error);
                                }
                                return null;
                            })
                        })
                        : null}
                </div>
            </div>
        );
    }
}

export default Search;