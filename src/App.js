import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Heading from './components/heading.js';
import LoginModal from './components/loginModal.js';
import Home from './components/home.js';
import Welcome from './components/welcome.js';
import './App.css';

class App extends React.Component {
  state = {
    Authenticated: false,
    emailVerified: false,
    uid: null,
    user: null
  };

  setAuthentication = authenticated => {
    this.setState({ Authenticated: authenticated });
  }

  setEmailVerification = verified => {
    this.setState({ emailVerified: verified });
  }

  setUid = uid => {
    this.setState({ uid: uid});
  }

  setUser = user => {
    this.setState({ user: user });
  }

  render() {
    const ActiveUser = {
      Authenticated: this.state.Authenticated,
      emailVerified: this.state.emailVerified,  
      uid: this.state.uid,    
      user: this.state.user,
      setAuthentication: this.setAuthentication,
      setEmailVerification: this.setEmailVerification,
      setUid: this.setUid,
      setUser: this.setUser
    };

    return (
      <div className="App">
        <Router>
          <div>
            <Heading ActiveUser={ActiveUser} />
            <Switch>
              <Route exact path="/" render={(props) => <Home {...props} ActiveUser={ActiveUser} />} />
              <Route exact path="/login" render={(props) => <LoginModal {...props} ActiveUser={ActiveUser} />} />
              <Route exact path="/welcome" render={() => <Welcome ActiveUser={ActiveUser} />} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
