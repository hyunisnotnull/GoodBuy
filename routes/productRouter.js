const express = require('express');
const router = express.Router();
const productService = require('../lib/service/productService');
const uploads = require('../lib/upload/uploads');
const roleCheck = require('../lib/passport/roleCheck');

router.get('/add_product_form', (req, res) => {
    console.log('/product/add_product_form');
    productService.addProductForm(req, res);

});

router.post('/add_product_confirm', roleCheck(1), uploads.UPLOAD_MULTI_PROFILE_MIDDLEWARE(), (req, res) => {
    console.log('/product/add_product_confirm');

    productService.addProductConfirm(req, res);


});


router.get('/modify_product_form', (req, res) => {
    console.log('/product/modify_product_form');
    productService.modifyProductForm(req, res);

});

router.post('/modify_product_confirm', roleCheck(1), uploads.UPLOAD_PROFILE_MIDDLEWARE(), (req, res) => {
    console.log('/product/modify_product_confirm');
    productService.modifyProductConfirm(req, res);

});

router.post('/delete_product_confirm', roleCheck(1), (req, res) => {
    console.log('/product/delete_product_confirm');
    productService.deleteProductConfirm(req, res);

});

router.post('/change_state_product_confirm', roleCheck(1), (req, res) => {
    console.log('/product/change_state_product_confirm');
    productService.changeStateProductConfirm(req, res);

});

router.post('/change_category_product_confirm', roleCheck(1), (req, res) => {
    console.log('/product/change_category_product_confirm');
    productService.changeCategoryProductConfirm(req, res);

});

router.get('/list_my_product_form', async (req, res) => {
    console.log('/product/list_my_product_form');
    productService.listMyProductForm(req, res);

});

router.get('/list_sale_product_form', async (req, res) => {
    console.log('/product/list_sale_product_form');
    productService.listSaleProductForm(req, res);

});

router.get('/list_auction_product_form', async (req, res) => {
    console.log('/product/list_auction_product_form');
    productService.listAuctionProductForm(req, res);

});

router.get('/detail_product_form', (req, res) => {
    console.log('/product/detail_product_form');

        productService.detailProductForm(req, res);


});

/*
router.post('/filter_category_product_confirm', (req, res) => {
    console.log('/product/filter_category_product_confirm');
    productService.filterCategoryProductConfirm(req, res);

});

router.post('/filter_state_product_confirm', (req, res) => {
    console.log('/product/filter_state_product_confirm');
    productService.filterStateProductConfirm(req, res);

});
*/

router.post('/add_wishlist_confirm', (req, res) => {
    console.log('/product/add_wishlist_confirm');
    if(!req.isAuthenticated()) {
        res.redirect('/user/sign_in_form');
    } else {
    productService.addWishlistConfirm(req, res);
    }

});

router.post('/add_report_confirm', (req, res) => {
    console.log('/product/add_report_confirm');
    if(!req.isAuthenticated()) {
        res.redirect('/user/sign_in_form');
    } else {
    productService.addReportConfirm(req, res);
    }

});

router.post('/join_auction_confirm', (req, res) => {
    console.log('/product/join_auction_confirm');
    if(!req.isAuthenticated()) {
        res.redirect('/user/sign_in_form');
    } else {
    productService.joinAuctionConfirm(req, res);
    }
    
});

router.post('/get_product_images', (req, res) => {
    console.log('/product/get_product_images');
    productService.getProductImages(req, res);

});

// 브라우저 세션용
router.post('/get_product', (req, res) => {
    console.log('/product/get_product');
    productService.getProduct(req, res);
});

// 시세 조회 START
router.get('/list_rate_product_form', (req, res) => {
    console.log('/product/list_rate_product_form');
    const searchType = req.query.searchType;
    if (searchType === 'shopping') {
        productService.searchShopping(req, res); // Naver 쇼핑 검색 호출
    } else {
        productService.searchRateList(req, res); // 시세 조회 호출
    }
});

// NAVER SHOP API START
router.get('/search_shopping', (req, res) => {
    console.log('/product/search_shopping');
    productService.searchShopping(req, res);

});

module.exports = router;