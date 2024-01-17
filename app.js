import express from 'express';
import cors    from 'cors'   ;
import morgan  from 'morgan' ;
import helmet  from 'helmet' ;
import 'express-async-errors';
import tweetsRouter from './src/router/tweets.js';
import authRouter from './src/router/auth.js';
import { config } from './config.js';
//import { Server } from 'socket.io';
import { initSocket } from './src/network/socket.js';
import { db, sequelize } from './src/database/mysql.js';

const app = express();

app.use(express.json());
app.use(helmet()      );
app.use(cors()        );
app.use(morgan('tiny'));

// Router
app.use('/tweets', tweetsRouter);
app.use('/auth'  , authRouter  );

// Not Found.
app.use((req, res) => {
  console.log('Not Found !!!');
  res.sendStatus(404);
});

// Error 처리
app.use((error, req, res) => {
  console.log(error);
  res.sendStatus(500);
});

//db.getConnection().then((connection) => console.log(connection));
sequelize.sync()
.then((client) => {
  //console.log(client);

  const expressServer = app.listen(config.host.port);
  initSocket(expressServer);
})




// Socket 기본 사용법 테스트
// const socketIO = new Server(expressServer, { cors: { origin: '*', }, });

// console.log('Socket Test!!!');
// socketIO.on('connection', (socket) => {
//   console.log('Client is here!');

//   socketIO.emit('dwitter', 'Hello 😃');
//   socketIO.emit('dwitter', 'Hello 😃');
// });

// setInterval(() => {
//   socketIO.emit('dwitter', '1초마다 안녕... 😃');
// }, 1000);