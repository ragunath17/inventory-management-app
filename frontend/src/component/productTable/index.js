import React, { Component } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import ProductRow from '../ProductRow';
import InventoryHistorySidebar from '../InventoryHistorySidebar';
import AddProductModal from '../AddProductModal';
import ImportExportButtons from '../ImportExportButtons';
import './index.css';

export default class ProductTable extends Component {
  state = {
    products: [],
    search: '',
    category: '',
    selectedProduct: null,
    showAddModal: false,
    loading: false
  };

  componentDidMount() { this.fetchProducts(); }

  fetchProducts = () => {
    const { search, category } = this.state;
    let query = '';
    if (search) query += `name=${search}&`;
    if (category) query += `category=${category}&`;

    this.setState({ loading: true });
    axios.get(`${API_URL}/api/products?${query}`)
      .then(res => this.setState({ products: res.data, loading: false }))
      .catch(() => this.setState({ loading: false }));
  }

  handleSearch = e => {
    const value = e.target.value;
    this.setState({ search: value });
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.fetchProducts(), 300);
  }

  handleCategory = e => this.setState({ category: e.target.value }, this.fetchProducts);
  toggleAddModal = () => this.setState({ showAddModal: !this.state.showAddModal });
  selectProduct = product => this.setState({ selectedProduct: product });

  render() {
    const { products, selectedProduct, showAddModal, search, category, loading } = this.state;
    const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

    return (
      <div className="product-table-container">
        <div className="table-left">
          <header className="table-header">
            <h2>Inventory Management</h2>
            <div className="header-actions">
              <div className="filters">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={this.handleSearch}
                />
                <select value={category} onChange={this.handleCategory}>
                  {categories.map(c => <option key={c} value={c === 'All' ? '' : c}>{c}</option>)}
                </select>
                <button className="add-btn" onClick={this.toggleAddModal}>+ Add Product</button>
              </div>
              <ImportExportButtons onUpdate={this.fetchProducts} />
            </div>
          </header>

          {loading ? <div className="loading">Loading products...</div> : (
            <div className="table-wrapper">
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p =>
                    <ProductRow
                      key={p.id}
                      product={p}
                      refresh={this.fetchProducts}
                      onSelect={this.selectProduct}
                    />
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selectedProduct &&
          <InventoryHistorySidebar
            product={selectedProduct}
            onClose={() => this.setState({ selectedProduct: null })}
          />
        }

        {showAddModal &&
          <AddProductModal
            onClose={this.toggleAddModal}
            onAdd={this.fetchProducts}
          />
        }
      </div>
    )
  }
}
