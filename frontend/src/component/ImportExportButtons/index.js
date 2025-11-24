import React, { Component } from 'react';
import './index.css';
import axios from 'axios';

export default class ImportExportButtons extends Component {
  handleExport = () => {
    axios.get('http://localhost:5000/api/products/export', { responseType: 'blob' })
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'products.csv');
        document.body.appendChild(link);
        link.click();
      });
  }

  handleImport = e => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('csvFile', file);
    axios.post('http://localhost:5000/api/products/import', formData)
      .then(() => this.props.onUpdate());
  }

  render() {
    return (
      <div className="import-export-buttons">
        <label className="import-btn">
          Import
          <input type="file" accept=".csv" onChange={this.handleImport} hidden/>
        </label>
        <button className="export-btn" onClick={this.handleExport}>Export</button>
      </div>
    );
  }
}
