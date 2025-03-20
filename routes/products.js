var express = require('express');
var router = express.Router();
let productModel = require('../schemas/product');
let CategoryModel = require('../schemas/category');
let { verifyToken, checkRole } = require('../middlewares/auth');

function buildQuery(obj) {
  let result = {};
  if (obj.name) {
    result.name = new RegExp(obj.name, 'i');
  }
  result.price = {};
  if (obj.price) {
    if (obj.price.$gte) {
      result.price.$gte = obj.price.$gte;
    } else {
      result.price.$gte = 0;
    }
    if (obj.price.$lte) {
      result.price.$lte = obj.price.$lte;
    } else {
      result.price.$lte = 10000;
    }
  } else {
    result.price.$gte = 0;
    result.price.$lte = 10000;
  }
  return result;
}

router.get('/', async function (req, res, next) {
  let products = await productModel.find(buildQuery(req.query)).populate('category');
  res.status(200).send({ success: true, data: products });
});


router.post('/', verifyToken, checkRole('mod'), async function (req, res, next) {
  try {
    let cate = await CategoryModel.findOne({ name: req.body.category });
    if (cate) {
      let newProduct = new productModel({
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        category: cate._id,
      });
      await newProduct.save();
      res.status(200).send({ success: true, data: newProduct });
    } else {
      res.status(404).send({ success: false, data: 'cate khong dung' });
    }
  } catch (error) {
    res.status(404).send({ success: false, message: error.message });
  }
});


router.put('/:id', verifyToken, checkRole('mod'), async function (req, res, next) {
  try {
    let updateObj = {};
    let body = req.body;
    if (body.name) {
      updateObj.name = body.name;
    }
    if (body.price) {
      updateObj.price = body.price;
    }
    if (body.quantity) {
      updateObj.quantity = body.quantity;
    }
    if (body.category) {
      let cate = await CategoryModel.findOne({ name: req.body.category });
      if (!cate) {
        res.status(404).send({ success: false, message: 'Danh mục không hợp lệ' });
      }
    }
    let updatedProduct = await productModel.findByIdAndUpdate(req.params.id, updateObj, { new: true });
    res.status(200).send({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(404).send({ success: false, message: error.message });
  }
});

router.delete('/:id', verifyToken, checkRole('admin'), async function (req, res, next) {
  try {
    let product = await productModel.findById(req.params.id);
    if (product) {
      let deletedProduct = await productModel.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
      res.status(200).send({ success: true, data: deletedProduct });
    } else {
      res.status(404).send({ success: false, message: 'ID không tồn tại' });
    }
  } catch (error) {
    res.status(404).send({ success: false, message: error.message });
  }
});

module.exports = router;
