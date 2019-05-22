import React from 'react';
import moment from 'moment';
import WeekCalendar from 'react-week-calendar';
import {send} from '../HelperFunctions';
const io = require('socket.io-client');

class CalendarComponent extends React.Component {

	constructor(props) {
		super(props);
		this.socket = io();
		let sI = this.props.calendar.selected_intervals == null ? [] : JSON.parse(this.props.calendar.selected_intervals);
		if (sI.length > 0) {
			for(let i = 0; i < sI.length; i++){
				sI[i].start = moment(sI[i].start);
				sI[i].end = moment(sI[i].end);
			}
		}

		//TODO clean up unused properties
		this.state = {
			lastUid: this.props.calendar.uid,
			selectedIntervals: sI,
			start_date: this.props.calendar.start_date,
			calendar: this.props.calendar,
			c_id: this.props.calendar.c_id,
			name: this.props.calendar.name
		};

		this.updateCal = this.updateCal.bind(this)
	}

	updateCal(cal){
		let sI = JSON.parse(cal.selected_intervals);
		if (sI.length > 0) {
			for(let i = 0; i < sI.length; i++){
				sI[i].start = moment(sI[i].start);
				sI[i].end = moment(sI[i].end);
			}
		}
		this.setState({
			lastUid: cal.uid,
			selectedIntervals: sI,
			start_date: cal.start_date,
			c_id: cal.c_id,
			name: cal.name
		});
	}

	componentDidMount() {
		this.socket.on("calendarUpdated", this.updateCal);
	}

	componentWillUnmount(){
		this.socket.close();
	}

	updateDb(selectedI){
		let start_date = this.state.start_date;
			start_date = moment(start_date).format("YYYY-MM-D")
			let data = {name: this.state.name, start_date: start_date.toString(), c_id: this.state.c_id, uid: this.state.lastUid, selected_intervals: JSON.stringify(selectedI)};
			//console.log(JSON.stringify(this.state.selectedIntervals));
			send("PATCH", "/api/calendars/" + this.state.c_id.toString() + "/", data, function(err, res) {
				if(err) console.log(err);
				else{
					this.setState({calendar: res});
					this.socket.emit("calendarUpdated", data);
				}
			}.bind(this));
	}
	

	handleEventRemove = (event) => {
		const {selectedIntervals} = this.state;
		const index = selectedIntervals.findIndex((interval) => interval.uid === event.uid);
		if (index > -1) {
			selectedIntervals.splice(index, 1);

			this.updateDb(selectedIntervals);

			this.setState({selectedIntervals});
		}
	}

	handleEventUpdate = (event) => {
		const {selectedIntervals} = this.state;
		const index = selectedIntervals.findIndex((interval) => interval.uid === event.uid);
		if (index > -1) {
			selectedIntervals[index] = event;
			this.updateDb(selectedIntervals);
			this.setState({selectedIntervals});
		}
	}

	handleSelect = (newIntervals) => {
		const {lastUid, selectedIntervals} = this.state;
		const intervals = newIntervals.map( (interval, index) => {
			return {
				...interval,
				uid: lastUid + index
			}
		});

		this.setState({
			selectedIntervals: selectedIntervals.concat(intervals),
			lastUid: lastUid + newIntervals.length
		}, () => this.updateDb(selectedIntervals.concat(intervals)));

		

	}

	render() {
		let calendarRes = null;
		//console.log(this.state.selectedIntervals);
		if(this.state.c_id > -1) {
			calendarRes = (<WeekCalendar
				firstDay = {moment(this.state.start_date)}
				startTime = {moment({h: 9, m: 0})}
				endTime = {moment({h: 15, m: 30})}
				numberOfDays= {7}
				selectedIntervals = {this.state.selectedIntervals}
				onIntervalSelect = {this.handleSelect}
				onIntervalUpdate = {this.handleEventUpdate}
				onIntervalRemove = {this.handleEventRemove}
				/>);
		}
		return (
				<div>
					{calendarRes}
				</div>
			)
	}
}

export default CalendarComponent;