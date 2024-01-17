import express from 'express';
import 'express-async-errors';
import * as expVaildator   from 'express-validator';
import * as authController from '../../src/controller/auth.js';
import * as authValidator  from '../../src/middleware/validator.js'
import * as jwtVerify      from '../../src/middleware/auth.js';

const router = express.Router();

// 유효성 검사 - 기본( validator && Sanitization)
const vaildateCredential = [
  expVaildator.body('username')
    .trim()
    .notEmpty()
    .isLength({min: 3})
    .withMessage('username should be at least 3 characters !!'),
  expVaildator.body('password')
    .trim()
    .isLength({min: 4})
    .withMessage('password should be at least 4 characters !!'),
  authValidator.validator,
];

// 유효성 검사 - 기본포함 추가 사항 ( validator && Sanitization)
const vaildateauthSignup = [
  ...vaildateCredential,
  expVaildator.body('name')
    .trim()
    .notEmpty()
    .withMessage('name is missing.'),
  expVaildator.body('email')
    .trim()
    .toLowerCase()
    .isEmail()
    .normalizeEmail()
    .withMessage('invalid email'),
  expVaildator.body('photo')
    .isURL()
    .withMessage('invalid URL')
    .optional({ nullable: true, checkFalsy: true }),
    authValidator.validator,
];

// POST /auth/signup
router.post('/signup', vaildateauthSignup, authController.createUser);

// POST /auth/login
router.post('/login', vaildateCredential, authController.login);

// POST /auth/me
router.get('/me', jwtVerify.isAuth, authController.me);

export default router;