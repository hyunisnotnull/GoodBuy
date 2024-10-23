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

module.exports = router;