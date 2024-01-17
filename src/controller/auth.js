'use strict';

import bcrypt from 'bcryptjs';
import jwt    from 'jsonwebtoken';
import * as userRepository from '../data/auth.js';
import { config } from '../../config.js';

/**
 * User(사용자) 정보 등록
 */
export async function createUser(req, res, next) {
  console.log('=========================================================================');

  const { username, password, name, email, photo } = req.body;

  console.log('controller/auth.js createUser:username', username);

  // 이미 등록된 User가 있는지 확인
  const found = await userRepository.getByUsername(username);
  console.log('controller/auth.js createUser:found', found);
  if (found) {
    return res.status(409).json({ message: `${username} already exists`});
  }
  
  // 비밀번호 암호화
  const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);
  console.log(`hashed:[${hashed}]`);

  // 사용자 등록 - 암호화 비밀번호 적용
  const userId = await userRepository.createUser(username, hashed, name, email, photo);
  console.log('userId:', userId);

  const token = createJwtToken(userId)
  res.status(200).json({token, username});
}

/**
 * Login
 */
export async function login(req, res, next) {
  console.log('=========================================================================');
  
  const { username, password } = req.body;

  console.log('controller/auth.js login:username', username);

  const user = await userRepository.getByUsername(username);
  console.log('controller/auth.js login:user', user);
  if (!user) {
    return res.status(401).json({ message: 'Invalid user or password.'});
  }

  const isValid = await bcrypt.compare(password, user.password);
  console.log(`password: [${password}], isValid:[${isValid}] !!!`);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid user or password.'});
  }

  console.log('Login 성공 !!!', username);

  const token = createJwtToken(user.id)
  res.status(200).json({token, username});
}

/**
 * me의 username 조회
 */
export async function me(req, res, next) {
  console.log('=========================================================================');

  console.log('controller/auth.js me:req.userId', req.userId);

  const user = await userRepository.getById(req.userId);
  console.log('controller/auth.js me:user', user);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({ token: req.token, username: user.username });
}

/**
 * Token 생성
 */
function createJwtToken(id) {
  return jwt.sign({ id }, config.jwt.secretKey, { expiresIn: config.jwt.expiresInSec });
}