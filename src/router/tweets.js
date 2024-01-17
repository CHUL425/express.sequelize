import express from 'express';
import 'express-async-errors';
import * as expVaildator    from 'express-validator';
import * as tweetController from '../../src/controller/tweet.js';
import * as tweetValidator  from '../../src/middleware/validator.js'
import * as jwtVerify       from '../../src/middleware/auth.js';

const router = express.Router();

// 유효성 검사 - UPDATE( validator && Sanitization)
const vaildateTweet = [
  expVaildator.body('text')
    .trim()
    .isLength({min: 1})
    .withMessage('text should be at least 1 characters !!'),
    tweetValidator.validator,
];

// GET /tweets 또는 GET /tweets?username=:username
router.get('/', jwtVerify.isAuth, tweetController.getTweets);

//GET /tweets/:id
router.get('/:id', jwtVerify.isAuth, tweetController.getTweet);

// POST /tweets
router.post('/', jwtVerify.isAuth, vaildateTweet, tweetController.createTweet);

// PUT /tweets/:id
router.put('/:id', jwtVerify.isAuth, vaildateTweet, tweetController.updateTweet);

// DELETE /tweets/:id
router.delete('/:id', jwtVerify.isAuth, tweetController.removeTweet);


export default router;