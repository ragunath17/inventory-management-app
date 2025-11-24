const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/products');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/products', productsRouter);

app.listen(5000, () => console.log('Server running on port 5000'));
