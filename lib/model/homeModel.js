const DB = require('../db/db.js');

const homeModel = {
    getEvents: (callback) => {
        const sql = `SELECT * FROM TBL_EVENT WHERE E_ACTIVE = 1 ORDER BY E_NO DESC`;
        DB.query(sql, callback);
    },

    getAuctions: (callback) => {
        const sql = `SELECT * FROM TBL_PRODUCT WHERE P_STATE = 4 ORDER BY P_REG_DATE DESC LIMIT 15`;
        DB.query(sql, callback);
    },

    getProducts: (callback) => {
        const sql = `SELECT * FROM TBL_PRODUCT WHERE P_STATE = 3 ORDER BY P_REG_DATE DESC LIMIT 15`;
        DB.query(sql, callback);
    }
};

module.exports = homeModel;
