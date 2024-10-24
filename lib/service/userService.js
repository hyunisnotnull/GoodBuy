const DB = require('../db/db.js');
const bcrypt = require('bcrypt');
const fs = require('fs');

const userService = {

    signupForm: (req, res) => {
        res.render('user/sign_up_form', {loginedUser: req.user});
    },

    signupConfirm: (req, res) => {
        
        let post = req.body;

        sql = `
            SELECT 
                COUNT(*) AS CNT 
            FROM 
                TBL_USER 
            WHERE 
                U_ID = ?
        `;
        state = [post.u_id];
        DB.query(
            sql, 
            state, 
            (error, result) => {
                if (error) {
                    res.render('user/sign_up_ng');

                } else {
                    if (result[0].CNT > 0) {
                        res.render('user/sign_up_ng');
                    } else {
                        sql = `
                            INSERT INTO TBL_USER(   U_ID, 
                                                    U_PW, 
                                                    U_NICK, 
                                                    U_PHONE, 
                                                    U_SEX, 
                                                    U_AGE, 
                                                    U_POST_ADDRESS,  
                                                    U_DETAIL_ADDRESS
                                                    ${req.file !== undefined ? `, U_PROFILE_THUM` : ``}) 
                            VALUES(?, ?, ?, ?, ?, ?, ?, ? ${req.file !== undefined ? `, ?`: ``})
                        `;
                        state = [   post.u_id, 
                                    bcrypt.hashSync(post.u_pw, 10), 
                                    post.u_nick,
                                    post.u_phone,
                                    post.u_sex,
                                    post.u_age,
                                    post.u_post_address,
                                    post.u_detail_address
                                ];
                        if (req.file !== undefined) state.push(req.file.filename);
                        DB.query(
                            sql, 
                            state, 
                            (error, result) => {
                
                                if (error) {
                                    fs.unlink(`c:\\goodbuy\\upload\\profile_thums\\${post.u_id}\\${req.file.filename}`, (error) => {
                
                                    });
                
                                    res.render('user/sign_up_ng');
                
                                } else {

                                    res.render('user/sign_up_ok');
                                    
                                }
                
                            }
                        );
                    }
                }
            }
        );

    },

    signinForm: (req, res) => {
        res.render('user/sign_in_form', {loginedUser: req.user, errMsg: req.query.errMsg});

    },

    modifyForm: (req, res) => {

        if (req.user === undefined)
            res.redirect('/user/sign_in_form');

        DB.query(
            `SELECT * FROM TBL_USER WHERE U_ID = ?`,
            [req.user.U_ID],
            (error, user) => {
                res.render('user/modify_form', {loginedUser: req.user, user: user[0]});

            }
        );

    },

    modifyConfirm: (req, res) => {

        let post = req.body;

        let sql = `
            UPDATE TBL_USER SET 
                U_NICK = ?, 
                U_PHONE = ?, 
                U_SEX = ?, 
                U_AGE = ?,
                U_POST_ADDRESS = ?, 
                U_DETAIL_ADDRESS = ?, 
                U_SNS_ID = ?, 
                U_MOD_DATE = NOW() 
                ${post.cover_profile_thum_delete === 'on' ? `, U_PROFILE_THUM = ?` : ``}
            WHERE 
                U_NO = ?
        `;
        let state = [
            post.u_nick, 
            post.u_phone, 
            post.u_sex,
            post.u_age,
            post.u_post_address, 
            post.u_detail_address, 
            post.u_sns_id
        ];

        if (post.u_pw && post.u_pw.trim() !== '') {
            state.unshift(bcrypt.hashSync(post.u_pw, 10)); 
            sql = sql.replace('UPDATE TBL_USER SET', 'UPDATE TBL_USER SET U_PW = ?,');
            console.log('sql ::', sql);
        } else {
            sql = sql.replace('UPDATE TBL_USER SET', 'UPDATE TBL_USER SET U_PW = U_PW,');
        }

        if (post.cover_profile_thum_delete === 'on') {    

            if (req.file !== undefined) {                   
                state.push(req.file.filename);
            } else {                                      
                state.push('');
            }

        }

        state.push(post.u_no);

        DB.query(
            sql, 
            state, 
            (error, result) => {
                if (error) {
                    console.log(error);
                    res.render('user/modify_ng');

                } else {
                    DB.query(
                        `
                            SELECT * FROM TBL_USER WHERE U_NO = ?
                        `,
                        [post.u_no],
                        (error, user) => {
                            req.user = user[0];
                            res.render('user/modify_ok');
                        }
                    );
                }
            }
        );

    },

    signoutConfirm: (req, res) => {
        req.session.destroy(() => {
            res.redirect('/');
        });

    },

    deleteConfirm: (req, res) => {
        if(req.user === undefined)
            res.redirect('/user/sign_in_form');

        DB.query(
            `
                DELETE FROM TBL_USER WHERE U_NO = ?
            `,
            [req.user.U_NO], 
            (error, result) => {

                if (error) {
                    res.render('user/delete_ng');
                    
                } else {
                    req.session.destroy(() => {
                        res.render('user/delete_ok');
                    });

                }

            }
        );

    }

}

module.exports = userService;