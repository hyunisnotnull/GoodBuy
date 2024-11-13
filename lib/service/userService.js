const userModel = require('../model/userModel');
const emailService = require('../nodemailer/emailService');
const uuid4 = require('uuid4');

const fs = require('fs');
const { calculatePagination, parsePageNumber, getPaginationData } = require('../pagination/paginationUtils');

const userService = {
    signupForm: (req, res) => {
        userModel.getEvents((error, events) => {
            if (error) {
                console.error(error);
                events = []; 
            }
        res.render('user/sign_up_form', { loginedUser: req.user, events: events });
        });
    },

    signupConfirm: (req, res) => {
        const post = req.body;

        userModel.checkUserExists(post.u_id, post.u_nick, (error, result) => {
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
        userModel.getEvents((error, events) => {
            if (error) {
                console.error(error);
                events = []; 
            }
        res.render('user/sign_in_form', { loginedUser: req.user, errMsg: req.query.errMsg, events: events });
        });
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

        userModel.checkUserExists(post.u_id, post.u_nick, (error, result) => {
            if (error || result[0].CNT > 0) {
                res.render('user/modify_ng');
                
            } else {
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

    findIdForm: (req, res) => {
        res.render('user/find_id_form', { loginedUser: req.user });
    },

    findIdConfirm: (req, res) => {
        const post = req.body;
        console.log(post);
        userModel.findIdByNickPhone(post, (error, result) => {
            console.log(result);
            if (error) {
                res.render('user/find_id_form_result', { loginedUser: req.user, result, post });
            } else {
                res.render('user/find_id_form_result', { loginedUser: req.user, result, post });
            }
        });
    },

    findPasswordForm: (req, res) => {
        res.render('user/find_password_form', { loginedUser: req.user });
    },


    findPasswordConfirm: (req, res) => {
        const post = req.body;
        const { u_id, u_nick, u_phone } = post;
    
        function generateTemporaryPassword() {
            const uuid = uuid4();
            return uuid.replace(/-/g, "").substring(0, 8);
        }
    
        const tempPassword = generateTemporaryPassword();
    
        // 사용자 확인 및 비밀번호 업데이트
        if (u_id && u_nick && u_phone) {
            userModel.findUserByInfos(u_id, u_nick, u_phone, (error, user) => {

                if (error || user === null || user === undefined || user.length <= 0) {
                    console.error("사용자 확인 실패:", error);
                    return res.json({ success: false, message: '입력한 정보로 사용자를 찾을 수 없습니다.' });
                }

                console.log('u_id, u_nick, u_phone', u_id, u_nick, u_phone);
                
                console.log('user', user);
    
                userModel.updatePassword(u_id, tempPassword, (updateError) => {
                    if (updateError) {
                        console.error("비밀번호 업데이트 오류:", updateError);
                        return res.json({ success: false, message: '비밀번호 업데이트에 실패했습니다.' });
                    }
    
                    // 이메일 발송
                    emailService.sendPasswordResetEmail(u_id, tempPassword)
                        .then(() => {
                            res.json({ success: true, message: '임시 비밀번호가 이메일로 전송되었습니다.' });
                        })
                        .catch(emailError => {
                            console.error("이메일 전송 오류:", emailError);
                            res.json({ success: false, message: '이메일 전송에 실패했습니다.' });
                        });
                });
            });
        } else {
            res.json({ success: false, message: '모든 정보를 입력해주세요.' });
        }
    },

};

module.exports = userService;
