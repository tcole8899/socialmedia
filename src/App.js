import React from 'react';
import Login from './components/login.js';
import LoginModal from './components/loginModal.js';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState({
      modal: true
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>Tyler's Social Media Project</p>
          <Login toggleModal={this.toggleModal}/>
        </header>
        <div className="App-content">

        </div>
        {this.state.modal ? <LoginModal /> : null}
      </div>
    );
  }
}

export default App;
