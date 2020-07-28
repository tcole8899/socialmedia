import React from 'react';
import Firebase from '../Config/Firebase.js';

class LoginModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: true,
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

            this.props.history.push("/welcome");

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
            this.props.history.push("/");
        } catch (error) {
            console.log('error signing in: ', error);
            this.setState({error: error.message});
        }
    }

    renderSignUp() {
        return (
            <div className="Form-Content">
                <h1>Sign Up</h1>
                {this.state.error !== "" ? <p className="Error">Error signing up: {this.state.error}</p> : null}
                <label htmlFor="Fullname"><b>Full Name</b></label>
                <input type="text" placeholder='Fullname' name="Fullname" id="fullname" onChange={this.onInputChange} />
                <label htmlFor="Username"><b>Username</b></label>
                <input type="text" placeholder='Username' name="Username" id="username" onChange={this.onInputChange} />
                <label htmlFor="Email"><b>Email</b></label>
                <input type="text" placeholder='Email' name="Email" id="email" onChange={this.onInputChange} />
                <label htmlFor="Password"><b>Password</b></label>
                <input type="password" placeholder='Password' name="Password" id="password" onChange={this.onInputChange} />
                <label htmlFor="Confirm-Password"><b>Confirm Password</b></label>
                <input type="password" placeholder='Confirm Password' name="Confirm-Password" id="confirmpassword" onChange={this.onInputChange} />
                <button className="Form-Submit" onClick={this.handleSignUp}>Sign Up</button>
                <button className="SignUp" onClick={this.toggleSignUp}>Already Have an Account? Click Here to Log In!</button>
            </div>
        );
    }

    renderLogIn() {
        return (
            <div className="Form-Content">
                <h1>Log In</h1>
                <p>Welcome Back!</p>
                {this.state.error !== "" ? <p className="Error">Error signing in: {this.state.error}</p> : null}
                <label htmlFor="Email"><b>Email</b></label>
                <input type="text" placeholder='Email' name="Email" id="email" onChange={this.onInputChange} />
                <label htmlFor="Password"><b>Password</b></label>
                <input type="password" placeholder='Password' name="Password" id="password" onChange={this.onInputChange} />
                <button className="Form-Submit" onClick={this.handleLogIn}>Log In</button>
                <button className="SignUp" onClick={this.toggleSignUp}>Don't Have an Account? Click Here to Sign Up!</button>
                <button className="SignUp">Forgot Password?</button>
            </div>
        );
    }


    render() {
        return (
            <div className="Login-background">
                <form className="Login-form">
                    {this.state.login ? this.renderLogIn() : this.renderSignUp()}
                </form>
            </div>
        );
    }
}

export default LoginModal;
