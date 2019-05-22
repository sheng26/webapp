import React, { Component } from 'react';
import AddMenuItemForm from "./components/AddMenuItemForm"
import SchedulingComponent from "./components/SchedulingComponent"
import Homepg from "./components/Homepg"
import 'react-week-calendar/dist/style.css';
import AddCalendarComponent from './components/AddCalendarComponent'
import './style/menu.css';
import './style/orderList.css';
import './style/orderPage.css';
import './style/orders.css';
import './style/paymentPage.css';
import OrderListMenu from './components/takeOrder';
import Orders from './components/orders';
import OrderHistory from './components/orderHistory';
import Messaging from './components/Messaging'
import Nav from './components/Nav';
import Login from './components/Login';
import {send, getUserName} from './HelperFunctions';
// import WSignUp from './WorkerSignUp';
// import MSignUp from './ManagerSignUp';

class App extends Component {
	constructor(){
		super();
		let currUser = getUserName();
		if (currUser === ""){
			this.state = {
				currPage: <Login handleAuthenticate={this.handleAuthenticate} />,
				displaying: "Login",
				orderNumber: 0,
				loggedIn: false
			}
		}
		else {
			this.state = {
				currPage: <Homepg />,
				displaying: "Home Page",
				orderNumber: 0,
				loggedIn: true
			}
		}
		this.handleChange = this.handleChange.bind(this);
		this.getOrderNumber();
	}

	getOrderNumber = () => {
		send("GET", "/api/orderNumber/", null, function(err, res) {
			if(err) console.log(err);
			else{
				this.setState({
					orderNumber: res[0][Object.keys(res[0])[0]] + 1
				});
			}
		}.bind(this));
	}
	
	incrementOrderNum = () => {
		this.setState({
			orderNumber: this.state.orderNumber + 1
		})
	}

	handleChange(event){
		let targetPage = event.target.name;
		if(targetPage === "AddMenuItemForm"){
			this.setState({
				currPage: <AddMenuItemForm/>,
				displaying: "AddMenuItemForm"});
		}
		else if(targetPage === "SchedulingComponent"){
			this.setState({
				currPage: <SchedulingComponent/>,
				displaying: "SchedulingComponent"});
		}
		else if(targetPage === "AddCalendarComponent"){
			this.setState({
				currPage: <AddCalendarComponent/>,
				displaying: "AddCalendarComponent"});
		}
		else if(targetPage === "OrderListMenu" && this.state.displaying !== "OrderListMenu"){
			this.setState({
				currPage: <OrderListMenu 
					orderNumber={this.state.orderNumber}
					incrementOrderNum={this.incrementOrderNum}
					onEdit={false}/>,
				displaying: "OrderListMenu"});
		}
		else if(targetPage === "Orders"){
			this.displayViewOrders();
		}
		else if(targetPage === "orderHistory"){
			this.setState({
				currPage: <OrderHistory/>,
				displaying: "orderHistory"});
		}
		else if(targetPage === "Messaging"){
			this.setState(
				{currPage: <Messaging/>, displaying: "Messaging"}
			);
		}
		else if(targetPage === "Login"){
			this.setState({currPage: <Login/>, displaying: "Login"});
		}
	}
	
	editOrder = (orderNumber) => {
		this.setState({
			currPage: <OrderListMenu orderNumber={orderNumber} onEdit={true} viewOrders={this.displayViewOrders}/>,
			displaying: "OrderListMenu"});
	}

	displayViewOrders = () => {
		this.setState({
			currPage: <Orders editOrder={this.editOrder}/>,
			displaying: "Orders"
		});
	}

	handleLogout = () => {
		send("GET", "/signout/", {}, function(err, res){
		  if(err) console.log(err);
		  else{
		      this.setState({loggedIn: false, currPage: <Login handleAuthenticate={this.handleAuthenticate} />});
		  }
		}.bind(this));
	}

	handleAuthenticate = () => {
		this.setState({loggedIn: true, currPage: <Homepg />});
	};

	render() {
		let navBar = (this.state.loggedIn) ? [<Nav key="Nav" handleChange={this.handleChange} handleLogout={this.handleLogout}/>] : []
		return (
	    <div>
			{navBar}
			{this.state.currPage}
	    </div>
	    );
	}
}

export default App;
