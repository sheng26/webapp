import React, { Component } from 'react';
import PaidOrder from './paidOrder';
import {send} from '../HelperFunctions';

export default class OrderHistory extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            orders: []
        };

        this.getPayedOrders();
      }

    // retrieve all payed orders from the database
    getPayedOrders = () => {
        send("GET", "/api/orders/true/", null, function(err, res) {
            if(err) console.log(err);
            else{
                this.setState({
                    orders: res
                });
            }
        }.bind(this));
    }

    render() {
        return (
            <div className='orders'>
                {this.state.orders.map(order => <PaidOrder order={order} key={order.order_number}/>)}
            </div>
        )
    }
}
