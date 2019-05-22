import React, { Component } from 'react';
import '../style/login.css'
import {getUserName} from '../HelperFunctions'

class HomePg extends Component {
  constructor() {
    super();
  }
  
  render() {
    let user = getUserName();
    return (
      <div className="signup_form">
        <div className="welcomeMsg">Welcome {user} to Restaurall</div>
      </div>
    );
  }
}


export default HomePg;