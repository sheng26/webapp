import React, {Component} from 'react';
import {send, getUserName} from '../HelperFunctions';

class Conversation extends Component {
	constructor(){
		super();
		// this.socket = io();
		this.state = {
			newMessage: ""
		};

		this.handleChange = this.handleChange.bind(this);
		this.insertMessage = this.insertMessage.bind(this);
	}

	componentDidUpdate() {
		//show bottom of message div
		let messagesDiv = document.getElementsByClassName('conversation');
		if (messagesDiv.length > 0){
			messagesDiv[0].scrollTop = messagesDiv[0].scrollHeight;
		}
	}

	handleChange(event){
		let {name, value} = event.target;
		this.setState({[name]: value});
	}

	insertMessage(event){
		event.preventDefault();
		let data = {recipient: this.props.userId, message: this.state.newMessage, sender: getUserName()};
		send("POST", "/api/messages", data, function(err, res) {
			if(err) console.log(err);
			else{
				this.props.socket.emit("messagesUpdate", data);
			}
		}.bind(this));
		this.setState({newMessage: ""});
	}

	render(){
		let message = <h3>Select Contact</h3>;
		let userId = this.props.userId;
		if (userId != ""){
			let messages = this.props.messages.map(function(m, index){
				let direction = m.recipient === userId ? "right" : "left";
				let currMessage = (
						<div key={index} className={"message " + direction}>{m.message}</div>
					);
				return currMessage;
			});

			//display the messages and an input to send a new message
			message = (
					<div className="conversationContainer">
						<div className="conversation">
							{messages}
						</div>
						<textarea className="textInputs" placeholder="Write a message" name="newMessage" rows="1" onChange={this.handleChange} value={this.state.newMessage}></textarea>
						<input type="submit" className="btn" value="Send" onClick={this.insertMessage} />
					</div>
				);
		}
		return (
					<div className="conversations">
						{message}
					</div>
					
				);
	}
}

export default Conversation;