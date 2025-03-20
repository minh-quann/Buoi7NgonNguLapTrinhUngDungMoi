var express = require('express');
var router = express.Router();
let userController = require('../controllers/users');
var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');
let jwt = require('jsonwebtoken');
let constants = require('../utils/constants');
let { verifyToken } = require('../middlewares/auth');

router.post('/login', async function (req, res, next) {
  try {
    let { username, password } = req.body;
    let result = await userController.Login(username, password);
    let token = jwt.sign({ id: result._id, role: result.role }, constants.SECRET_KEY, { expiresIn: '24h' });
    CreateSuccessRes(res, 200, { token });
  } catch (error) {
    next(error);
  }
});

router.post('/signup', async function (req, res, next) {
  try {
    let { username, password, email } = req.body;
    let result = await userController.CreateAnUser(username, password, email, 'user');
    let token = jwt.sign({ id: result._id, role: 'user' }, constants.SECRET_KEY, { expiresIn: '24h' });
    CreateSuccessRes(res, 200, { token });
  } catch (error) {
    next(error);
  }
});

router.get('/me', verifyToken, async function (req, res, next) {
  try {
    let user = await userController.GetUserById(req.user.id);
    CreateSuccessRes(res, 200, user);
  } catch (error) {
    next(error);
  }
});

router.post('/change-password', verifyToken, async function (req, res, next) {
  try {
    let { oldPassword, newPassword } = req.body;
    let result = await userController.ChangePassword(req.user.id, oldPassword, newPassword);
    CreateSuccessRes(res, 200, result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
