const DB = require('../db/db.js');

const homeModel = {
    getEvents: (callback) => {
        const sql = `SELECT * FROM TBL_EVENT WHERE E_ACTIVE = 2 ORDER BY E_NO DESC`;
        DB.query(sql, callback);
    },

    getAuctions: (callback) => {
        const sql = `SELECT * FROM TBL_AUCTION ORDER BY AU_REG_DATE DESC LIMIT 6`;
        DB.query(sql, callback);
    },

    getProducts: (callback) => {
        const sql = `SELECT * FROM TBL_PRODUCT ORDER BY P_REG_DATE DESC LIMIT 6`;
        DB.query(sql, callback);
    }
};

module.exports = homeModel;
