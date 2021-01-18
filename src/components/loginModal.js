import React from 'react';
import Firebase from '../Config/Firebase.js';

class LoginModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: false,
            inline: this.props.inline,
            fullname: "",
            username: "",
            email: "",
            password: "",
            confirmpassword: "",
            error: ""
        };
        this.toggleSignUp = this.toggleSignUp.bind(this);
    }

    toggleSignUp() {
        this.setState({
            login: !this.state.login,
            error: ""
        })
    }

    onInputChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSignUp = async event => {
        event.preventDefault();
        const {fullname, username, email, password, confirmpassword } = this.state;
        try {
            if (password !== confirmpassword){
             throw new Error({message: "Passwords do not match"});
            }
            const SignUpResponse = await Firebase.auth().createUserWithEmailAndPassword(email, password);
            console.log(SignUpResponse);

            Firebase.database().ref('users/' + SignUpResponse.user.uid).set({
                fullname: fullname,
                username: username,
                email: email
            });

            var updates ={}
            updates['usernames/' + username] = SignUpResponse.user.uid;
            Firebase.database().ref().update(updates);

            var user = Firebase.auth().currentUser;
            user.updateProfile({
                displayName: username
            }).then(function() {
                console.log('display name added');
            }).catch(function(error) {
                console.log(error);
            })

            user.sendEmailVerification().then(function() {
                console.log("Email sent");
              }).catch(function(error) {
                console.log(error);
              });

        } catch (error) {
            console.log(error);
            this.setState({error: error.message});
        }
    }

    handleLogIn = async event => {
        event.preventDefault();
        try {
            const user = await Firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password);
            console.log(user);
            this.props.ActiveUser.setAuthentication(true);
            this.props.ActiveUser.setUser(user.user.displayName);
            this.props.ActiveUser.setEmailVerification(user.user.emailVerified);
            this.props.ActiveUser.setUid(user.user.uid);
            window.location.assign('/home');
        } catch (error) {
            console.log('error signing in: ', error);
            this.setState({error: error.message});
        }
    }

    renderSignUp() {
        return (
            <div>
                <div className="border-bottom mb-2">
                        <h3 className="mb-3">Sign Up</h3>
                </div>
                {this.state.error !== "" ? <p className="Error">Error signing up: {this.state.error}</p> : null}
                <div className="row mb-3">
                    <div className="col-md-12">
                        <label htmlFor="Fullname" className="form-label float-left ml-1 mt-1">Full Name</label>
                        <input type="text" className="form-control" placeholder='First and Last' name="Fullname" id="fullname" onChange={this.onInputChange} />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="Username" className="form-label float-left ml-1 mt-1">Username</label>
                        <input type="text" className="form-control" placeholder='No Spaces' name="Username" id="username" onChange={this.onInputChange} />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="Email" className="form-label float-left ml-1 mt-1">Email</label>
                        <input type="text" className="form-control" placeholder='example@email.com' name="Email" id="email" onChange={this.onInputChange} />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="Password" className="form-label float-left ml-1 mt-1">Password</label>
                        <input type="password" className="form-control" placeholder='8 Characters No Spaces' name="Password" id="password" onChange={this.onInputChange} />
                    </div>
                    <div className="col-md-6 mb-2">
                        <label htmlFor="Confirm-Password" className="form-label float-left ml-1 mt-1">Confirm Password</label>
                        <input type="password" className="form-control" placeholder='Re-enter Password' name="Confirm-Password" id="confirmpassword" onChange={this.onInputChange} />
                    </div>
                </div>
                <div className="border-top">
                    <button className="btn btn-outline-success mt-2" onClick={this.handleSignUp}>Sign Up</button>
                    <button className="btn btn-link mb-3 mt-3" onClick={this.toggleSignUp}>Already Have an Account? Click Here to Log In!</button>
                </div>
            </div>
        );
    }

    renderLogIn() {
        return (
            <div>
                <div className="border-bottom mb-3">
                        <h3>Welcome Back!</h3>
                </div>
                {this.state.error !== "" ? <p className="Error">Error signing in: {this.state.error}</p> : null}
                <div className="mb-1">
                    <label for="Email" className="form-label float-left ml-1 mt-1">Email</label>
                    <input type="text" className="form-control" placeholder='email@example.com' name="Email" id="email" onChange={this.onInputChange} />
                </div>
                <div className="mb-4">
                    <label for="Password" className="form-label float-left ml-1 mt-1">Password</label>
                    <input type="password" className="form-control" name="Password" id="password" onChange={this.onInputChange} />
                </div>
                <div className="border-top">
                    <button className="btn btn-outline-success mt-4" onClick={this.handleLogIn}>Log In</button>
                    <button className="btn btn-link mt-3" onClick={this.toggleSignUp}>Don't Have an Account? Click Here to Sign Up!</button>
                </div>
                <button className="btn btn-link">Forgot Password?</button>
            </div>
        );
    }

    renderInlineLogIn() {
        return (
            <form className="form-inline mx-sm-9" action="/home" method="POST">
                <div className="form-group mx-3 mb-3">
                    <input type="text" className="form-control" placeholder='Email' name="Email" id="email" onChange={this.onInputChange} />
                </div>
                <div className="form-group mx-3 mb-3">
                    <input type="password" className="form-control" placeholder='Password' name="Password" id="password" onChange={this.onInputChange} />
                </div>
                <div className="form-group mx-sm-3 mb-2">
                    <button className="btn btn-outline-success mb-2" onClick={this.handleLogIn}>Log In</button>
                </div>
            </form>
        );
    }


    render() {
        return (
            <div className="container-fluid mt-4">
                { 
                this.state.inline ? 
                this.renderInlineLogIn() : 
                  (
                    <form className="Login-form">
                        {this.state.login ?  this.renderLogIn() : this.renderSignUp()}
                    </form>
                  )
                }
            </div>
        );
    }
}

export default LoginModal;
