import mysql from 'mysql2';
import { config } from '../../config.js';
import SQ from 'sequelize';

const pool = mysql.createPool({
  host    : config.database.host    ,
  database: config.database.database,
  port    : config.database.port    ,
  user    : config.database.user    ,
  password: config.database.password,
});

export const db = pool.promise();

//logging: false               ,

export const sequelize = new SQ.Sequelize (
  config.database.database,
  config.database.user    ,
  config.database.password,
  {
    host   : config.database.host,
    dialect: 'mysql'             ,
  }
);