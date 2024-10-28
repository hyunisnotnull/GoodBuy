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

router.get('/modify_product_form', (req, res) => {
    console.log('/product/modify_product_form');
    productService.modifyProductForm(req, res);

});

router.post('/modify_product_confirm', uploads.UPLOAD_PROFILE_MIDDLEWARE(), (req, res) => {
    console.log('/product/modify_product_confirm');
    productService.modifyProductConfirm(req, res);

});

router.post('/delete_product_confirm', (req, res) => {
    console.log('/product/delete_product_confirm');
    productService.deleteProductConfirm(req, res);

});

router.post('/change_state_product_confirm', (req, res) => {
    console.log('/product/change_state_product_confirm');
    productService.changeStateProductConfirm(req, res);

});

router.post('/change_category_product_confirm', (req, res) => {
    console.log('/product/change_category_product_confirm');
    productService.changeCategoryProductConfirm(req, res);

});

router.get('/list_my_product_form', async (req, res) => {
    console.log('/product/list_my_product_form');
    productService.listMyProductForm(req, res);

});

router.get('/list_sale_product_form', async (req, res) => {
    console.log('/product/list_sale_product_form');
    if(!req.isAuthenticated()) {
        productService.listSaleProductFormAny(req, res)
    } else {
        productService.listSaleProductForm(req, res);
    }

});

router.get('/list_auction_product_form', async (req, res) => {
    console.log('/product/list_auction_product_form');
    if(!req.isAuthenticated()) {
        productService.listAuctionProductFormAny(req, res);
    } else {
        productService.listAuctionProductForm(req, res);
    }

});

router.get('/detail_product_form', (req, res) => {
    console.log('/product/detail_product_form');
    if(!req.isAuthenticated()) {
        res.redirect('/user/sign_in_form');
    } else {
        productService.detailProductForm(req, res);
    }

});

router.post('/filter_category_product_confirm', (req, res) => {
    console.log('/product/filter_category_product_confirm');
    productService.filterCategoryProductConfirm(req, res);

});

router.post('/filter_state_product_confirm', (req, res) => {
    console.log('/product/filter_state_product_confirm');
    productService.filterStateProductConfirm(req, res);

});

module.exports = router;