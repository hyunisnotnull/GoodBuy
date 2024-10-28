const DB = require('../db/db.js');

const productModel = {
    getAllCategories: (callback) => {
        const sql = `SELECT * FROM tbl_category`
        DB.query(sql, callback);
    },

    getAllStates: (callback) => {
        const sql = `SELECT * FROM tbl_state`
        DB.query(sql, callback);
    },

    addProduct: (productData, callback) => {
        const sql = `
            INSERT INTO tbl_product (p_owner_id, p_owner_nick, p_category, p_image, p_name, p_desc, p_price, p_state)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        DB.query(sql, productData, callback);
    },

    getProductById: (productId, callback) => {
        const sql = 'SELECT * FROM tbl_product WHERE p_no = ?';
        DB.query(sql, [productId], callback);
    },

    updateProduct: (productData, callback) => {
        const sql = `
            UPDATE tbl_product SET 
                p_category = ?, 
                p_name = ?, 
                p_desc = ?, 
                p_price = ?, 
                p_state = ?, 
                p_mod_date = NOW()
                ${productData.image ? ', p_image = ?' : ''}
            WHERE p_no = ?
        `;
        const state = [
            productData.p_category,
            productData.p_name,
            productData.p_desc,
            productData.p_price,
            productData.p_state,
            productData.p_no
        ];
        if (productData.image) {
            state.splice(5, 0, productData.image);
        }
        DB.query(sql, state, callback);
    },

    deleteProduct: (productId, callback) => {
        const sql = 'UPDATE tbl_product SET p_state = 0 WHERE p_no = ?';
        DB.query(sql, [productId], callback);
    },

    changeProductState: (productId, newState, callback) => {
        const sql = 'UPDATE tbl_product SET p_state = ? WHERE p_no = ?';
        DB.query(sql, [newState, productId], callback);
    },

    changeProductCategory: (productId, newCategory, callback) => {
        const sql = 'UPDATE tbl_product SET p_category = ? WHERE p_no = ?';
        DB.query(sql, [newCategory, productId], callback);
    },

    getProductsCountByOwner: (ownerId, callback) => {
        const sql = 'SELECT COUNT(*) AS count FROM tbl_product WHERE p_owner_id = ? AND p_state > 0';
        DB.query(sql, [ownerId], (error, results) => {
            if (error) return callback(error);
            callback(null, results[0].count);
        });
    },

    getProductsByOwner: (ownerId, offset, limit, callback) => {
        const sql = `
            SELECT p.*, ap.au_price 
            FROM tbl_product p 
            LEFT JOIN tbl_auction ap ON p.p_no = ap.AU_PRODUCT_NO 
            WHERE p_owner_id = ? AND p_state > 0 
            ORDER BY p_no DESC
            LIMIT ? OFFSET ?
        `;
        DB.query(sql, [ownerId, limit, offset], callback);
    },

    getProductsForSale: (userId, keyword, sortBy, callback) => {
        let sql = `
            SELECT p.*, u.u_post_address P_ADDRESS 
            FROM tbl_product p 
            JOIN tbl_user u ON p.p_owner_id = u.u_id 
            WHERE p_state = 3
        `;
        const state = [];
    
        // userId가 있을 경우, 자신이 등록한 상품은 제외
        if (userId) {
            sql += ' AND p_owner_id != ?';
            state.push(userId);
        }
    
        if (keyword) {
            const keywordsArray = keyword.split(' ').filter(k => k);
            const likeConditions = keywordsArray.map(k => `p_name LIKE ?`).join(' OR ');
            sql += ' AND (' + likeConditions + ')';
            keywordsArray.forEach(k => state.push(`%${k}%`));
        }
    
        if (sortBy === 'price_low') {
            sql += ' ORDER BY p_price ASC';
        } else if (sortBy === 'price_high') {
            sql += ' ORDER BY p_price DESC';
        } else {
            sql += ' ORDER BY p_mod_date DESC';
        }
    
        DB.query(sql, state, callback);
    },
    

    getAuctionProducts: (userId, callback) => {
        let sql = `
            SELECT p.*, u.u_post_address P_ADDRESS 
            FROM tbl_product p 
            JOIN tbl_user u ON p.p_owner_id = u.u_id 
            WHERE p_state = 4
        `;
        
        const state = [];
    
        if (userId) {
            sql += ' AND p_owner_id != ?';
            state.push(userId);
        }
    
        sql += ' ORDER BY p_no DESC';
    
        DB.query(sql, state, callback);
    },
    

    getProductsCountByOwnerWithCategory: (ownerId, p_category, callback) => {
        const sql = `SELECT COUNT(*) AS count FROM tbl_product WHERE p_owner_id = ? ${p_category !== '0' ? 'AND p_category = ?' : ''}`;
        const params = [ownerId];
        if (p_category !== '0') params.push(p_category);
        DB.query(sql, params, (error, results) => {
            if (error) return callback(error);
            callback(null, results[0].count);
        });
    },
    
    getProductsByOwnerWithCategory: (ownerId, p_category, offset, limit, callback) => {
        const sql = `SELECT * FROM tbl_product WHERE p_owner_id = ? ${p_category !== '0' ? 'AND p_category = ?' : ''} ORDER BY p_no DESC LIMIT ? OFFSET ?`;
        const params = [ownerId];
        if (p_category !== '0') params.push(p_category);
        params.push(limit, offset);
        DB.query(sql, params, callback);
    },
    
    getProductsCountByOwnerWithState: (ownerId, p_state, callback) => {
        const sql = `SELECT COUNT(*) AS count FROM tbl_product WHERE p_owner_id = ? ${p_state !== '0' ? 'AND p_state = ?' : ''}`;
        const params = [ownerId];
        if (p_state !== '0') params.push(p_state);
        DB.query(sql, params, (error, results) => {
            if (error) return callback(error);
            callback(null, results[0].count);
        });
    },
    
    getProductsByOwnerWithState: (ownerId, p_state, offset, limit, callback) => {
        const sql = `SELECT * FROM tbl_product WHERE p_owner_id = ? ${p_state !== '0' ? 'AND p_state = ?' : ''} ORDER BY p_no DESC LIMIT ? OFFSET ?`;
        const params = [ownerId];
        if (p_state !== '0') params.push(p_state);
        params.push(limit, offset);
        DB.query(sql, params, callback);
    },
    
    

};

module.exports = productModel;
