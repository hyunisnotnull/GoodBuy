const express = require('express');
const router = express.Router();
const productService = require('../lib/service/productService');
const uploads = require('../lib/upload/uploads');

router.get('/add_product_form', (req, res) => {
    console.log('/product/add_product_form');
    productService.addProductForm(req, res);

});

router.post('/add_product_confirm', uploads.UPLOAD_PROFILE_MIDDLEWARE(), (req, res) => {
    console.log('/product/add_product_confirm');
    productService.addProductConfirm(req, res);

});

router.get('/remove_product_confirm', (req, res) => {
    console.log('/product/remove_product_confirm');
    productService.removeProductConfirm(req, res);

});

router.get('/calcel_product_confirm', (req, res) => {
    console.log('/product/remove_product_confirm');
    productService.removeProductConfirm(req, res);

});

router.get('/list_product_form', async (req, res) => {
    console.log('/product/list_product_form');
    
    productService.listProductForm(req, res);


});


module.exports = router;