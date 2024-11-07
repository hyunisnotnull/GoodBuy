const DB = require('../db/db.js');

const homeModel = {
    getEvents: (callback) => {
        const sql = `SELECT * FROM TBL_EVENT WHERE E_ACTIVE = 1 ORDER BY E_NO DESC`;
        DB.query(sql, callback);
    },

    getAuctions: (callback) => {
        const sql = `
        SELECT P.*, PI_FILE P_IMAGE , A.AU_CNT
        FROM TBL_PRODUCT P
        JOIN TBL_AUCTION A ON P.P_NO = A.AU_PRODUCT_NO
        JOIN TBL_PRODUCT_IMAGE PI ON P.P_IMAGE_NO = PI.PI_NO 
        WHERE P_STATE = 4 
        ORDER BY A.AU_CNT DESC, P.P_REG_DATE DESC
        LIMIT 12
        `;
        DB.query(sql, callback);
    },

    getProducts: (callback) => {
        const sql = `SELECT *, PI_FILE P_IMAGE FROM TBL_PRODUCT JOIN TBL_PRODUCT_IMAGE ON P_IMAGE_NO = PI_NO WHERE P_STATE = 3 ORDER BY P_REG_DATE DESC LIMIT 12`;
        DB.query(sql, callback);
    }
};

module.exports = homeModel;
