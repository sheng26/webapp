import React, { Component } from 'react';
import {send} from '../HelperFunctions';

export default class Order extends Component {
    
    state = {
        complete: this.props.order.completed
    }

    toggleComplete = () => {
        let data = {
            completed: !this.state.complete,
            orderNumber: this.props.order.order_number
        }
		send("PATCH", "/api/order/status/complete/", data, function(err, res) {
            if(err) console.log(err);
            else{
                this.setState({
                    complete: !this.state.complete
                })
            }
          }.bind(this));
    }

    render() {
        return (
            <div className='order'>
                <button type="button" className="removeOrderBtn" 
                onClick={this.props.removeOrder}>Remove</button>
                <div className="orderNumber">Order number: #{this.props.order.order_number}</div>
                <div className="orderTotal">Total: {this.props.order.total}</div>
                {this.state.complete ? <button type="buttton" className="toggleCompleteBtn" 
                onClick={this.toggleComplete} style={{"backgroundColor": "#6AFA5C"}}>Complete</button> 
                : <button type="buttton" className="toggleCompleteBtn" 
                onClick={this.toggleComplete} style={{"backgroundColor": "#FF6B2B"}}>In progress</button>}
                <button type="button" className="editOrderBtn" 
                onClick={this.props.editOrder}>Edit Order</button>
            </div>
        )
    }
}