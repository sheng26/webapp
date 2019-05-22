import React, { Component } from 'react';
import '../style/login.css'
import MSignUp from './ManagerSignUp';
import WSignUp from './WorkerSignUp';
import {send} from '../HelperFunctions';
import HomePg from './Homepg';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: '', 
      password: '',
      usernameError: "",
      passwordError: ""
    };
    this.ReadInput = this.ReadInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleWSignup = this.handleWSignup.bind(this);
  }

  validate = () => {
    let usernameError = "";
    let passwordError = "";

    if(!this.state.username) {
      usernameError = "user name cannot be blank";
    }

    if(!this.state.password) {
      passwordError = "password cannot be blank";
    }

    if (usernameError || passwordError) {
      this.setState({ usernameError, passwordError });
      return false;
    }

    return true;
  }

  ReadInput(event) {
		let {name, value} = event.target;
		this.setState({[name]: value}); 
  }

  handleSubmit(event) {
    if(this.validate()) {
      event.preventDefault();
      let {username, password} = this.state;
      send("POST", "/signin/", {username, password}, function(err, res){
        if(err) console.log(err);
        else{
            this.props.handleAuthenticate(true);
        }
      }.bind(this));   
    } 
  }

  handleWSignup(event) {
    if(this.validate()) {
      event.preventDefault();
      let {username, password} = this.state;
      let type = 'worker';
      send("POST", "/signup/", {username, password, type}, function(err, res){
        if(err) console.log(err);
        else{
          this.props.handleAuthenticate();
        }
      }.bind(this));
    }
  }

  render() {
    return (
        <div className="form_container">
          <form className="authenticate_form">
            <div className="authenticate_title">Login or Sign up</div>
            <input className="form_element" placeholder="Username" type="text" value={this.state.username} onChange={this.ReadInput} name="username" required/>
            {this.state.usernameError ? <div className="loginErrorMsg">{this.state.usernameError}</div> : null}
            <input className="form_element" placeholder="Password" type="password" value={this.state.password} onChange={this.ReadInput} name="password" required/>
            {this.state.passwordError ? <div className="loginErrorMsg">{this.state.passwordError}</div> : null}
            <div>
              <button onClick={this.handleSubmit} type="submit" id="loginSubmit" className="authenticateBtn btn submit">Login</button>
              <button onClick={this.handleWSignup} type="submit" id="signUpSubmit" className="authenticateBtn btn submit">Sign Up</button>
            </div>
          
          </form>
        </div>
      );
  }
}


export default Login;
