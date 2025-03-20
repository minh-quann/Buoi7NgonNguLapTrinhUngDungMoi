var express = require('express');
var router = express.Router();
let userController = require('../controllers/users');
var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');
let { verifyToken, checkRole } = require('../middlewares/auth');

router.get('/', verifyToken, checkRole('mod'), async function (req, res, next) {
  try {
    let users = await userController.GetAllUser();
    CreateSuccessRes(res, 200, users);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', verifyToken, checkRole('mod'), async function (req, res, next) {
  try {
    let user = await userController.GetUserById(req.params.id);
    CreateSuccessRes(res, 200, user);
  } catch (error) {
    CreateErrorRes(res, 404, error);
  }
});

router.post('/', verifyToken, checkRole('admin'), async function (req, res, next) {
  try {
    let body = req.body;
    let newUser = await userController.CreateAnUser(body.username, body.password, body.email, body.role);
    CreateSuccessRes(res, 200, newUser);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', verifyToken, checkRole('admin'), async function (req, res, next) {
  try {
    let updateUser = await userController.UpdateUser(req.params.id, req.body);
    CreateSuccessRes(res, 200, updateUser);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', verifyToken, checkRole('admin'), async function (req, res, next) {
  try {
    let deleteUser = await userController.DeleteUser(req.params.id);
    CreateSuccessRes(res, 200, deleteUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
