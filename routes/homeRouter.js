const express = require('express');
const router = express.Router();
const homeService = require('../lib/service/homeService');

router.get('/', (req, res) => {
    console.log('/home/');
    homeService.home(req, res);

});

/*
router.get('/get_sale_product',(req, res) => {
    console.log('/home/get_sale_product');
    homeService.getSaleProduct(req, res);

});

router.get('/get_auction_product',(req, res) => {
    console.log('/home/get_auction_product');
    homeService.getAuctionProduct(req, res);

});
*/

module.exports = router;