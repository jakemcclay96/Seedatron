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

const checkTableColumns = async (tableName) => {
  return await pool.query("SELECT columns.table_name, columns.column_name, columns.data_type, columns.column_default, columns.is_nullable FROM information_schema.columns WHERE columns.table_name = $1", [tableName]);
}

module.exports = {
  query: pooledQuery,
  checkTableColumns,
  createConnection,
  closeConnection,
};
