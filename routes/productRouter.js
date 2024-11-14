const express = require('express');
const router = express.Router();
const productService = require('../lib/service/productService');
const uploads = require('../lib/upload/uploads');
const roleCheck = require('../lib/passport/roleCheck');

router.get('/add_product_form', roleCheck(1), (req, res) => {
    console.log('/product/add_product_form');
    productService.addProductForm(req, res);

});

router.post('/add_product_confirm', roleCheck(1), uploads.UPLOAD_MULTI_PROFILE_MIDDLEWARE(), (req, res) => {
    console.log('/product/add_product_confirm');
    productService.addProductConfirm(req, res);

});


router.get('/modify_product_form',roleCheck(1), (req, res) => {
    console.log('/product/modify_product_form');
    productService.modifyProductForm(req, res);

});

router.post('/modify_product_confirm', roleCheck(1), uploads.UPLOAD_MULTI_PROFILE_MIDDLEWARE(), (req, res) => {
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
    if (!req.isAuthenticated()) {
        return res.redirect('/user/sign_in_form');
    }
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

router.post('/add_wishlist_confirm', roleCheck(1), (req, res) => {
    console.log('/product/add_wishlist_confirm');
    productService.addWishlistConfirm(req, res);

});

router.post('/add_report_confirm', roleCheck(1), (req, res) => {
    console.log('/product/add_report_confirm');
    productService.addReportConfirm(req, res);

});

router.post('/join_auction_confirm', roleCheck(1), (req, res) => {
    console.log('/product/join_auction_confirm');
    productService.joinAuctionConfirm(req, res);

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
    const keyword = req.query.keyword || '';

    // 검색어가 있을 때 유사 상품을 가져오기
    productService.searchRelatedProducts(keyword, (error, relatedProducts) => {
        if (error) {
            console.error('유사 상품 조회 중 오류:', error);
            return res.status(500).json({ message: '유사 상품 조회 중 오류가 발생했습니다.' });
        }

        // searchType에 따라 시세 조회 또는 쇼핑 검색 처리
        if (searchType === 'shopping') {
            // 네이버 쇼핑 검색 처리
            productService.searchShopping(req, res);
        } else {
            // 시세 조회 처리
            productService.searchRateList(req, res, relatedProducts);
        }
    });
});


module.exports = router;