const DB = require('../db/db.js');

const productModel = {
    getAllCategories: (callback) => {
        const sql = `SELECT * FROM TBL_CATEGORY`
        DB.query(sql, callback);
    },

    getAllStates: (callback) => {
        const sql = `SELECT * FROM TBL_STATE`
        DB.query(sql, callback);
    },

    addThums: (records, callback) => {
        console.log(records)
        const sql = `
            INSERT INTO TBL_PRODUCT_IMAGE (PI_P_NO, PI_FILE)
            VALUES ?
        `;
        DB.query(sql, [records], callback);
    },

    addProduct: (productData, callback) => {
        console.log(productData)
        const sql = `
            INSERT INTO TBL_PRODUCT (P_OWNER_ID, P_OWNER_NICK, P_CATEGORY, P_NAME, P_DESC, P_PRICE, P_STATE, P_TRADE_DATE)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        console.log('sql: ', sql)
        DB.query(sql, productData, callback);

    },
    updateProductImageNo: (imgNo, p_no, callback) => {
        console.log(imgNo)
        const sql = `
            UPDATE TBL_PRODUCT SET P_IMAGE_NO = ? WHERE P_NO = ?
        `;
        console.log('sql: ', sql)
        DB.query(sql, [imgNo, p_no], callback);


    },

    getProductById: (productId, u_no, callback) => {
        const sql = `SELECT P.*, PI_FILE P_IMAGE, PI_NO, U_CLASS, W_NO 
                     FROM TBL_PRODUCT P 
                     JOIN TBL_PRODUCT_IMAGE 
                        ON P_NO = PI_P_NO 
                     JOIN TBL_USER 
                        ON P_OWNER_ID = U_ID 
                     LEFT JOIN TBL_WISHLIST ON P_NO = W_PRODUCT_NO ${ !!u_no ? ' AND W_USER_NO = ? ' : 'AND W_USER_NO = 0'}
                     WHERE P_NO = ?`;
            const state = [
                productId,
            ];
            if (!!u_no) {
                state.unshift(u_no);
            }   
           
        DB.query(sql, state, callback);
    },

    updateProduct: (productData, callback) => {
        const sql = `
            UPDATE TBL_PRODUCT SET 
                P_CATEGORY = ?, 
                P_NAME = ?, 
                P_DESC = ?, 
                P_PRICE = ?, 
                P_STATE = ?, 
                P_IMAGE_NO = ?,
                ${productData.p_trade_date ? 'P_TRADE_DATE = ?,' : ''}
                P_MOD_DATE = NOW()
            WHERE P_NO = ?
        `;
        const state = [
            productData.p_category,
            productData.p_name,
            productData.p_desc,
            productData.p_price,
            productData.p_state,
            productData.p_image_no,
            productData.p_no
        ];
        if (productData.p_trade_date) {
            state.splice(6, 0, productData.p_trade_date);
        }
        DB.query(sql, state, callback);
    },

    deleteProduct: (productId, callback) => {
        const sql = 'UPDATE TBL_PRODUCT SET P_STATE = 0 WHERE P_NO = ?';
        DB.query(sql, [productId], callback);
    },

    deleteProductImages:(p_no, callback) => {
        const sql = 'DELETE FROM TBL_PRODUCT_IMAGE WHERE PI_P_NO = ?';
        DB.query(sql, [p_no], callback);
    },


    changeProductState: (productId, newState, newTradeDate, callback) => {
        const sql = 'UPDATE TBL_PRODUCT SET P_STATE = ?, P_TRADE_DATE = ? WHERE P_NO = ?';
        DB.query(sql, [newState, newTradeDate, productId], callback);

    },

    changeProductCategory: (productId, newCategory, callback) => {
        const sql = 'UPDATE TBL_PRODUCT SET P_CATEGORY = ? WHERE P_NO = ?';
        DB.query(sql, [newCategory, productId], callback);
    },

    getProductsCountByOwner: (ownerId, callback) => {
        const sql = 'SELECT COUNT(*) AS count FROM TBL_PRODUCT WHERE P_OWNER_ID = ? AND P_STATE > 0';
        DB.query(sql, [ownerId], (error, results) => {
            if (error) return callback(error);
            callback(null, results[0].count);
        });
    },

    getProductsByOwner: (ownerId, offset, limit, callback) => {
        const sql = `
            SELECT P.*, AP.AU_PRICE 
            FROM TBL_PRODUCT P 
            LEFT JOIN TBL_AUCTION AP ON P.P_NO = AP.AU_PRODUCT_NO 
            WHERE P_OWNER_ID = ? AND P_STATE > 0 
            ORDER BY P_NO DESC
            LIMIT ? OFFSET ?
        `;
        DB.query(sql, [ownerId, limit, offset], callback);
    },

    getProductsForSaleCount: (userId, p_category, keyword, callback) => {
        let sql = `
            SELECT COUNT(*) AS count
            FROM TBL_PRODUCT P
            JOIN TBL_USER U ON P.P_OWNER_ID = U.U_ID
            JOIN TBL_PRODUCT_IMAGE I ON P.P_IMAGE_NO = I.PI_NO
            WHERE P_STATE = 3
        `;
        const state = [];
        
        if (p_category !== '0') {
            sql += ' AND P_CATEGORY = ?';
            state.push(p_category);
        }
    
        // userId가 있을 경우, 자신이 등록한 상품은 제외
        if (userId) {
            sql += ' AND P_OWNER_ID != ?';
            state.push(userId);
        }
    
        if (keyword) {
            const keywordsArray = keyword.split(' ').filter(k => k);
            const likeConditions = keywordsArray.map(k => `P_NAME LIKE ?`).join(' OR ');
            sql += ' AND (' + likeConditions + ')';
            keywordsArray.forEach(k => state.push(`%${k}%`));
        }
    
        DB.query(sql, state, (error, results) => {
            if (error) return callback(error);
            
            callback(null, results[0].count);
        });
    },
       

    getProductsForSale: (userId, p_category, keyword, sortBy, offset, limit, callback) => {
        let sql = `
            SELECT P.*, U.U_POST_ADDRESS AS P_ADDRESS, I.PI_FILE P_IMAGE 
            FROM TBL_PRODUCT P 
            JOIN TBL_USER U ON P.P_OWNER_ID = U.U_ID 
            JOIN TBL_PRODUCT_IMAGE I ON P.P_IMAGE_NO = I.PI_NO
            WHERE P_STATE = 3
        `;
        const state = [];
    
        // userId가 있을 경우, 자신이 등록한 상품은 제외
        if (userId) {
            sql += ' AND P_OWNER_ID != ?';
            state.push(userId);
        }
    
        // 카테고리 필터링
        if (p_category !== '0') {
            sql += ' AND P_CATEGORY = ?';
            state.push(p_category);
        }
    
        // 키워드 필터링
        if (keyword) {
            const keywordsArray = keyword.split(' ').filter(k => k);
            const likeConditions = keywordsArray.map(k => `P_NAME LIKE ?`).join(' OR ');
            sql += ' AND (' + likeConditions + ')';
            keywordsArray.forEach(k => state.push(`%${k}%`));
        }
    
        // 정렬 옵션
        if (sortBy === 'price_low') {
            sql += ' ORDER BY P_PRICE ASC';
        } else if (sortBy === 'price_high') {
            sql += ' ORDER BY P_PRICE DESC';
        } else {
            sql += ' ORDER BY P_MOD_DATE DESC';
        }
    
        // LIMIT와 OFFSET 추가
        sql += ' LIMIT ? OFFSET ?';
        state.push(limit, offset);
    
        DB.query(sql, state, callback);
    },
    
    getProductImages: (pi_p_no, callback) => {
        const sql = 'SELECT * FROM TBL_PRODUCT_IMAGE WHERE PI_P_NO = ?';
        console.log(sql)
        DB.query(sql, pi_p_no, callback);

    },

    getProductsForAuctionCount: (userId, p_category, callback) => {
        let sql = `
            SELECT COUNT(*) AS count
            FROM TBL_AUCTION A
            JOIN TBL_USER U ON A.AU_SELLER_ID = U.U_ID
            JOIN TBL_PRODUCT P ON P.P_NO = A.AU_PRODUCT_NO
            JOIN TBL_PRODUCT_IMAGE I ON P.P_IMAGE_NO = I.PI_NO
            WHERE AU_STATE = 4
        `;
        const state = [];
    
        // userId가 있을 경우, 자신이 등록한 상품은 제외
        if (userId) {
            sql += ' AND AU_SELLER_ID != ?';
            state.push(userId);
        }

        // 카테고리 필터링
        if (p_category !== '0') {
            sql += ' AND P.P_CATEGORY = ?';
            state.push(p_category);
        }
    
        DB.query(sql, state, (error, results) => {
            if (error) {
                console.error("Database error:", error);
                return callback(error);
            }
        
            if (results.length === 0) {
                return callback(null, 0); // 결과가 없으면 0 반환
            }
            
            console.log('results[0].count', results[0].count);
            callback(null, results[0].count);
        });
    },

    getAuctionProducts: (userId, p_category, sortBy, offset, limit, callback) => {
        let sql = `
            SELECT P.*, U.U_POST_ADDRESS P_ADDRESS, I.PI_FILE P_IMAGE
            FROM TBL_PRODUCT P 
            JOIN TBL_USER U ON P.P_OWNER_ID = U.U_ID 
            JOIN TBL_PRODUCT_IMAGE I ON P.P_IMAGE_NO = I.PI_NO
            WHERE P_STATE = 4
        `;
        
        const state = [];
    
        if (userId) {
            sql += ' AND P.P_OWNER_ID != ?';
            state.push(userId);
        }

        // 카테고리 필터링
        if (p_category !== '0') {
            sql += ' AND P.P_CATEGORY = ?';
            state.push(p_category);
        }

        // 정렬 옵션
        if (sortBy === 'price_low') {
            sql += ' ORDER BY P_PRICE ASC';
        } else if (sortBy === 'price_high') {
            sql += ' ORDER BY P_PRICE DESC';
        } else {
            sql += ' ORDER BY P_MOD_DATE DESC';
        }

        sql += ' LIMIT ? OFFSET ?';
        state.push(limit, offset);
    
        DB.query(sql, state, callback);
    },
    

    getProductsCountByOwnerWithCategoryAndState: (ownerId, p_category, p_state, callback) => {
        const sql = `
            SELECT COUNT(*) AS count 
            FROM TBL_PRODUCT 
            WHERE P_OWNER_ID = ? 
            AND P_STATE > 0 
            ${p_category !== '0' ? 'AND P_CATEGORY = ?' : ''} 
            ${p_state !== '0' ? 'AND P_STATE = ?' : ''}`;
        
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
            FROM TBL_PRODUCT P
            JOIN TBL_PRODUCT_IMAGE I ON P_IMAGE_NO = PI_NO
            WHERE P_OWNER_ID = ? 
            AND P_STATE > 0 
            ${p_category !== '0' ? 'AND P_CATEGORY = ?' : ''} 
            ${p_state !== '0' ? 'AND P_STATE = ?' : ''} 
            ORDER BY P_NO DESC 
            LIMIT ? OFFSET ?`;
        
        const params = [ownerId];
        if (p_category !== '0') params.push(p_category);
        if (p_state !== '0') params.push(p_state);
        params.push(limit, offset);
        
        DB.query(sql, params, callback);
    },

    // 시세 조회 START
    /* 등록가
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
    },*/

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

    // 유사한 상품 조회 (검색어 기반 카테고리 또는 랜덤)
    getRelatedProductsByKeyword: (keyword, callback) => {
        if (keyword) {
            // 검색어가 있을 경우 해당 상품의 카테고리 가져오기
            const getCategorySql = `
                SELECT P_CATEGORY 
                FROM TBL_PRODUCT 
                WHERE P_NAME LIKE ? 
                LIMIT 1
            `;
            
            DB.query(getCategorySql, [`%${keyword}%`], (err, result) => {
                if (err) {
                    return callback(err, []);
                }
    
                if (result.length > 0) {
                    const category = result[0].P_CATEGORY;
                    // 같은 카테고리의 상품 4개를 랜덤으로 조회 + 이미지 정보도 가져오기
                    const getProductsByCategorySql = `
                        SELECT 
                            P.*, 
                            PI.PI_FILE 
                        FROM TBL_PRODUCT P
                        LEFT JOIN TBL_PRODUCT_IMAGE PI ON P.P_NO = PI.PI_P_NO
                        WHERE P.P_CATEGORY = ? 
                        ORDER BY RAND() 
                        LIMIT 4
                    `;
                    
                    DB.query(getProductsByCategorySql, [category], callback);
                } else {
                    callback(null, []);
                }
            });
        } else {
            // 검색어가 없으면 랜덤으로 4개의 상품 조회 + 이미지 정보도 가져오기
            const getRandomProductsSql = `
                SELECT 
                    P.*,  
                    PI.PI_FILE 
                FROM TBL_PRODUCT P
                LEFT JOIN TBL_PRODUCT_IMAGE PI ON P.P_NO = PI.PI_P_NO
                ORDER BY RAND() 
                LIMIT 4
            `;
            DB.query(getRandomProductsSql, [], callback);
        }
    },
    
    
    addWishlist: (wishData, callback) => {

        const sql = `
        INSERT INTO TBL_WISHLIST (
            W_USER_NO, 
            W_PRODUCT_NO)
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
        INSERT INTO TBL_REPORT (
            R_U_NO, 
            R_P_NO)
        VALUES (?, ?)
        `;
    const state = [
        reportData.r_u_no,
        reportData.r_p_no
        ];

    DB.query(sql, state, callback);
    },

    getProductPrice: (productNo, callback) => {
        const sql = `SELECT P_PRICE FROM TBL_PRODUCT WHERE P_NO = ?`;
        DB.query(sql, [productNo], callback);
    },

    joinAuction: (auctionData, callback) => {
        const sql = `
            UPDATE TBL_AUCTION SET 
                AU_BUYER_ID = ?, 
                AU_BUYER_NICK = ?, 
                AU_PRICE = ?, 
                AU_CNT = AU_CNT + 1, 
                AU_MOD_DATE = NOW()
            WHERE AU_PRODUCT_NO = ?
        `;
        const state = [
            auctionData.au_buyer_id,
            auctionData.au_buyer_nick,
            auctionData.au_price,
            auctionData.au_product_no,
        ];
        DB.query(sql, state, callback);
    },

    getProductsByIds: (productIds, callback) => {
        const sql = `
            SELECT P.*, PI.PI_FILE AS P_IMAGE
            FROM TBL_PRODUCT P 
            LEFT JOIN TBL_PRODUCT_IMAGE PI ON P.P_NO = PI.PI_P_NO
            WHERE P_NO IN (?)
        `;
        DB.query(sql, [productIds], callback); 
    },
};

module.exports = productModel;
                