const express = require('express');
const router = express.Router();
const userService = require('../lib/service/userService');
const uploads = require('../lib/upload/uploads');

router.get('/signup_form', (req, res) => {
    console.log('/user/signup_form');
    userService.signupForm(req, res);

});

router.post('/signup_confirm', uploads.UPLOAD_PROFILE_MIDDLEWARE(), (req, res) => {
    console.log('/user/signup_form');
    userService.signupConfirm(req, res);

});

router.get('/signin_form', (req, res) => {
    console.log('/user/signin_form');
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

router.get('/signout_confirm', (req, res) => {
    console.log('/user/signout_confirm');
    userService.signoutConfirm(req, res);

});

router.get('/delete_confirm', (req, res) => {
    console.log('/user/delete_confirm');
    userService.deleteConfirm(req, res);

});

module.exports = router;