import React from 'react';
import Firebase from '../Config/Firebase.js';

function ProfileBadge(word, list = null) {
    var number = 0;
    if (list != null) {
        number = Object.keys(list).length;
    }
    return(
        <div className="list-group-item d-flex justify-content-between align-items-center">
            <p>{word}</p> 
            <span class="badge badge-primary badge-pill">{number}</span>
        </div>
    );
}

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: null,
            profile: false
        }
    }

    componentDidMount() {
        var UID = this.props.uid;
        var profile = this.props.profile ? this.props.profile : false;
        var userQuery = Firebase.database().ref('users/' + UID);

        userQuery.once('value', snapshot => {
            let data = snapshot.val() ? snapshot.val() : {};
            this.setState({ userData: data });
        })

        this.setState({
            profile: profile
        })

    }


    render() {
        const {userData, profile} = this.state;
        
        return (
            <div className="bg-light border">
                {(userData && profile) ?
                    <div className="list-group  mt-2">
                        <div className="row-12 User mb-2">
                        </div>
                        <div className="list-group-item d-flex justify-content-between align-items-center">
                            {userData.fullname} <span className="text-muted">(@{userData.username})</span>
                        </div>
                        { ProfileBadge("Following", userData.following) }
                        { ProfileBadge("Followers", userData.followers) }
                    </div>
                    :
                    null
                }
            </div>
        )
    }
}

export default User;