const userModel = require('../model/userModel');
const fs = require('fs');
const { calculatePagination, parsePageNumber, getPaginationData } = require('../pagination/paginationUtils');

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
    
        const pageQuery = req.query.page || 1;
        const currentPage = parsePageNumber(pageQuery);
        const itemsPerPage = 5; // 한 페이지당 상품 수
    
        // 찜한 상품의 총 개수 가져오기
        userModel.getCountWishlist(req.user.U_NO, (error, countResults) => {
            if (error || countResults === undefined || countResults === null) {
                console.error(error);
                return res.render('user/mylist', { loginedUser: req.user, products: [], pagination: {} });
            }

            const totalCount = countResults[0].count;
    
            // 페이지네이션 계산
            const { totalPages, offset } = calculatePagination(totalCount, itemsPerPage, currentPage);
            const paginationData = getPaginationData(currentPage, totalPages, '/user/mylist');
            
            // 페이지네이션에 맞게 찜 목록 가져오기
            userModel.getWishlist(req.user.U_NO, offset, itemsPerPage, (error, products) => {
                if (error) {
                    console.error(error);
                    return res.render('user/mylist', { loginedUser: req.user, products: [], pagination: {} });
                }
    
                res.render('user/mylist', {
                    loginedUser: req.user,
                    products: products,
                    pagination: paginationData
                });
            });
        });
    },    

    cancelWishlist: (req, res) => {
        if (req.user === undefined) {
            return res.redirect('/user/sign_in_form');
        }
    
        const productNo = req.body.productNo; // 클라이언트에서 보낸 상품 번호
    
        // DB에서 찜 취소
        userModel.cancelWishlist(req.user.U_NO, productNo, (error, results) => {
            if (error) {
                console.log(error); 
                return res.status(500).send({ success: false, message: '서버 오류가 발생했습니다.' });
            }
                return res.send({ success: true, message: '찜 취소가 완료되었습니다.'});

        });
    },

};

module.exports = userService;
