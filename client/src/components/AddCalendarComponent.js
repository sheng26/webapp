import React, {Component} from 'react';
import {send} from '../HelperFunctions';

class AddCalendarComponent extends Component {
	constructor(){
		super();
		this.state = {
			name: "",
			startDate: ""
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

	}

	handleChange(event){
		let {name, value} = event.target;
		this.setState({[name]: value});
	}

	handleSubmit(event){
		event.preventDefault();
		let {name, startDate} = this.state;
		let data = {name: name, startDate: startDate};
		send("POST", "/api/calendars", data, function(err, res) {
			if(err) console.log(err);
			else{
				this.setState({name: "", startDate: ""});
			}
		}.bind(this));
	}

	render(){
		return (
			<div className="AddFormBody">
			<h1>Add Calendar</h1>
			<form className="addForm" onSubmit={this.handleSubmit}>
			<input className="textInputs" type="text" placeholder="Name" value={this.state.name} onChange={this.handleChange} name="name" />
			<input className="textInputs" type="date" value={this.state.startDate} onChange={this.handleChange} name="startDate" />
			<input className="btn" type="submit" />
			</form>
			</div>
			);
	}
}

export default AddCalendarComponent