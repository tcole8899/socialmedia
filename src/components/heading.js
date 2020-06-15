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
        } catch (error) {
            console.log(error);
        }
    }


    render() {
        return (
            <nav className="App-header">
                <div className="Title">
                    {
                        this.props.ActiveUser.Authenticated && this.props.ActiveUser.user ?
                            <p>{this.props.ActiveUser.user}</p>
                            : <p>Tyler's Social Media Project</p>
                    }
                </div>
                <div className="Navigation">
                    {
                        this.props.ActiveUser.Authenticated && this.props.ActiveUser.user ?
                            <a href="/" onClick={this.logOut} className="Nav-button">  LOG OUT </a>
                            : <a href="/login" className="Nav-button">  LOG IN </a>
                    }
                </div>
            </nav>
        );
    }
}

export default Heading;