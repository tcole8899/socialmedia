import React from 'react';
import { Auth } from 'aws-amplify';

class LoginModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: true,
            username: "",
            email: "",
            password: "",
            confirmpassword: ""
        };
        this.toggleSignUp = this.toggleSignUp.bind(this);
    }

    toggleSignUp() {
        this.setState({
            login: !this.state.login
        })
    }

    onInputChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSignUp = async event => {
        event.preventDefault();
        const { username, email, password } = this.state;
        try {
            const signUpResponse = await Auth.signUp({
                username,
                password,
                attributes: {
                    email: email
                }
            });
            console.log(signUpResponse);
        } catch (error) {
            console.log(error);
        }
    }

    handleLogIn = async event => {
        event.preventDefault();
        try {
            const user = await Auth.signIn(this.state.username, this.state.password);
            console.log(user);
        } catch (error) {
            console.log('error signing in: ', error);
        }
    }

    handleLogOut = async event => {
        try {
            await Auth.signOut();
        }
        catch (error) {
            console.log('error signing out: ', error)
        }
    }

    renderSignUp() {
        return (
            <div className="Form-Content">
                <h1>Sign Up</h1>
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
                <label htmlFor="Username"><b>Username</b></label>
                <input type="text" placeholder='Username' name="Username" id="username" onChange={this.onInputChange} />
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
