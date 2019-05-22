import React, { Component } from 'react';

export default class OrderTotal extends Component {

    render() {
        let subTotal = this.props.calculateSubTotal();
        return(
            <div className="finishOrder">
                <div className="orderTotal">
                    <div className="subTotal">HST: {(subTotal * 0.13).toFixed(2)}</div>
                    <div className="SubTotal">Sub-Total: {subTotal.toFixed(2)}</div>
                    <div className="total">Total: {(subTotal * 1.13).toFixed(2)}</div>
                </div>
                {this.props.onEdit ? 
                    <button type="button" className="finishBtns" id="payNow"
                    onClick={this.props.displayPayment}>Pay Now</button> : null}
                <button type="button" className="finishBtns" id="placeOrder"
                 onClick={this.props.placeOrder}>Place Order</button>
            </div>
        )
    }
}