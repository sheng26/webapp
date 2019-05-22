import React from 'react';
import WeekCalendar from 'react-week-calendar';
import {send} from '../HelperFunctions';
import CalendarComponent from './CalendarComponent';

class SelectCalendarComponent extends React.Component {

	constructor() {
		super();

		this.state = {
			//lastUid: 1,
			//selectedIntervals: [],
			calendar: {},
			c_id: -1,
			calendars: []
		};

		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		send("GET", "/api/calendars/?limit=" + "5", {}, function(err, res) {
			if(err) console.log(err);
			else{
				this.setState({
					calendars: res,
					c_id: (res.length > 0) ? res[0].c_id : this.state.c_id,
					calendar: (res.length > 0) ? res[0] : this.state.calendar
				});
			}
		}.bind(this));
	}

	handleChange(event){
		let {name, value} = event.target;
		if(name === "c_id" && value > -1){
			//We have to update c_id and calendar
			let newCal;
			for(let i = 0; i < this.state.calendars.length; i++){
				if (this.state.calendars[i].c_id == value){
					newCal = this.state.calendars[i];
				}
			}
			this.setState({[name]: value, calendar: newCal});
		}
	}

	render() {
		let calendarRes = null;
		let optionsRes = [];
		if(this.state.c_id > -1) {
			calendarRes = (
					<CalendarComponent key={this.state.c_id} calendar={this.state.calendar}/>
				);

			for(let i = 0; i < this.state.calendars.length; i++){
				let c = this.state.calendars[i];
				optionsRes.push(<option key={c.c_id} value={c.c_id}>{c.name}</option>)
			}
		}
		//console.log(this.state.calendar);
		return (
			<div className="calendarContainer">
				<h3>{this.state.name}</h3>
				<select value={this.state.c_id} onChange={this.handleChange} className="selectInputs" name="c_id"> 
					<option value="-1">--Please Select A Calendar--</option>
					{optionsRes}
				</select>
				{calendarRes}
			</div>
			)
	}
}

export default SelectCalendarComponent;