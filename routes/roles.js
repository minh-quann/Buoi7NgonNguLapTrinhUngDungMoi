var express = require('express');
var router = express.Router();
let roleController = require('../controllers/roles');
var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');
const { verifyToken, checkRole } = require('../middlewares/auth');

router.get('/', async function (req, res, next) {
  let roles = await roleController.GetAllRole();
  CreateSuccessRes(res, 200, roles);
});


router.post('/', verifyToken, checkRole(['admin']), async function (req, res, next) {
  try {
    let newRole = await roleController.CreateRole(req.body.name);
    CreateSuccessRes(res, 200, newRole);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', verifyToken, checkRole(['admin']), async function (req, res, next) {
  try {
    let updatedRole = await roleController.UpdateRole(req.params.id, req.body);
    CreateSuccessRes(res, 200, updatedRole);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', verifyToken, checkRole(['admin']), async function (req, res, next) {
  try {
    let deleteRole = await roleController.DeleteRole(req.params.id);
    CreateSuccessRes(res, 200, deleteRole);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
