const { Client, Pool } = require('pg');
const { dbConfig } = require('../config');
const client = new Client(dbConfig);
const pool = new Pool(dbConfig);

const createConnection = async () => {
  console.log('Connecting...');
  await client.connect();
  console.log('Connected!');
};

const closeConnection = async () => {
  console.log('Closing Connection...');
  await client.end();
  console.log('Connection Closed!');
};

const pooledQuery = async (text, params) => {
  return await pool.query(text, params);
};

module.exports = {
  query: pooledQuery,
  createConnection,
  closeConnection,
};
