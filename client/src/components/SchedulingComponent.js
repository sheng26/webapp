import React, {Component} from 'react';
import SelectCalendarComponent from './SelectCalendarComponent';

class SchedulingComponent extends Component {
	constructor(props){
		super(props);
		this.state = {};
	}

	render(){
		return (
				<SelectCalendarComponent />
			);
	}
}

export default SchedulingComponent