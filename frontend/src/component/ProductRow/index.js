import React, { Component } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import './index.css';

export default class ProductRow extends Component {
  state = { isEditing: false, editedProduct: {} };

  toggleEdit = () => this.setState({
    isEditing: !this.state.isEditing,
    editedProduct: { ...this.props.product }
  });

  handleChange = e => {
    const { name, value } = e.target;
    this.setState(prev => ({ editedProduct: { ...prev.editedProduct, [name]: value } }));
  };

  handleSave = () => {
    const { editedProduct } = this.state;
    const { product, refresh } = this.props;
    axios.put(`${API_URL}/api/products/${product.id}`, editedProduct)
      .then(() => { refresh(); this.toggleEdit(); })
      .catch(err => console.error(err));
  };

  handleDelete = () => {
    const { product, refresh } = this.props;
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      axios.delete(`${API_URL}/api/products/${product.id}`)
        .then(() => refresh())
        .catch(err => console.error(err));
    }
  };

  render() {
    const { product, onSelect } = this.props;
    const { isEditing, editedProduct } = this.state;
    const stockStatus = product.stock === 0 ? 'Out of Stock' : 'In Stock';
    const stockClass = product.stock === 0 ? 'stock-out' : 'stock-in';

    return (
      <tr>
        <td onClick={() => onSelect(product)}>
          {isEditing ? <input name="name" value={editedProduct.name} onChange={this.handleChange} /> : product.name}
        </td>
        <td>{isEditing ? <input type="number" name="stock" value={editedProduct.stock} onChange={this.handleChange} /> : product.stock}</td>
        <td><span className={stockClass}>{stockStatus}</span></td>
        <td>{isEditing ? <input name="category" value={editedProduct.category} onChange={this.handleChange} /> : product.category}</td>
        <td className="actions">
          {isEditing ? (
            <button className="save-btn" onClick={this.handleSave}>Save</button>
          ) : (
            <>
              <button className="edit-btn" onClick={this.toggleEdit}>Edit</button>
              <button className="delete-btn" onClick={this.handleDelete}>Delete</button>
            </>
          )}
        </td>
      </tr>
    );
  }
}
