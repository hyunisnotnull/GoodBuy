const userModel = require('../model/userModel');
const fs = require('fs');

const userService = {
    signupForm: (req, res) => {
        res.render('user/sign_up_form', { loginedUser: req.user });
    },

    signupConfirm: (req, res) => {
        const post = req.body;

        userModel.checkUserExists(post.u_id, (error, result) => {
            if (error || result[0].CNT > 0) {
                res.render('user/sign_up_ng');
            } else {
                userModel.createUser(post, req.file, (error) => {
                    if (error) {
                        if (req.file) {
                            fs.unlink(`c:\\goodbuy\\upload\\profile_thums\\${post.u_id}\\${req.file.filename}`, () => {});
                        }
                        res.render('user/sign_up_ng');
                    } else {
                        res.render('user/sign_up_ok');
                    }
                });
            }
        });
    },

    signinForm: (req, res) => {
        res.render('user/sign_in_form', { loginedUser: req.user, errMsg: req.query.errMsg });
    },

    modifyForm: (req, res) => {
        if (req.user === undefined) {
            return res.redirect('/user/sign_in_form');
        }

        userModel.getUser(req.user.U_NO, (error, user) => {
            res.render('user/modify_form', { loginedUser: req.user, user: user[0] });
        });
    },

    modifyConfirm: (req, res) => {
        const post = req.body;

        userModel.updateUser(post, req.file, (error) => {
            if (error) {
                res.render('user/modify_ng');
            } else {
                userModel.getUser(post.u_no, (error, user) => {
                    req.user = user[0];
                    res.render('user/modify_ok');
                });
            }
        });
    },

    signoutConfirm: (req, res) => {
        req.session.destroy(() => {
            res.redirect('/');
        });
    },

    deleteConfirm: (req, res) => {
        if (req.user === undefined) {
            return res.redirect('/user/sign_in_form');
        }

        userModel.deleteUser(req.user.U_NO, (error) => {
            if (error) {
                res.render('user/delete_ng');
            } else {
                req.session.destroy(() => {
                    res.render('user/delete_ok');
                });
            }
        });
    },

    myList: (req, res) => {
        if (req.user === undefined) {
            return res.redirect('/user/sign_in_form');
        }

        userModel.getWishlist(req.user.U_NO, (error, results) => {
            if (error) console.log(error);
            res.render('user/mylist', {
                loginedUser: req.user,
                products: results
            });
        });
    }
};

module.exports = userService;
