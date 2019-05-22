import React, {Component} from 'react';
import {send, getUserName} from '../HelperFunctions';
import ContactList from './ContactList';
import Conversation from './Conversation';
import '../style/messaging.css';
import '../style/index.css';
const io = require('socket.io-client');

class Messaging extends Component {
	constructor(){
		super();
		this.state = {
			contact_id : "",
			contacts: [],
			messages: []
		};
		this.socket = io();
	}

	componentDidMount() {
		send("GET", "/api/users/", {}, function(err, res) {
			if(err) console.log(err);
			else{
				this.setState({
					contacts: res
				});
			}
		}.bind(this));
		this.socket.on("messagesUpdate", this.updateMessagesList);
	}

	componentWillUnmount(){
		this.socket.close();
	}

	updateContactId = (newContactId) => {
		send("GET", "/api/messages/?recipient=" + newContactId, {}, function(err, res) {
			if(err) console.log(err);
			else{
				this.setState({
					messages: res,
					contact_id: newContactId
				});
			}
		}.bind(this));
	};

	updateMessagesList = (newMessage) => {
		if((newMessage.sender === this.state.contact_id && newMessage.recipient === getUserName()) ||
			(newMessage.sender === getUserName() && newMessage.recipient === this.state.contact_id)){
			this.setState({messages: [...this.state.messages, newMessage]});
		}
	};

	render(){
		return (
				<div className="messagingContainer">
					<ContactList contacts={this.state.contacts} updateContactId={this.updateContactId} />
					<Conversation socket={this.socket} userId={this.state.contact_id} messages={this.state.messages} updateMessages={this.updateMessagesList} />
				</div>
			);
	}
}

export default Messaging;