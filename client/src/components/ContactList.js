import React, {Component} from 'react';

class ContactList extends Component {
	constructor(props){
		super(props);
	}

	handleChange = (event) => {
		let username = event.target.name;
		this.props.updateContactId(username);
	}

	shouldComponentUpdate(nextProps) {
        return this.props.contacts !== nextProps.contacts;
    }

	render(){
		let options = []
		let contacts = this.props.contacts;
		options = contacts.map(c => {
			let username = c.username;
			let currContact = (<li key={username} onClick={this.handleChange}><a name={username} href="#Contact">{username}</a></li>);
			return currContact
		});

		return (
				<div className="contacts">
					<h3>Contact List</h3>
					<ul>
						{options}
					</ul>
				</div>
			);
	}
}

export default ContactList;