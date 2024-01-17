import * as expVaildator from 'express-validator';


/**
 * 입력값의 유효성 검사 ( validator && Sanitization )
 */
export const validator = (req, res, next) => {
  const errors = expVaildator.validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  console.log(errors.array());

  // return res.status(400).json({message: errors.array() });  // 전체 메세지 전달
  return res.status(400).json({message: errors.array()[0].msg }); // 첫번째 메세지만 전달
}