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

    addThums: (records, callback) => {
        console.log(records)
        const sql = `
            INSERT INTO tbl_product_image (pi_p_no, pi_file)
            VALUES ?
        `;
        DB.query(sql, [records], callback);
    },

    addProduct: (productData, callback) => {
        console.log(productData)
        const sql = `
            INSERT INTO tbl_product (p_owner_id, p_owner_nick, p_category, p_name, p_desc, p_price, p_state, p_trade_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        console.log('sql: ', sql)
        DB.query(sql, productData, callback);

    },
    updateProductImageNo: (imgNo, p_no, callback) => {
        console.log(imgNo)
        const sql = `
            UPDATE tbl_product SET p_image_no = ? where p_no = ?
        `;
        console.log('sql: ', sql)
        DB.query(sql, [imgNo, p_no], callback);


    },

    getProductById: (productId, callback) => {
        const sql = 'SELECT *, PI_FILE P_IMAGE FROM tbl_product JOIN tbl_product_image ON P_IMAGE_NO = PI_NO WHERE p_no = ?';
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

    changeProductState: (productId, newState, newTradeDate, callback) => {
        const sql = 'UPDATE tbl_product SET p_state = ?, p_trade_date = ? WHERE p_no = ?';
        DB.query(sql, [newState, newTradeDate, productId], callback);

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
            SELECT p.*, u.u_post_address P_ADDRESS , i.pi_file P_IMAGE
            FROM tbl_product p 
            JOIN tbl_user u ON p.p_owner_id = u.u_id 
            JOIN tbl_product_image i ON p.p_image_no = i.pi_no
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
    
    getProductImages: (pi_p_no, callback) => {
        const sql = 'SELECT * FROM tbl_product_image WHERE PI_P_NO = ?';
        console.log(sql)
        DB.query(sql, pi_p_no, callback);

    },

    getAuctionProducts: (userId, callback) => {
        let sql = `
            SELECT p.*, u.u_post_address P_ADDRESS, i.pi_file P_IMAGE
            FROM tbl_product p 
            JOIN tbl_user u ON p.p_owner_id = u.u_id 
            JOIN tbl_product_image i ON p.p_image_no = i.pi_no
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
    

    getProductsCountByOwnerWithCategoryAndState: (ownerId, p_category, p_state, callback) => {
        const sql = `
            SELECT COUNT(*) AS count 
            FROM tbl_product 
            WHERE p_owner_id = ? 
            AND p_state > 0 
            ${p_category !== '0' ? 'AND p_category = ?' : ''} 
            ${p_state !== '0' ? 'AND p_state = ?' : ''}`;
        
        const params = [ownerId];
        if (p_category !== '0') params.push(p_category);
        if (p_state !== '0') params.push(p_state);
        
        DB.query(sql, params, (error, results) => {
            if (error) return callback(error);
            callback(null, results[0].count);
        });
    },
    

    getProductsByOwnerWithCategoryAndState: (ownerId, p_category, p_state, offset, limit, callback) => {
        const sql = `
            SELECT P.*, I.PI_FILE P_IMAGE
            FROM tbl_product P
            JOIN tbl_product_image I ON P_IMAGE_NO = PI_NO
            WHERE p_owner_id = ? 
            AND p_state > 0 
            ${p_category !== '0' ? 'AND p_category = ?' : ''} 
            ${p_state !== '0' ? 'AND p_state = ?' : ''} 
            ORDER BY p_no DESC 
            LIMIT ? OFFSET ?`;
        
        const params = [ownerId];
        if (p_category !== '0') params.push(p_category);
        if (p_state !== '0') params.push(p_state);
        params.push(limit, offset);
        
        DB.query(sql, params, callback);
    },

    // 시세 조회 START
    // 등록가
    getSalePricesByKeyword: (keyword, callback) => {
        const query = `
            SELECT 
                AVG(P_PRICE) AS averagePrice, 
                MAX(P_PRICE) AS maxPrice, 
                MIN(P_PRICE) AS minPrice 
            FROM TBL_PRODUCT 
            WHERE P_STATE = 3 AND P_NAME LIKE ?`;

        DB.query(query, [`%${keyword}%`], callback);
    },

    // 판매가
    getRegisteredPricesByKeyword: (keyword, callback) => {
        const query = `
            SELECT 
                AVG(P_PRICE) AS averagePrice, 
                MAX(P_PRICE) AS maxPrice, 
                MIN(P_PRICE) AS minPrice 
            FROM TBL_PRODUCT 
            WHERE P_STATE = 2 AND P_NAME LIKE ?`;

        DB.query(query, [`%${keyword}%`], callback);
    },

    // 월별 등록가 시세 조회
    getMonthlyRegisteredPricesByKeyword: (keyword, callback) => {
        const sql = `
            SELECT 
                DATE_FORMAT(P_REG_DATE, '%Y-%m-%d') AS date,
                AVG(P_PRICE) AS averagePrice,
                MAX(P_PRICE) AS maxPrice,
                MIN(P_PRICE) AS minPrice
            FROM TBL_PRODUCT 
            WHERE P_STATE = 3 AND P_NAME LIKE ? 
            AND P_REG_DATE >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
            GROUP BY date 
            ORDER BY date DESC`;

        DB.query(sql, [`%${keyword}%`], callback);
    },
    
    // 월별 판매가 시세 조회
    getMonthlySalePricesByKeyword: (keyword, callback) => {
        const sql = `
            SELECT 
                DATE_FORMAT(P_REG_DATE, '%Y-%m-%d') AS date,
                AVG(P_PRICE) AS averagePrice,
                MAX(P_PRICE) AS maxPrice,
                MIN(P_PRICE) AS minPrice
            FROM TBL_PRODUCT 
            WHERE P_STATE = 2 AND P_NAME LIKE ? 
            AND P_REG_DATE >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
            GROUP BY date 
            ORDER BY date DESC`;

        DB.query(sql, [`%${keyword}%`], callback);
    },

    
    addWishlist: (wishData, callback) => {

        const sql = `
        INSERT INTO tbl_wishlist (
            w_user_no, 
            w_product_no)
        VALUES (?, ?)
        `;
    const state = [
        wishData.w_user_no,
        wishData.w_product_no
        ];

    DB.query(sql, state, callback);
    },

    addReport: (reportData, callback) => {

        const sql = `
        INSERT INTO tbl_report (
            r_u_no, 
            r_p_no)
        VALUES (?, ?)
        `;
    const state = [
        reportData.r_u_no,
        reportData.r_p_no
        ];

    DB.query(sql, state, callback);
    },

    joinAuction: (auctionData, callback) => {
        const sql = `
            UPDATE tbl_auction SET 
                au_buyer_id = ?, 
                au_buyer_nick = ?, 
                au_price = ?, 
                au_mod_date = NOW()
            WHERE au_product_no = ?
        `;
        const state = [
            auctionData.au_buyer_id,
            auctionData.au_buyer_nick,
            auctionData.au_price,
            auctionData.au_product_no,
        ];
        DB.query(sql, state, callback);
    },
};

module.exports = productModel;
