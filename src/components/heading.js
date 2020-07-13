import React from 'react';
import Firebase from '../Config/Firebase';

class Heading extends React.Component {
    logOut = async event => {
        event.preventDefault();
        try {
            const out = Firebase.auth().signOut();
            console.log(out);
            this.props.ActiveUser.setAuthentication(false);
            this.props.ActiveUser.setUser(null);
            this.props.history.push("/");
        } catch (error) {
            console.log(error);
        }
    }


    render() {
        const user = this.props.ActiveUser.user;
        return (
            <nav className="App-header">
                <div className="Title">
                    {
                        this.props.ActiveUser.Authenticated && user ?
                            <p>{user}</p>
                            : <p>Tyler's Social Media Project</p>
                    }
                </div>
                {
                    this.props.ActiveUser.Authenticated && user ?
                        <div className="AuthNav">
                            <a href="/" className="Nav-button">Feed</a>
                            <a href='/profile' className="Nav-button">Profile</a>
                        </div>
                        : null
                }
                <div className="Navigation">
                    {
                        this.props.ActiveUser.Authenticated && user ?
                            <a href="/" onClick={this.logOut} className="Nav-button">  LOG OUT </a>
                            : <a href="/login" className="Nav-button">  LOG IN </a>
                    }
                </div>
            </nav>
        );
    }
}

export default Heading;