'use strict';

import * as tweetRepository from '../data/tweet.js';
import { getSocketIO } from '../network/socket.js';

/**
 * username이 있으면 username에 해당하는 데이터, 없으면 전체 데이터 조회
 */
export async function getTweets(req, res, next) {
  const username = req.query.username;
  console.log(`controller-tweet.js username:[${username}]`);

  const data = await (username 
    ? tweetRepository.getAllByUsername(username)
    : tweetRepository.getAll());
  console.log('data:', data);

  res.status(200).json(data);
};

/**
 * id가 있는 경우 해당 Tweet 데이터 조회
 */
export async function getTweet(req, res, next) {
  const id = req.params.id;
  console.log(`id:[${id}]`);

  const tweet = await tweetRepository.getById(id);

  if (tweet) {
    res.status(200).json(tweet);
  } else {
    res.status(404).json({message: `Tweet id(${id}) not found`});
  }
};

/**
 * Tweet 데이터를 기존 데이터 앞에 추가
 */
export async function createTweet(req, res, next) {
  const { text } = req.body;

  const tweet = await tweetRepository.create(text, req.userId);
  console.log(`tweet:[${tweet}]`);

  res.status(201).json(tweet);
  getSocketIO().emit('tweets', tweet);
}

/**
 * id에 해당하는 Tweet의 text 값을 수정
 */
// 
export async function updateTweet(req, res, next) {
  const tweetId = req.params.id;
  console.log(`tweetId:[${tweetId}]`);
  
  const tweetText = req.body.text;
  console.log(`tweetText:[${tweetText}]`);

  // Tweet.id에 해당하는 작성자를 조회한다.
  const tweet = await tweetRepository.getById(tweetId);
  console.log('+++++++++++++++++++++++++++++++++');
  console.log('controller/tweet.js tweet:', tweet);
  if (!tweet) {
    res.status(404).json({message: `Tweet id(${tweetId}) not found`});
  }

  // Forbidden - 작성자 id와 요청자 id를 비교해서 동일하지 않은 경우 권한없음. 
  console.log(`user:[${tweet.userId}]-[${req.userId}]`);
  if (tweet.userId !== req.userId) {
    console.log('update - Forbidden !!!');

    return res.sendStatus(403);
  } 

  // Tweet.text 수정
  const updated = await tweetRepository.update(tweetId, tweetText);
  res.status(200).json(updated);
}

/**
 * id 해당하는 Tweet을 삭제
 */
export async function removeTweet(req, res, next) {
  const tweetId = req.params.id;
  console.log(`tweetId:[${tweetId}]`);

  // Tweet.id에 해당하는 작성자를 조회한다.
  const tweet = await tweetRepository.getById(tweetId);
  if (!tweet) {
    res.status(404).json({message: `Tweet id(${tweetId}) not found`});
  }

  // Forbidden - 작성자 id와 요청자 id를 비교해서 동일하지 않은 경우 권한없음. 
  console.log(`user:[${tweet.userId}]-[${req.userId}]`);
  if (tweet.userId !== req.userId) {
    console.log('remove - Forbidden !!!');

    return res.sendStatus(403);
  } 

  // Tweet 삭제
  await tweetRepository.remove(tweetId);

  res.sendStatus(204);
}