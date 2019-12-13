import mysql from 'mysql2/promise';

let pool;

const getConnection = function() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
  }

  return pool;
};

export default { getConnection };
