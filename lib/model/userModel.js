const DB = require('../db/db.js');
const bcrypt = require('bcrypt');

const userModel = {
    checkUserExists: (u_id, callback) => {
        const sql = `SELECT COUNT(*) AS CNT FROM TBL_USER WHERE U_ID = ?`;
        DB.query(sql, [u_id], callback);
    },

    createUser: (post, file, callback) => {
        const sql = `
            INSERT INTO TBL_USER(
                U_ID, U_PW, U_NICK, U_PHONE, U_SEX, U_AGE, 
                U_POST_ADDRESS, U_DETAIL_ADDRESS ${file ? ', U_PROFILE_THUM' : ''}
            ) VALUES(?, ?, ?, ?, ?, ?, ?, ? ${file ? ', ?' : ''})
        `;
        const state = [
            post.u_id,
            bcrypt.hashSync(post.u_pw, 10),
            post.u_nick,
            post.u_phone,
            post.u_sex,
            post.u_age,
            post.u_post_address,
            post.u_detail_address
        ];

        if (file) {
            state.push(file.filename);
        }

        DB.query(sql, state, callback);
    },

    updateUser: (post, file, callback) => {
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
                ${post.cover_profile_thum_delete === 'on' ? ', U_PROFILE_THUM = ?' : ''}
            WHERE 
                U_NO = ?
        `;
        const state = [
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
        } else {
            sql = sql.replace('UPDATE TBL_USER SET', 'UPDATE TBL_USER SET U_PW = U_PW,');
        }

        if (post.cover_profile_thum_delete === 'on') {
            if (file) {
                state.push(file.filename);
            } else {
                state.push('');
            }
        }

        state.push(post.u_no);

        DB.query(sql, state, callback);
    },

    deleteUser: (u_no, callback) => {
        const sql = `DELETE FROM TBL_USER WHERE U_NO = ?`;
        DB.query(sql, [u_no], callback);
    },

    getUser: (u_no, callback) => {
        const sql = `SELECT * FROM TBL_USER WHERE U_NO = ?`;
        DB.query(sql, [u_no], callback);
    },

    getWishlist: (u_no, callback) => {
        const sql = `
            SELECT P.*, W.W_REG_DATE
            FROM TBL_WISHLIST W
            JOIN TBL_PRODUCT P ON W.W_PRODUCT_NO = P.P_NO
            WHERE W.W_USER_NO = ?
        `;
        DB.query(sql, [u_no], callback);
    }
};

module.exports = userModel;
