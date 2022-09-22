require('dotenv').config();
require('express-async-errors');

const cors = require('cors')
const express = require('express');
const app = express();

const connectDB = require('./db/connect');
const productsRouter = require('./routes/products');

//Swagger

const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs')
const swaggerDocument = YAML.load("./swagger.yaml")

const notFoundMiddleware = require('./middleware/not-found');
const errorMiddleware = require('./middleware/error-handler');

// middleware
app.use(express.json());

app.use(cors());

// routes

app.get('/', (req, res) => {
  res.send('<h1>Store API</h1><a href="/api-docs">Store Documentation</a>');
});

app.use('/api/v1/products', productsRouter);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// products route

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 4000;

const start = async () => {
  try {
    // connectDB
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
