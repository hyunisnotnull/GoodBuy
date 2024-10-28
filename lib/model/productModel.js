// model/productModel.js
const DB = require('../db/db.js');

const productModel = {
    getAllCategories: (callback) => {
        DB.query('SELECT * FROM tbl_category', callback);
    },

    getAllStates: (callback) => {
        DB.query('SELECT * FROM tbl_state', callback);
    },

    addProduct: (productData, callback) => {
        const sql = `
            INSERT INTO tbl_product (p_owner_id, p_owner_nick, p_category, p_image, p_name, p_desc, p_price, p_state) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const state = [
            productData.u_id,
            productData.u_nick,
            productData.p_category,
            productData.p_image,
            productData.p_name,
            productData.p_desc,
            productData.p_price,
            productData.p_state,
        ];
        DB.query(sql, state, callback);
    },

    getProductsByOwner: (ownerId, callback) => {
        const sql = `
            SELECT * FROM tbl_product 
            WHERE p_owner_id = ? AND p_state > 0 
            ORDER BY p_no DESC
        `;
        DB.query(sql, [ownerId], callback);
    },

    getProductById: (productId, callback) => {
        const sql = `
            SELECT * FROM tbl_product 
            WHERE p_no = ?
        `;
        DB.query(sql, [productId], callback);
    },

    updateProduct: (productData, productId, callback) => {
        const sql = `
            UPDATE tbl_product 
            SET p_category = ?, p_name = ?, p_desc = ?, p_price = ?, p_state = ?, p_mod_date = NOW()
            ${productData.p_image ? ', p_image = ?' : ''}
            WHERE p_no = ?
        `;
        const state = [
            productData.p_category,
            productData.p_name,
            productData.p_desc,
            productData.p_price,
            productData.p_state,
            ...(productData.p_image ? [productData.p_image] : []),
            productId,
        ];
        DB.query(sql, state, callback);
    },

    deleteProduct: (productId, callback) => {
        const sql = `
            UPDATE tbl_product 
            SET p_state = 0 
            WHERE p_no = ?
        `;
        DB.query(sql, [productId], callback);
    },

    changeState: (productId, newState, callback) => {
        const sql = `
            UPDATE tbl_product 
            SET p_state = ? 
            WHERE p_no = ?
        `;
        DB.query(sql, [newState, productId], callback);
    },

    changeCategory: (productId, newCategory, callback) => {
        const sql = `
            UPDATE tbl_product 
            SET p_category = ? 
            WHERE p_no = ?
        `;
        DB.query(sql, [newCategory, productId], callback);
    },

    filterProductsByCategory: (ownerId, categoryId, callback) => {
        const sql = `
            SELECT * FROM tbl_product 
            WHERE p_owner_id = ? ${categoryId !== '0' ? 'AND p_category = ?' : ''} AND p_state > 0 
            ORDER BY p_no DESC
        `;
        const state = [ownerId];
        if (categoryId !== '0') state.push(categoryId);
        DB.query(sql, state, callback);
    },

    filterProductsByState: (ownerId, stateId, callback) => {
        const sql = `
            SELECT * FROM tbl_product 
            WHERE p_owner_id = ? ${stateId !== '0' ? 'AND p_state = ?' : 'AND p_state > 0'} 
            ORDER BY p_no DESC
        `;
        const state = [ownerId];
        if (stateId !== '0') state.push(stateId);
        DB.query(sql, state, callback);
    },

    listSaleProducts: (userId, keyword, callback) => {
        const sql = `
            SELECT p.*, u.u_post_address AS P_ADDRESS 
            FROM tbl_product p 
            JOIN tbl_user u ON p.p_owner_id = u.u_id 
            WHERE p_state = 3 AND p_owner_id != ?
        `;
        const params = [userId];

        if (keyword) {
            const keywordsArray = keyword.split(' ').filter(k => k);
            const likeConditions = keywordsArray.map(k => 'p_name LIKE ?').join(' OR ');
            sql += ' AND (' + likeConditions + ')';
            keywordsArray.forEach(k => params.push(`%${k}%`));
        }

        DB.query(sql, params, callback);
    },

    listAuctionProducts: (userId, callback) => {
        const sql = `
            SELECT p.*, u.u_post_address AS P_ADDRESS 
            FROM tbl_product p 
            JOIN tbl_user u ON p.p_owner_id = u.u_id 
            WHERE p_state = 4 AND p_owner_id != ? 
            ORDER BY p_no DESC
        `;
        DB.query(sql, [userId], callback);
    }
};

module.exports = productModel;
