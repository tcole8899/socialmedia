import React from 'react';
import Firebase from '../Config/Firebase.js';

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
        console.log(UID);
        var userQuery = Firebase.database().ref('users/' + UID);

        userQuery.once('value', snapshot => {
            let data = snapshot.val() ? snapshot.val() : {};
            console.log(data);
            console.log("inside userQuery");
            this.setState({ userData: data });
        })

        this.setState({
            profile: profile
        })

    }


    render() {
        const {userData, profile} = this.state;
        console.log(userData);
        
        return (
            <div className="bg-light border">
                {(userData && profile) ?
                    <div className="col  mt-2">
                        <div className="row-12 User mb-2"></div>
                        <div className="row-12">
                            <p>@{userData.username}</p>
                        </div>
                        <div className="row-12">
                            <p>{userData.fullname}</p>
                        </div>
                        <div className="row-12">
                            { userData.following !== null ? <p>{Object.keys(userData.following).length} Following</p> : null}
                        </div>
                    </div>
                    :
                    null
                }
            </div>
        )
    }
}

export default User;