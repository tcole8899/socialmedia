import React from 'react';

class Login extends React.Component{


    render() {
        return (
            <div>
            <button onClick={this.props.toggleModal}>LOG IN</button>
            </div>
        );
    }
}

export default Login;