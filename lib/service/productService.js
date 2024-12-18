const productModel = require('../model/productModel');
const request = require('request');
const { calculatePagination, parsePageNumber, getPaginationData } = require('../pagination/paginationUtils');
const { removeHtmlTagsAndEntities, isValidItemDescription } = require('../config/utils');
const { uploadImageToFlask } = require('../service/uploadService'); 

const productService = {
    addProductForm: (req, res) => {
        productModel.getAllCategories((error, category) => {
            if (error) {
                console.error('카테고리 조회 중 오류:', error);
                return res.status(500).json({ message: '카테고리 조회 중 오류가 발생했습니다.' });
            }
            res.render('product/add_product_form', { loginedUser: req.user, category });
        });
    },

    addProductConfirm: async (req, res) => {

        const body = req.body;

        const currentDate = new Date();

        // p_trade_date 처리
        let tradeDate = body.p_trade_date;
        if (body.p_state === '4') {
            tradeDate = tradeDate && tradeDate !== '' ? tradeDate : null; // 빈 문자열일 경우 null로 설정
            const auctionDate = new Date(tradeDate);
            const maxDate = new Date(currentDate);
            maxDate.setDate(currentDate.getDate() + 7); 

            if (auctionDate <= currentDate) {
                return res.status(400).json({
                    message: '경매 날짜는 현재 시간 이후여야 합니다.'
                });
            }

            if (auctionDate > maxDate) {
                return res.status(400).json({
                    message: '경매 날짜는 최대 7일 이내로 설정해야 합니다.'
                });
            }

        } else {
            tradeDate = null; // 경매가 아닐 경우 null로 설정
        }
        console.log('body.p_state:::',body.p_state);
        console.log('tradeDate:::',tradeDate);
        console.log('body:::',body);
        console.log('req.files:::',req.files);
        console.log('req.files.path:::',req.files.path);
        

        if (!isValidItemDescription(body.p_name) || !isValidItemDescription(body.p_desc)) {
            console.log('금지어가 포함된 상품명 또는 설명:', body.p_name, body.p_desc);
            return res.status(400).json({
                message: '상품 등록 실패: 상품명이나 설명에 금지어가 포함되어 있습니다.'
            });
        }

        // 이미지 필터링
        const imagePaths = req.files.map(file => file.path);  // 업로드된 이미지 경로
        console.log('imagePaths:::', imagePaths);
        try {
            const results = await Promise.all(imagePaths.map(async (imagePath) => {
                return await uploadImageToFlask(imagePath);  // 개별 이미지 경로 처리
            }));
    
            // 예측 결과 처리
            for (const result of results) {
                if (result.message && result.message.includes('유사하여 등록이 거부되었습니다')) {
                    return res.status(400).json({ message: result.message });
                }
            }

        } catch (error) {
            console.error('오류 발생:', error.message);
            return res.status(500).json({
                message: `${error.message}`
            });
        }

        const productData = [
            body.u_id,
            body.u_nick,
            body.p_category,
            body.p_name,
            body.p_desc,
            body.p_price,
            body.p_state,
            body.p_trade_date,
            tradeDate,
        ];

        console.log('productData :::', productData);

        productModel.addProduct(productData, (error, result) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).json({ message: '상품 등록 중 오류가 발생했습니다.' });
            }

            const p_no = result.insertId;
            const records = []
            let tempArray = [];
            for (let i = 0; i < req.files.length; i++) {
                tempArray.push(p_no);
                tempArray.push(req.files[i].filename);
                records.push(tempArray);
                tempArray = [];
            }
    

            productModel.addThums(records, (error, result) => {
                if (error) {
                    console.error('Database error:', error);
                    return res.status(500).json({ message: '상품 사진 등록 중 오류가 발생했습니다.' });
                }
                
                productModel.updateProductImageNo( result.insertId, p_no, (error, result) => {
                    if (error) {
                    console.error('Database error:', error);
                    return res.status(500).json({ message: '상품 사진 등록 중 오류가 발생했습니다.' });
                    }

                    res.status(200).json({ message: '상품이 성공적으로 등록되었습니다.' });
                });
                
            });
        });
    },

    listMyProductForm: (req, res) => {
        const currentCategory = req.query.category || '0'; // 현재 선택된 카테고리
        const currentState = req.query.state || '0'; // 현재 선택된 상태
    
        productModel.getAllCategories((error, category) => {
            if (error) return res.status(500).json({ message: '카테고리 조회 중 오류가 발생했습니다.' });
    
            productModel.getAllStates((error, result) => {
                if (error) return res.status(500).json({ message: '상태 조회 중 오류가 발생했습니다.' });
    
                const pageQuery = req.query.page || 1;
                const currentPage = parsePageNumber(pageQuery);
                const itemsPerPage = 5; // 한 페이지당 상품 수
    
                // 전체 상품 수 가져오기
                productModel.getProductsCountByOwnerWithCategoryAndState(req.user.U_ID, currentCategory, currentState, (error, totalCount) => {
                    if (error || totalCount === undefined || totalCount === null) {
                        console.error(error);
                        return res.render('product/list_my_product_form', { loginedUser: req.user, products: [], pagination: {} });
                    }
    
                    const { totalPages, offset } = calculatePagination(totalCount, itemsPerPage, currentPage);
                    const paginationData = getPaginationData(currentPage, totalPages, '/product/list_my_product_form');
    
                    // 전체 상품 가져오기
                    productModel.getProductsByOwnerWithCategoryAndState(req.user.U_ID, currentCategory, currentState, offset, itemsPerPage, (error, allProducts) => {
                        if (error) {
                            console.error(error);
                            return res.render('product/list_my_product_form', { loginedUser: req.user, products: [], pagination: {} });
                        }

                        console.log('allProducts', allProducts);
                        console.log('totalCount', totalCount);
                        console.log('paginationData', paginationData);
                        console.log('currentCategory', currentCategory);
                        console.log('currentState', currentState);
    
                        res.render('product/list_my_product_form', {
                            loginedUser: req.user,
                            products: allProducts,
                            result,
                            category,
                            currentCategory,
                            currentState,
                            pagination: paginationData
                        });
                    });
                });
            });
        });
    },
    

    modifyProductForm: (req, res) => {
        productModel.getAllCategories((error, category) => {
            if (error) return res.status(500).json({ message: '카테고리 조회 중 오류가 발생했습니다.' });

            productModel.getAllStates((error, result) => {
                if (error) return res.status(500).json({ message: '상태 조회 중 오류가 발생했습니다.' });

                productModel.getProductById(req.query.p_no, req.query.u_no, (error, product) => {
                    if (error || product.length === 0) return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
                    res.render('product/modify_product_form', { loginedUser: req.user, product: product[0], category, result });
                });
            });
        });
    },

    modifyProductConfirm: async (req, res) => {

        const p_file = req.files;
        const body = req.body;

        console.log('p_file ::', p_file);
        const currentDate = new Date();
        let tradeDate = body.p_trade_date;

        if (body.p_state === '4') {  // 경매인 경우
            // 경매 날짜가 현재 날짜보다 뒤이어야 하고, 최대 7일 후까지 가능
            const auctionDate = new Date(tradeDate);
            const maxDate = new Date(currentDate);
            maxDate.setDate(currentDate.getDate() + 7); // 7일 후
    
            // 경매 날짜가 현재 날짜보다 이전이면 에러 메시지
            if (auctionDate <= currentDate) {
                return res.status(400).json({
                    message: '경매 날짜는 현재 시간 이후여야 합니다.'
                });
            }
    
            // 경매 날짜가 최대 7일을 초과하면 에러 메시지
            if (auctionDate > maxDate) {
                return res.status(400).json({
                    message: '경매 날짜는 최대 7일 이내로 설정해야 합니다.'
                });
            }
        }

        if (!isValidItemDescription(body.p_name) || !isValidItemDescription(body.p_desc)) {
            console.log('금지어가 포함된 상품명 또는 설명:', body.p_name, body.p_desc);
            return res.status(400).json({
                message: '상품 수정 실패: 상품명이나 설명에 금지어가 포함되어 있습니다.'
            });
        }

        // 이미지 필터링
        if (p_file && p_file.length > 0) {

            const imagePaths = req.files.map(file => file.path);  // 업로드된 이미지 경로
            console.log('imagePaths:::', imagePaths);
            try {
                const results = await Promise.all(imagePaths.map(async (imagePath) => {
                    return await uploadImageToFlask(imagePath);  // 개별 이미지 경로 처리
                }));
        
                // 예측 결과 처리
                for (const result of results) {
                    if (result.message && result.message.includes('유사하여 등록이 거부되었습니다')) {
                        return res.status(400).json({ message: result.message });
                    }
                }

            } catch (error) {
                console.error('오류 발생:', error.message);
                return res.status(500).json({
                    message: `${error.message}`
                });
            }
        
            const p_no = body.p_no;

            productModel.deleteProductImages(p_no, (error, result) => {
                if (error) {
                    console.error('Database error:', error);
                    return res.status(500).json({ message: '상품 이미지 삭제 중 오류가 발생했습니다.' });
                }

                const records = []
                let tempArray = [];
                for (let i = 0; i < req.files.length; i++) {
                    tempArray.push(p_no);
                    tempArray.push(req.files[i].filename);
                    records.push(tempArray);
                    tempArray = [];
                }

                console.log('records to insert:', records);

                productModel.addThums(records, (error, result) => {
                    if (error) {
                        console.error('Database error:', error);
                        return res.status(500).json({ message: '새로운 상품 사진 등록 중 오류가 발생했습니다.' });
                    }

                    const productData = {
                        p_category: body.p_category,
                        p_name: body.p_name,
                        p_desc: body.p_desc,
                        p_price: body.p_price,
                        p_state: body.p_state,
                        p_image_no: result.insertId,
                        p_no: body.p_no,
                        p_trade_date: body.p_trade_date,
                    };
            
                    productModel.updateProduct(productData, (error, result) => {
                        if (error) {
                            console.error('Database error:', error);
                            return res.status(500).json({ message: '상품 수정 중 오류가 발생했습니다.' });
                        }
                        res.status(200).json({ message: '상품이 성공적으로 수정되었습니다.' });
                    });

                }); 
            }); 
        } else {
            const productData = {
                p_category: body.p_category,
                p_name: body.p_name,
                p_desc: body.p_desc,
                p_price: body.p_price,
                p_state: body.p_state,
                p_image_no: body.p_image_no,
                p_no: body.p_no,
                p_trade_date: body.p_state === '3' ? undefined : body.p_trade_date,
            };

    
            productModel.updateProduct(productData, (error, result) => {
                if (error) {
                    console.error('Database error:', error);
                    return res.status(500).json({ message: '상품 수정 중 오류가 발생했습니다.' });
                }
                res.status(200).json({ message: '상품이 성공적으로 수정되었습니다.' });
            });

        }

    },

    deleteProductConfirm: (req, res) => {
        const p_no = req.body.p_no;
        productModel.deleteProduct(p_no, (error, result) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).json({ message: '상품 삭제 중 오류가 발생했습니다.' });
            }
            res.json(result);
        });
    },

    changeStateProductConfirm: (req, res) => {
        const p_no = req.body.p_no;
        const p_state = req.body.p_state;
        const p_trade_date = req.body?.p_trade_date;
        productModel.changeProductState(p_no, p_state, p_trade_date, (error, result) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).json({ message: '상태 변경 중 오류가 발생했습니다.' });
            }
            res.json(result);
        });
    },

    changeCategoryProductConfirm: (req, res) => {
        const p_no = req.body.p_no;
        const p_category = req.body.p_category;
        productModel.changeProductCategory(p_no, p_category, (error, result) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).json({ message: '카테고리 변경 중 오류가 발생했습니다.' });
            }
            res.json(result);
        });
    },

    listSaleProductForm: (req, res) => {
        const keyword = req.query.keyword || '';
        const sortBy = req.query.sort || '';
        const currentCategory = req.query.category || '0';
        const userId = req.user ? req.user.U_ID : null;
    
        productModel.getAllCategories((error, category) => {
            if (error) return res.status(500).json({ message: '카테고리 조회 중 오류가 발생했습니다.' });
    
            productModel.getAllStates((error, result) => {
                if (error) return res.status(500).json({ message: '상태 조회 중 오류가 발생했습니다.' });
    
                const pageQuery = req.query.page || 1;
                const currentPage = parsePageNumber(pageQuery);
                const itemsPerPage = 8; // 한 페이지당 상품 수
    
                // 전체 상품 수 가져오기
                productModel.getProductsForSaleCount(userId, currentCategory, keyword, (error, totalCount) => {
                    if (error) return res.status(500).json({ message: '상품 수 조회 중 오류가 발생했습니다.' });
    
                    const { totalPages, offset } = calculatePagination(totalCount, itemsPerPage, currentPage);
                    const paginationData = getPaginationData(currentPage, totalPages, '/product/list_sale_product_form');
    
                    // 상품 가져오기
                    productModel.getProductsForSale(userId, currentCategory, keyword, sortBy, offset, itemsPerPage, (error, products) => {
                        if (error) return res.status(500).json({ message: '상품 조회 중 오류가 발생했습니다.' });

                        console.log('sortBy', sortBy);
                        console.log('totalPages', totalPages);
                        console.log('category', category);
                        console.log('keyword', keyword);
                        console.log('paginationData', paginationData);
                        console.log('currentCategory', currentCategory);
                        console.log('totalCount', totalCount);
    
                        res.render('product/list_sale_product_form', {
                            loginedUser: req.user,
                            products,
                            result,
                            category,
                            keyword,
                            pagination: paginationData,
                            currentCategory,
                            totalCount ,
                            sortBy
                        });
                    });
                });
            });
        });
    },

    listAuctionProductForm: (req, res) => {
        const sortBy = req.query.sort || '';     
        const currentCategory = req.query.category || '0';
        const userId = req.user ? req.user.U_ID : null;

        productModel.getAllCategories((error, category) => {
            if (error) return res.status(500).json({ message: '카테고리 조회 중 오류가 발생했습니다.' });

            productModel.getAllStates((error, result) => {
                if (error) return res.status(500).json({ message: '상태 조회 중 오류가 발생했습니다.' });

                const pageQuery = req.query.page || 1;
                const currentPage = parsePageNumber(pageQuery);
                console.log("Current Page:", currentPage);
                const itemsPerPage = 8; // 한 페이지당 상품 수

                productModel.getProductsForAuctionCount(userId, currentCategory, (error, totalCount) => {
                    if (error) return res.status(500).json({ message: '상품 수 조회 중 오류가 발생했습니다.' });

                    console.log("Total Count:", totalCount);
    
                    const { totalPages, offset } = calculatePagination(totalCount, itemsPerPage, currentPage);
                    const paginationData = getPaginationData(currentPage, totalPages, '/product/list_auction_product_form');

                    console.log(paginationData);
                    console.log(totalPages);
                    console.log(offset);

                    productModel.getAuctionProducts(userId, currentCategory, sortBy, offset, itemsPerPage, (error, products) => {
                        console.log(error);
                        if (error) return res.status(500).json({ message: '경매 상품 조회 중 오류가 발생했습니다.' });

                        // 경매 마감일 계산
                        const currentTime = new Date();  

                         // 각 상품의 경매 종료 시간 계산
                        products = products.map(product => {
                            const auctionEndTime = new Date(product.P_TRADE_DATE);  
                            const remainingTime = auctionEndTime - currentTime;  

                            if (remainingTime <= 0) {
                                product.remainingTime = 0;
                                product.timeLeft = '경매 종료';
                            } else {
                                // 경매가 남아있다면, 남은 시간을 일, 시간, 분으로 나누어 계산
                                const remainingMinutes = Math.floor(remainingTime / 1000 / 60);
                                const remainingDays = Math.floor(remainingMinutes / 1440); 
                                const remainingHours = Math.floor((remainingMinutes % 1440) / 60); 
                                const remainingMinutesOnly = remainingMinutes % 60; 

                                // "X일 X시간 X분 전" 형식으로 계산
                                product.remainingTime = remainingTime;
                                // 일수와 시간이 0일 경우에는 해당 항목을 생략
                                    if (remainingDays > 0 && remainingHours > 0) {
                                        product.timeLeft = `${remainingDays}일 ${remainingHours}시간 ${remainingMinutesOnly}분 전`;
                                    } else if (remainingDays > 0) {
                                        product.timeLeft = `${remainingDays}일 ${remainingMinutesOnly}분 전`;
                                    } else if (remainingHours > 0) {
                                        product.timeLeft = `${remainingHours}시간 ${remainingMinutesOnly}분 전`;
                                    } else {
                                        product.timeLeft = `${remainingMinutesOnly}분 전`;
                                    }
                                }

                            return product;
                        });

                        res.render('product/list_Auction_product_form', { 
                            loginedUser: req.user, 
                            products, 
                            result, 
                            category,
                            pagination: paginationData,
                            currentCategory,
                            totalCount,
                            sortBy,
                            keyword: [],
                        });
                    });
                });
            });
        });
    },

    getAuctionProducts: (userId, p_category, sortBy, offset, limit, callback) => {
        // 모델에서 상품 목록 가져오기
        productModel.getAuctionProducts(userId, p_category, sortBy, offset, limit, (error, products) => {
            if (error) return callback(error);
    
            const currentTime = new Date();  // 현재 시간을 가져오기
    
            // 각 상품의 경매 종료 시간 계산
            products = products.map(product => {
                const auctionEndTime = new Date(product.P_TRADE_DATE);  // 경매 종료 시간
                const remainingTime = auctionEndTime - currentTime;  // 남은 시간 계산 (ms 단위)
    
                // 경매 종료까지 남은 시간 (분 단위로 계산)
                product.remainingTime = remainingTime > 0 ? remainingTime : 0;  // 경매 종료된 상품은 0으로 설정
                product.remainingMinutes = Math.floor(product.remainingTime / 1000 / 60);  // 분 단위로 변환
    
                return product;  // 수정된 상품 객체 반환
            });
    
            callback(null, products);  // 수정된 상품 목록을 콜백으로 반환
        });
    },

    getProductImages: (req, res) => {
        productModel.getProductImages(req.body.pi_p_no, (error, images) => {
            if (error || images.length === 0) return res.status(404).json({ message: '이미지를 찾을 수 없습니다.' });
                res.json(images);
            });
    },

    detailProductForm: (req, res) => {
        
        productModel.getAllCategories((error, category) => {
            if (error) return res.status(500).json({ message: '카테고리 조회 중 오류가 발생했습니다.' });

            productModel.getAllStates((error, result) => {
                if (error) return res.status(500).json({ message: '상태 조회 중 오류가 발생했습니다.' });

                productModel.getProductById(req.query.p_no, req.query.u_no, (error, product) => {
                  
                    if (error || product.length === 0) return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });

                    console.log(product)
                    res.render('product/detail_product_form', { loginedUser: req.user, product: product, category, result });
                });
            });
        });
    },

    // 브라우저 세션용
    getProduct: (req, res) => {
        const { productId } = req.body; 

        const recentProducts = req.session.recentProducts || [];
        console.log('recentProducts:', recentProducts);

        // 상품 ID에 해당하는 상품 정보 조회
        productModel.getProductsByIds([productId], (error, products) => {
            if (error) {
                console.error('상품 정보 조회 실패:', error);
                return res.status(500).send('서버 오류');
            }

            if (products && products.length > 0) {


                const product = products[0];
                const productName = product.P_NAME;
                const productImage = product.P_IMAGE;
                const productOwnerId = product.P_OWNER_ID;
                const productPrice = product.P_PRICE;

                // 최근 본 상품에 추가
                if (!recentProducts.some(p => p.productId === productId)) {
                    recentProducts.push({
                        productId,
                        productName,
                        productImage,
                        productOwnerId,
                        productPrice
                    });

                    // 최대 5개의 최근 본 상품만 저장
                    if (recentProducts.length > 5) {
                        recentProducts.shift(); // 가장 오래된 상품을 삭제
                    }

                    // 세션에 저장
                    req.session.recentProducts = recentProducts;
                }

                console.log('recentProducts',recentProducts);

                // 상품 정보 응답
                return res.json({
                    message: '최근 본 상품이 추가되었습니다.',
                    products: recentProducts
                });
            } else {
                return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
            }
        });
    },

    // 시세 조회 START
    // 시세 조회 처리
    searchRateList: (req, res, relatedProducts) => {
        const keyword = req.query.keyword || '';
        const searchType = req.query.searchType || 'price'; // 기본값 설정

        // 등록가 시세 조회 
        productModel.getMonthlyRegisteredPricesByKeyword(keyword, (error, registeredPrices) => {
            if (error) {
                console.error('등록가 시세 조회 중 오류:', error);
                return res.status(500).json({ message: '등록가 시세 조회 중 오류가 발생했습니다.' });
            }

            // 판매가 시세 조회
            productModel.getMonthlySalePricesByKeyword(keyword, (error, salePrices) => {
                if (error) {
                    console.error('판매가 시세 조회 중 오류:', error);
                    return res.status(500).json({ message: '판매가 시세 조회 중 오류가 발생했습니다.' });
                }

                const averageRegisteredPrice = registeredPrices.length > 0 ? 
                    registeredPrices.reduce((sum, price) => sum + parseInt(price.averagePrice), 0) / registeredPrices.length : 0;

                const averageSalePrice = salePrices.length > 0 ? 
                    salePrices.reduce((sum, price) => sum + parseInt(price.averagePrice), 0) / salePrices.length : 0;

                // 관련 상품과 함께 렌더링
                res.render('product/list_rate_product_form', {
                    loginedUser: req.user,
                    keyword,
                    salePrices,
                    registeredPrices,
                    averageSalePrice,
                    averageRegisteredPrice,
                    relatedProducts,  // 유사 상품 데이터 추가
                    searchType // searchType을 여기서 전달
                });
            });
        });
    },
        
    // 네이버 쇼핑 START
    searchShopping: (req, res) => {
        const query = req.query.keyword; // 검색어를 keyword로 변경
        const searchType = 'shopping'; // searchType 설정
    
        // Naver Shop API 호출을 위한 URL 생성
        const api_url = `https://openapi.naver.com/v1/search/shop?query=${encodeURI(query)}`;
        const options = {
            url: api_url,
            headers: {
                'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
                'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
            }
        };
    
        // API 호출
        request.get(options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const shoppingResults = JSON.parse(body).items; // 결과를 JSON으로 파싱

                // 검색 결과에서 HTML 태그와 엔티티 제거
                const cleanedResults = shoppingResults.map(item => ({
                    ...item,
                    title: removeHtmlTagsAndEntities(item.title), // title에서 HTML 태그와 엔티티 제거
                }));

                console.log('cleanedResults:::', cleanedResults);
    
                res.render('product/list_rate_product_form', {
                    loginedUser: req.user,
                    keyword: query,
                    shoppingResults : cleanedResults, 
                    registeredPrices: [], // 기본값 설정
                    salePrices: [],
                    searchType,
                    relatedProducts: [], // 기본값 설정
                });
            } else {
                console.error(`API 호출 중 에러 발생: ${response.statusCode}`, error);
                res.status(response.statusCode).json({ message: 'Internal Server Error' });
            }
        });
    },

    // 유사한 상품 조회 (검색어 기반 또는 랜덤)
    searchRelatedProducts: (keyword, callback) => {
        productModel.getRelatedProductsByKeyword(keyword, (err, relatedProducts) => {
            if (err) {
                console.error('유사 상품 조회 중 오류:', err);
                return callback(err, []);
            }
            callback(null, relatedProducts);
        });
    },
    
    addWishlistConfirm: (req, res) => {
        const body = req.body;
        const wishData = {
            w_user_no : body.w_user_no,
            w_product_no : body.w_product_no,
        };

        productModel.addWishlist(wishData, (error, result) => {
            if (error) {
                console.error('Database error:', error);
                if(error.sqlMessage){
                    return res.status(400).json({ message: error.sqlMessage });
                }
                return res.status(500).json({ message: '찜 등록 중 오류가 발생했습니다.' });
            }
            res.status(200).json({ message: '찜 등록이 성공적으로 완료되었습니다.' });
        });

    },
        
    addReportConfirm: (req, res) => {
        const body = req.body;
        const reportData = {
            r_u_no : body.user_no,
            r_p_no : body.product_no,
        };

        productModel.addReport(reportData, (error, result) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).json({ message: '신고 등록 중 오류가 발생했습니다.' });
            }
            res.status(200).json({ message: '신고 등록이 성공적으로 완료되었습니다.' });
        });

    },

    joinAuctionConfirm: (req, res) => {
        const body = req.body;
    
        const auctionData = {
            au_product_no: body.au_product_no,
            au_buyer_id: body.au_buyer_id,
            au_buyer_nick: body.au_buyer_nick,
            au_price: body.au_price,
        };
    
        // 1. 현재 가격 가져오기
        productModel.getProductPrice(auctionData.au_product_no, (error, result) => {
            if (error) {
                console.error('Error fetching product price:', error);
                return res.status(500).json({ message: '가격 확인 중 오류가 발생했습니다.' });
            }
    
            if (result.length === 0) {
                return res.status(404).json({ message: '해당 상품을 찾을 수 없습니다.' });
            }
    
            const currentPrice = result[0].P_PRICE;
    
            // 2. 입찰 가격이 현재 가격보다 낮으면 에러 처리
            if (auctionData.au_price < currentPrice) {
                console.log('HI');
                return res.status(400).json({ message: `입찰 금액은 현재 가격(${currentPrice.toLocaleString()}원)보다 높아야 합니다.` });
            }
    
            // 3. 입찰 처리
            productModel.joinAuction(auctionData, (error, result) => {
                if (error) {
                    console.error('Database error:', error);
                    return res.status(500).json({ message: '입찰 등록 중 오류가 발생했습니다.' });
                }
    
                res.status(200).json({ message: '입찰이 성공적으로 등록되었습니다.' });
            });
        });
    },
    

};

module.exports = productService;
