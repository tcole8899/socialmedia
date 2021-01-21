import React from 'react';
import Firebase from '../Config/Firebase.js';
import Post from './post.js';
import User from './user.js';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: null,
            searchUser: null,
            showUser: false,
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
            this.setState({
                usernamesArr: Object.keys(data),
                usernamesObj: data
            })
        })

    }

    onInputChange = event => {
        const usernamesArr = this.state.usernamesArr;
        let displayUsers = [];
        if (event.target.value) {
            displayUsers = usernamesArr.filter(username => username.includes(event.target.value));
            this.setState({
                displayUsers: displayUsers,
                profile: false,
                showUser: false
            })
        }
        else {
            this.setState({ 
                displayUsers: null,
                showUser: true 
            });
        }
    }

    onSubmit = event => {
        const search = event.target.value;
        const userQuery = Firebase.database().ref('users/').orderByChild('username/').equalTo(search);
        userQuery.once('value', snapshot => {
            let data = snapshot.val() ? snapshot.val() : null;
            //let fullData = { ...data };
            this.setState({
                display: data,
                profile: true,
                searchUser: Object.keys(data)[0],
                showUser: true
            })
        })
    }

    render() {
        var { display, profile, usernamesObj, displayUsers, searchUser, showUser} = this.state;

        return (
            <div className="Profile">
                {searchUser && showUser ? <User uid={searchUser} profile={false} /> : null}
                <div className="container padding">
                    <form className="mb-3">
                        <input className="form-control" placeholder="Search by Username" onChange={this.onInputChange} />
                    </form>
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
                                        date=","
                                    />
                                }
                                else {
                                    return null;
                                }
                            })
                            : null}
                        { display !== null && profile ?
                            Object.keys(display).map((key, index) => {
                                let user = display[key];
                                if ('posts' in user){
                                    return Object.keys(user.posts).map((keyP, indexP) => {
                                        let post = user.posts[keyP];
                                        try {
                                            return (<Post
                                                key={keyP}
                                                likes={post.likes}
                                                FollowUid={post.authorId}
                                                date={post.date}
                                                postKey={keyP}
                                                post={true}
                                                author={post.author}
                                                text={post.text} />)
                                        } catch (error) {
                                            console.error(error);
                                        }       
                                    })
                                }
                                return <p>This user has no posts!</p>;
                            })
                            : null}
                    </div>
                </div>
            </div>
        );
    }
}

export default Search;