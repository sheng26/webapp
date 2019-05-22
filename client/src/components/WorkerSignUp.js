import React, { Component } from 'react';
import '../style/login.css'
import LoginPg from './Login';
import {send} from '../HelperFunctions';
import HomePg from './Homepg';

function password_valid(password){
  if(password.length>6){
    return true
  }
  else return false
};

class WSignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {username: '', 
                  password: '',
                  clicked: false,
                  currPage: <LoginPg />,
                  displaying: "Login" 
                };
    this.ReadInput = this.ReadInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.HandleBack = this.HandleBack.bind(this);
  }

  ReadInput(event) {
		let {name, value} = event.target;
		this.setState({[name]: value}); 
  }

  handleSubmit(event) {
    event.preventDefault();
    let {username, password} = this.state;
    let type = 'worker';
    let pass_valid = password_valid(password)
    if(pass_valid){
    send("POST", "/signup/", {username, password, type}, function(err, res){
      if(err) console.log(err);
      else{
        console.log("login ")
        this.setState({
            clicked: true,
            currPage: <HomePg/>
          }); 
        }
      }.bind(this));
    }
    else{
      this.setState({
        username: "",
        password: ""
      });
    }
  }

  HandleBack(event) {
    this.setState({
      clicked: true
    });
  }

  render() {
    let display;
    if(this.state.clicked === false){
      display = (      
      <form className="signup_form" onSubmit={this.handleSubmit} >
      <div className="form_container">
        <label >
          Username <br />
          <input className="form_element" type="text" value={this.state.username} onChange={this.ReadInput} name="username" required/>
        </label>
        <br/>
        <label>
          Password<br />
          <input className="form_element" type="text" value={this.state.password} onChange={this.ReadInput} name="password" required/>
        </label>
        <br />
        <button className="form_btn" onClick={this.handleSubmit}>Register</button>
        <div className="back_forgot_container">
            <button onClick={this.HandleBack.bind(this)} className="back_btn">Back</button>
          </div>
        </div>
      </form>);
    }
    else{
      display = (this.state.currPage);
    }
    return (
      <div>
        {display}
      </div>
    );
  }
}


export default WSignUp;
