import React, {Component} from 'react';
import '../style/nav.css';
import {getUserName} from '../HelperFunctions'
import {send} from '../HelperFunctions'


class Nav extends Component {
	constructor(props){
		super(props);
	}

	render(){
		return (
	    <div className="nav">
	    <ul>
	    <li><a href="#AddMenu" name="AddMenuItemForm" onClick={this.props.handleChange}>Add Menu Item</a></li>
	    <li><a href="#Calendar" name="SchedulingComponent" onClick={this.props.handleChange}>Schedules</a></li>
	    <li><a href="#AddCalendar" name="AddCalendarComponent" onClick={this.props.handleChange}>Add Schedule</a></li>
	    <li><a href="#TakeOrder" name="OrderListMenu" onClick={this.props.handleChange}>Take Order</a></li>
		<li><a href="#ViewOrders" name="Orders" onClick={this.props.handleChange}>View Orders</a></li>
		<li><a href="#OrderHistory" name="orderHistory" onClick={this.props.handleChange}>Order History</a></li>
	    <li><a href="#Messages" name="Messaging" onClick={this.props.handleChange}>Messages</a></li>
		<li><a href="#Sign Out" name="Logout" onClick={this.props.handleLogout} >Sign Out</a></li>
	    </ul>
	    </div>
	    );
	}
}

export default Nav;