const express = require('express');
const router = express.Router();
const userService = require('../lib/service/userService');
const uploads = require('../lib/upload/uploads');

router.get('/sign_up_form', (req, res) => {
    console.log('/user/sign_up_form');
    userService.signupForm(req, res);

});

router.post('/sign_up_confirm', uploads.UPLOAD_PROFILE_MIDDLEWARE(), (req, res) => {
    console.log('/user/sign_up_form');
    userService.signupConfirm(req, res);

});

router.get('/sign_in_form', (req, res) => {
    console.log('/user/sign_in_form');
    console.log(req.query)
    userService.signinForm(req, res);

});

router.get('/modify_form', (req, res) => {
    console.log('/user/modify_form');
    userService.modifyForm(req, res);

});

router.post('/modify_confirm', uploads.UPLOAD_PROFILE_MIDDLEWARE(), (req, res) => {
    console.log('/user/modify_confirm');
    userService.modifyConfirm(req, res);

});

router.get('/sign_out_confirm', (req, res) => {
    console.log('/user/sign_out_confirm');
    userService.signoutConfirm(req, res);

});

router.get('/delete_confirm', (req, res) => {
    console.log('/user/delete_confirm');
    userService.deleteConfirm(req, res);

});

router.get('/mylist', (req, res) => {
    console.log('/user/mylist');
    userService.myList(req, res);

});

router.post('/cancel_wishlist', (req, res) => {
    console.log('/user/cancel_wishlist');
    userService.cancelWishlist(req, res);

});

router.get('/find_id_form', (req, res) => {
    console.log('/user/find_id_form');
    userService.findIdForm(req, res);

});

router.post('/find_id_confirm', (req, res) => {
    console.log('/user/find_id_confirm');
    userService.findIdConfirm(req, res);

});

router.get('/find_password_form', (req, res) => {
    console.log('/user/find_password_form');
    userService.findPasswordForm(req, res);

});

router.post('/find_password_confirm', (req, res) => {
    console.log('/user/find_password_confirm');
    userService.findPasswordConfirm(req, res);

});


module.exports = router;