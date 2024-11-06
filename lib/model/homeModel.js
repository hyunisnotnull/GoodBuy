const DB = require('../db/db.js');

const homeModel = {
    getEvents: (callback) => {
        const sql = `SELECT * FROM TBL_EVENT WHERE E_ACTIVE = 1 ORDER BY E_NO DESC`;
        DB.query(sql, callback);
    },

    getAuctions: (callback) => {
        const sql = `SELECT *, PI_FILE P_IMAGE FROM TBL_PRODUCT JOIN TBL_PRODUCT_IMAGE ON P_IMAGE_NO = PI_NO WHERE P_STATE = 4 ORDER BY P_REG_DATE DESC LIMIT 12`;
        DB.query(sql, callback);
    },

    getProducts: (callback) => {
        const sql = `SELECT *, PI_FILE P_IMAGE FROM TBL_PRODUCT JOIN TBL_PRODUCT_IMAGE ON P_IMAGE_NO = PI_NO WHERE P_STATE = 3 ORDER BY P_REG_DATE DESC LIMIT 12`;
        DB.query(sql, callback);
    }
};

module.exports = homeModel;
