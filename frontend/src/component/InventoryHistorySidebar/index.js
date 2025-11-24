import React, { Component } from 'react';
import axios from 'axios';
import './index.css';

export default class InventoryHistorySidebar extends Component {
  state = { history: [] };

  componentDidMount() {
    const { product } = this.props;
    axios.get(`http://localhost:5000/api/products/${product.id}/history`)
      .then(res => this.setState({ history: res.data }));
  }

  render() {
    const { onClose } = this.props;
    const { history } = this.state;

    return (
      <div className="sidebar-overlay">
        <div className="sidebar">
          <div className="sidebar-header">
            <h3>Inventory History</h3>
            <button className="close-btn" onClick={onClose}>X</button>
          </div>
          <div className="sidebar-body">
            {history.length === 0 ? (
              <p>No history available.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Old Qty</th>
                    <th>New Qty</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(h => (
                    <tr key={h.id}>
                      <td>{h.old_quantity}</td>
                      <td>{h.new_quantity}</td>
                      <td>{new Date(h.change_date).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  }
}
