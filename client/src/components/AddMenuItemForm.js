import React, {Component} from 'react';
import {send} from '../HelperFunctions';

class AddMenuItemForm extends Component {
	constructor(){
		super();
		this.state = {
			name: "",
			category: "",
			price: ""
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
		let {name, category, price} = this.state;
		let data = {name: name, category: category, price: price};
		send("POST", "/api/menuItems", data, function(err, res) {
			if(err) console.log(err);
			else{
				this.setState({name: "", category: "", price: ""});
			}
		}.bind(this));
	}

	render(){
		return (
			<div className="AddFormBody">
			<h1>Add Menu Item</h1>
			<form className="addForm" onSubmit={this.handleSubmit}>
			<input className="textInputs" type="text" placeholder="Name" value={this.state.name} onChange={this.handleChange} name="name" />
			<input className="textInputs" type="text" placeholder="Category" value={this.state.category} onChange={this.handleChange} name="category" />
			<input className="textInputs" type="number" min="1" step="any" placeholder="Price" value={this.state.price} onChange={this.handleChange} name="price" />
			<input className="btn" type="submit" />
			</form>
			</div>
			);
	}
}

export default AddMenuItemForm