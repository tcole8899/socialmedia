import React from 'react';
import {AiOutlineHome, AiOutlineSearch, AiOutlineUser} from 'react-icons/ai';
import Firebase from '../Config/Firebase';
import LoginModal from './loginModal.js';

class Heading extends React.Component {
    logOut = async event => {
        event.preventDefault();
        try {
            const out = Firebase.auth().signOut();
            console.log(out);
            this.props.ActiveUser.setAuthentication(false);
            this.props.ActiveUser.setUser(null);
            window.location.assign('/');
        } catch (error) {
            console.log(error);
        }
    }


    render() {
        const user = this.props.ActiveUser.user;
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
                <div className="container-fluid">
                    <div className="navbar-brand mt-2 d-none d-sm-block">
                        {
                            this.props.ActiveUser.Authenticated && user ?
                                <p>{user}</p>
                                : <p>Tyler's Social Media Project</p>
                        }
                    </div>
                    {
                        this.props.ActiveUser.Authenticated && user ?
                            <div className="btn-group">
                                <a href="/home" className="btn btn-outline-secondary"><AiOutlineHome /></a>
                                <a href='/search' className="btn btn-outline-secondary"><AiOutlineSearch /></a>
                                <a href='/profile' className="btn btn-outline-secondary"><AiOutlineUser /></a>
                            </div>
                            : null
                    }
                    <div className="float-right">
                        {
                            this.props.ActiveUser.Authenticated && user ?
                                <a href="/" onClick={this.logOut} className="btn btn-outline-danger">  LOG OUT </a>
                                : <LoginModal ActiveUser={this.props.ActiveUser} inline={true} />
                        }
                    </div>
                </div>
            </nav>
        );
    }
}

export default Heading;