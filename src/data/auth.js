'use strict';

import SQ from 'sequelize';
import { sequelize } from '../database/mysql.js'

const DataTypes = SQ.DataTypes;

export const User = sequelize.define (
  'sq_user',
  {
    id: {
      type         : DataTypes.INTEGER,
      autoIncrement: true             ,
      allowNull    : false            ,
      primaryKey   : true             ,
    },
    username: {
      type     : DataTypes.STRING(45),
      allowNull: false               ,
    },
    password: {
      type     : DataTypes.STRING(128),
      allowNull: false                ,
    },
    name: {
      type     : DataTypes.STRING(128),
      allowNull: false                ,
    },
    email: {
      type     : DataTypes.STRING(128),
      allowNull: false                ,
    },
    photo: {
      type : DataTypes.TEXT,
    },
    // 자동으로 createdAt, updatedAt 컬럼 생성을 하지않도록 true 또는 생략하면 자동 컬럼 생성
    // { timestamps: false } 
  }
);

/**
 * username로 User 정보 조회
 */
export async function getByUsername(username) {

  console.log('data/auth.js getByUsername:username:', username);
  // if (!username) return null;

  // return mysql.db.execute (
  //   `SELECT ID       AS id 
  //         , USERNAME AS username
  //         , PASSWORD AS password
  //         , NAME     AS name
  //         , EMAIL    AS email
  //         , PHOTO    AS photo
  //      FROM USERS   
  //     WHERE USERNAME = ?
  //   `, [username])
  //   .then((result) => {
  //     console.log('select result:', result);
      
  //     return result[0][0];
  //   }
  // );

  return User.findOne({where: {username: username}})
             .then((data) => {
               console.log('getByUsername-findOne', data);
           
               return data;
             });
}

/**
 * id로 User 정보 조회
 */
export async function getById(id) {

  console.log('data/auth.js getById-id:', id);
  if (!id) return null;

  // return mysql.db.execute (
  //   `SELECT ID       AS id 
  //         , USERNAME AS username
  //         , PASSWORD AS password
  //         , NAME     AS name
  //         , EMAIL    AS email
  //         , PHOTO    AS photo
  //      FROM USERS
  //     WHERE ID = ?
  //   `, [id])
  //   .then((result) => {
  //     console.log('select result[0][0]:', result[0][0]);
      
  //     return result[0][0];
  //   }
  // );

  return User.findByPk(id)
             .then((data) => {
               console.log('getById-findByPk', data);
           
               return data;
             });
}

/**
 * User 등록
 */
export async function createUser(username, hashed, name, email, photo) {
  // console.log(username);
  // console.log(hashed);
  // console.log(name);
  // console.log(email);
  // console.log(photo);

  // const userId = parseInt(await userIdAutoCreate());
  // console.log('userId:', userId);

  // return mysql.db.execute (
  //   `INSERT INTO USERS 
  //              ( ID
  //              , USERNAME
  //              , PASSWORD
  //              , NAME
  //              , EMAIL
  //              , PHOTO
  //              , CREATEDAT
  //              )
  //       VALUES ( ?
  //              , ?
  //              , ?
  //              , ?
  //              , ?
  //              , ?
  //              , NOW()
  //              )
  //   `, [userId, username, hashed, name, email, photo])
  //   .then((result) => {
  //     console.log('insert result[0][0]:', result[0][0])

  //     return userId;
  //   }
  // );
  return User.create({ username: username, 
                       password: hashed  , 
                       name    : name    , 
                       email   : email   , 
                       photo   : photo   })
             .then((data) => {
               console.log('createUser-create', data);
                    
               return data.dataValues.id;
             });
}

/**
 * 사용자 id 채번
 */
// async function userIdAutoCreate() {
//   return mysql.db.execute(
//     `SELECT IFNULL(MAX(ID)+1, 1) AS id
//        FROM USERS
//     `)
//     .then((result) => {
//       // console.log('result:', result);
//       // console.log('result[0]:', result[0]);
//       // console.log('result[0][0]:', result[0][0]);
//       // console.log('result[0][0].ID:', result[0][0].ID);

//       return result[0][0].id;
//     }
//   );
// }