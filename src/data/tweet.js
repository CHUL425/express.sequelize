'use strict';

import SQ from 'sequelize';
import { sequelize } from '../database/mysql.js';
import { User }      from './auth.js'           ;

import * as mysql from '../database/mysql.js';

const DataTypes = SQ.DataTypes;
const Sequelize = SQ.Sequelize;

const Tweet = sequelize.define (
  'sq_tweet', 
  {
    id: {
      type         : DataTypes.INTEGER,
      autoIncrement: true             ,
      allowNull    : false            ,
      primaryKey   : true             ,
    },
    text: {
      type     : DataTypes.TEXT,
      allowNull: false         ,
    },
  }
);
Tweet.belongsTo(User);   // FOREIGN KEY 생성 sq_tweets_ibfk_1

/**
 * 모든 Tweet 데이터를 조회하고, Tweet.userId에 해당하는 작성자 정보 포함 return
 */
export async function getAll() {
  // return mysql.db.execute (
  //   `SELECT A.ID                      AS id
  //         , A.TEXT                    AS text
  //         , CAST(A.CREATEDAT AS CHAR) AS createdAt
  //         , A.USERID                  AS userId
  //         , B.USERNAME                AS username
  //         , B.NAME                    AS name
  //         , B.PHOTO                   AS photo
  //      FROM TWEETS AS A JOIN USERS AS B 
  //        ON A.USERID = B.ID
  //    ORDER BY A.CREATEDAT DESC
  //   `)
  //   .then((result) => {
  //     console.log('result:', result);
  //     console.log('result[0]:', result[0]);
  //     console.log('result[0][0]:', result[0][0]);
  
  //     return result[0];
  //   }
  // );

  return Tweet.findAll({
                         attributes: [     // 중첩된 data 편집
                           'id'                                           ,
                           'text'                                         ,
                           'createdAt'                                    ,
                           [Sequelize.col('sqUserId'        ), 'userId'  ],
                           [Sequelize.col('sq_user.name'    ), 'name'    ],
                           [Sequelize.col('sq_user.username'), 'username'],
                           [Sequelize.col('sq_user.photo'   ), 'photo'   ],
                         ],
                         include: {
                           model: User   ,
                           attributes: [],   // 중첩된 data를 편집해서 사용하도록 설정
                         },
                         order: [['createdAt', 'DESC']],
                       })
              . then((data) => {
                console.log('getAll-findAll', data);

                return data;
              });
}

/**
 * 모든 Tweet 데이터중, username에 해당하는 tweets return
 */
export async function getAllByUsername(username) {
  console.log('data-tweets.js getAllByUsername-username:', username);
  
  // return mysql.db.execute (
  //   `SELECT A.ID                      AS id
  //         , A.TEXT                    AS text
  //         , CAST(A.CREATEDAT AS CHAR) AS createdAt
  //         , A.USERID                  AS userId
  //         , B.USERNAME                AS username
  //         , B.NAME                    AS name
  //         , B.PHOTO                   AS photo
  //      FROM TWEETS AS A JOIN USERS AS B 
  //        ON A.USERID = B.ID
  //     WHERE B.USERNAME = ?
  //    ORDER BY A.CREATEDAT DESC
  //   `, [username])
  //   .then((result) => {
  //     console.log('result:', result);
  //     console.log('result[0]:', result[0]);
  //     console.log('result[0][0]:', result[0][0]);

  //     return result[0];
  //   }
  // );

  const INCLUDE_USER = {
    attributes: [
      'id'                                           ,
      'text'                                         ,
      'createdAt'                                    ,
      [Sequelize.col('sqUserId'        ), 'userId'  ],
      [Sequelize.col('sq_user.name'    ), 'name'    ],
      [Sequelize.col('sq_user.username'), 'username'],
      [Sequelize.col('sq_user.photo'   ), 'photo'   ],
    ],
    include: {
      model     : User                  ,
      attributes: []                    ,
      where     : { username: username },
    },
  };

  const ORDER_DESC = {
    order: [['createdAt', 'DESC']],
  };

  return Tweet.findAll({
                         ...INCLUDE_USER,
                         ...ORDER_DESC  ,
                       })
              .then((data) => {
                console.log('getAllByUsername-findAll', data);

                return data;
              });
  
}

/**
 * Tweet id에 해당하는 Tweet 데이터를 조회하고, Tweet.userId에 해당하는 작성자 정보 포함 return
 */
export async function getById(id) {
  console.log('data-tweets.js getById-id:', id);

  // return mysql.db.execute (
  //   `SELECT A.ID                      AS id
  //         , A.TEXT                    AS text
  //         , CAST(A.CREATEDAT AS CHAR) AS createdAt
  //         , A.USERID                  AS userId
  //         , B.USERNAME                AS username
  //         , B.NAME                    AS name
  //         , B.PHOTO                   AS photo
  //      FROM TWEETS AS A JOIN USERS AS B 
  //        ON A.USERID = B.ID
  //     WHERE A.ID = ?
  //    ORDER BY A.CREATEDAT DESC
  //   `, [id])
  //   .then((result) => {
  //     console.log('result:', result);
  //     console.log('result[0]:', result[0]);
  //     console.log('result[0][0]:', result[0][0]);

  //     return result[0][0];
  //   }
  // );

  const INCLUDE_USER = {
    attributes: [
      'id'                                           ,
      'text'                                         ,
      'createdAt'                                    ,
      [Sequelize.col('sqUserId'        ), 'userId'  ],
      [Sequelize.col('sq_user.name'    ), 'name'    ],
      [Sequelize.col('sq_user.username'), 'username'],
      [Sequelize.col('sq_user.photo'   ), 'photo'   ],
    ],
    include: {
      model     : User,
      attributes: []  ,
    },
  };

  return Tweet.findOne({
                         where: { id: id},
                         ...INCLUDE_USER ,
                         order: [['createdAt', 'DESC']],
                       })
              .then((data) => {
                console.log('getById-findOne data           ', data           );
                console.log('getById-findOne data.dataValues', data.dataValues);
        
                return data.dataValues;
              });
}

/**
 * Tweet 데이터를 기존 Tweets 앞에 추가해주고, 추가된 데이터를 다시 조회해서 return
  */
export async function create(text, userId) {
  console.log('/data/tweet.js create');
  console.log('userId:', userId);
  console.log('text  :', text  );

  // const tweetId = parseInt(await tweetIdAutoCreate());
  // console.log('tweetId:', tweetId);

  // return mysql.db.execute (
  //   `INSERT INTO TWEETS
  //              ( ID
  //              , TEXT
  //              , CREATEDAT
  //              , USERID
  //              )
  //       VALUES ( ?
  //              , ?
  //              , NOW()
  //              , ?
  //              )
  //   `, [tweetId, text, userId])
  //   .then((result) => {
  //     console.log('insert result[0][0]:', result[0][0])

  //     return getById(tweetId);
  //   }
  // );

  return Tweet.create({ text    : text  ,
                        sqUserId: userId,
                      })
              .then((data) => {
                console.log('create-create data:'              , data              );
                console.log('create-create data.dataValues:'   , data.dataValues   );
                console.log('create-create data.dataValues.id:', data.dataValues.id);
                  
                 return getById(data.dataValues.id);
              });
}

/**
 * Tweet.id에 해당하는 tweet.text 수정후 결과 조회 return
 */
export async function update(id, text) {
  console.log('/data/tweet.js update');
  console.log('id'  , id  );
  console.log('text', text);

  // return mysql.db.execute (
  //   `UPDATE TWEETS
  //       SET TEXT      = ?
  //     WHERE ID = ?
  //   `, [text, id]).then((result) => {
  //     console.log('insert result[0][0]:', result[0][0])

  //     return getById(id);
  //   }
  // );
  const INCLUDE_USER = {
    attributes: [
      'id'                                           ,
      'text'                                         ,
      'createdAt'                                    ,
      [Sequelize.col('sqUserId'        ), 'userId'  ],
      [Sequelize.col('sq_user.name'    ), 'name'    ],
      [Sequelize.col('sq_user.username'), 'username'],
      [Sequelize.col('sq_user.photo'   ), 'photo'   ],
    ],
    include: {
      model     : User,
      attributes: []  ,
    },
  };

  return Tweet.findByPk(id, INCLUDE_USER)
              .then(async (data) => {
                console.log('update-findByPk 👌 data:', data);
                data.text = text;
                
                const tweet = await data.save();
                console.log('update-findByPk ✔ tweet:', tweet);

                return tweet;
              });

}

/**
 * Tweet.id에 해당하는 tweet데이터 삭제 return void
 */
export async function remove(id) {
  console.log('/data/tweet.js update');
  console.log('id', id);

  // return mysql.db.execute (
  //   `DELETE FROM TWEETS
  //          WHERE ID = ?
  //   `, [id])
  //   .then((result) => {
  //     console.log('insert result[0][0]:', result[0][0])

  //     return getById(id);
  //   }
  // );

  return Tweet.findByPk(id)
              .then(async (tweet) => {
                console.log('update-findByPk 👌 data:', tweet);
                
                tweet.destroy();
              });
}


/**
 * Tweet id 채번
 */
// async function tweetIdAutoCreate() {
//   return mysql.db.execute(
//     `SELECT CAST(NOW() AS UNSIGNED) AS id
//        FROM DUAL
//     `).
//     then((result) => {
//       // console.log('result:', result);
//       // console.log('result[0]:', result[0]);
//       // console.log('result[0][0]:', result[0][0]);
//       // console.log('result[0][0].ID:', result[0][0].ID);

//       return result[0][0].id;
//     }
//   );
// }