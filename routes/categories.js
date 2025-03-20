var express = require('express');
var router = express.Router();
let categoryModel = require('../schemas/category');
let { verifyToken, checkRole } = require('../middlewares/auth');


router.get('/', async function (req, res, next) {
  let categories = await categoryModel.find({});
  res.status(200).send({ success: true, data: categories });
});


router.get('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let category = await categoryModel.findById(id);
    if (category) {
      res.status(200).send({ success: true, data: category });
    } else {
      res.status(404).send({ success: false, message: "ID không hợp lệ" });
    }
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});


router.post('/', verifyToken, checkRole('admin'), async function (req, res, next) {
  try {
    let newCategory = new categoryModel({ name: req.body.name });
    await newCategory.save();
    res.status(201).send({ success: true, data: newCategory });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

router.put('/:id', verifyToken, checkRole('admin'), async function (req, res, next) {
  try {
    let updatedCategory = await categoryModel.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    if (updatedCategory) {
      res.status(200).send({ success: true, data: updatedCategory });
    } else {
      res.status(404).send({ success: false, message: "ID không hợp lệ" });
    }
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});


router.delete('/:id', verifyToken, checkRole('admin'), async function (req, res, next) {
  try {
    let deletedCategory = await categoryModel.findByIdAndDelete(req.params.id);
    if (deletedCategory) {
      res.status(200).send({ success: true, data: deletedCategory });
    } else {
      res.status(404).send({ success: false, message: "ID không hợp lệ" });
    }
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

module.exports = router;
