import React, { Component } from 'react';
import shortid from 'shortid';

export default class CategoryItem extends Component {
    handleOnClick = event => {
        this.props.addItem({
            id: shortid.generate() ,
            name: event.target.name,
            crossed: false,
            price: event.target.value,
            quantity: 1
        })
    }

    render() {
        return (
            <button name={this.props.itemName} type="button" value={this.props.price}
                className="itemBtn" onClick={(event) => this.handleOnClick(event)}
                style={{"backgroundColor": this.props.color}}>{this.props.itemName}</button>            
        );
    }
}
