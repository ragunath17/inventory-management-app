import React, { Component } from 'react';
import axios from 'axios';
import './index.css';

export default class AddProductModal extends Component {
  state = { name: '', stock: '', category: '', unit: '', brand: '' };

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  handleAdd = () => {
    axios.post('http://localhost:5000/api/products', this.state)
      .then(() => { this.props.onAdd(); this.props.onClose(); });
  };

  render() {
    const { onClose } = this.props;
    const { name, stock, category, unit, brand } = this.state;

    return (
      <div className="modal-overlay">
        <div className="modal">
          <h3>Add New Product</h3>
          <input name="name" placeholder="Name" value={name} onChange={this.handleChange}/>
          <input type="number" name="stock" placeholder="Stock" value={stock} onChange={this.handleChange}/>
          <input name="category" placeholder="Category" value={category} onChange={this.handleChange}/>
          <input name="unit" placeholder="Unit" value={unit} onChange={this.handleChange}/>
          <input name="brand" placeholder="Brand" value={brand} onChange={this.handleChange}/>
          <div className="modal-actions">
            <button className="close-btn" onClick={onClose}>Cancel</button>
            <button className="add-btn" onClick={this.handleAdd}>Add</button>
          </div>
        </div>
      </div>
    );
  }
}
