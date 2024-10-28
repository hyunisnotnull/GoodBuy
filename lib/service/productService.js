const productModel = require('../model/productModel');
const { calculatePagination, parsePageNumber, getPaginationData } = require('../pagination/paginationUtils');

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

    addProductConfirm: (req, res) => {
        const body = req.body;
        const file_thum = req.file.filename;

        const productData = [
            body.u_id,
            body.u_nick,
            body.p_category,
            file_thum,
            body.p_name,
            body.p_desc,
            body.p_price,
            body.p_state,
        ];

        productModel.addProduct(productData, (error, result) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).json({ message: '상품 등록 중 오류가 발생했습니다.' });
            }
            res.status(200).json({ message: '상품이 성공적으로 등록되었습니다.' });
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
                const itemsPerPage = 1; // 한 페이지당 상품 수
    
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

                productModel.getProductById(req.query.p_no, (error, product) => {
                    if (error || product.length === 0) return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
                    res.render('product/modify_product_form', { loginedUser: req.user, product: product[0], category, result });
                });
            });
        });
    },

    modifyProductConfirm: (req, res) => {
        const p_file = req.file;
        const body = req.body;

        const productData = {
            p_category: body.p_category,
            p_name: body.p_name,
            p_desc: body.p_desc,
            p_price: body.p_price,
            p_state: body.p_state,
            p_no: body.p_no,
            image: p_file ? p_file.filename : null,
        };

        productModel.updateProduct(productData, (error, result) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).json({ message: '상품 수정 중 오류가 발생했습니다.' });
            }
            res.status(200).json({ message: '상품이 성공적으로 수정되었습니다.' });
        });
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
        productModel.changeProductState(p_no, p_state, (error, result) => {
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
        const sortBy = req.query.sort || 'latest';

        productModel.getAllCategories((error, category) => {
            if (error) return res.status(500).json({ message: '카테고리 조회 중 오류가 발생했습니다.' });

            productModel.getAllStates((error, result) => {
                if (error) return res.status(500).json({ message: '상태 조회 중 오류가 발생했습니다.' });

                productModel.getProductsForSale(req.user.U_ID, keyword, sortBy, (error, products) => {
                    if (error) return res.status(500).json({ message: '상품 조회 중 오류가 발생했습니다.' });
                    res.render('product/list_sale_product_form', { loginedUser: req.user, products, result, category, keyword });
                });
            });
        });
    },

    listAuctionProductForm: (req, res) => {
        productModel.getAllCategories((error, category) => {
            if (error) return res.status(500).json({ message: '카테고리 조회 중 오류가 발생했습니다.' });

            productModel.getAllStates((error, result) => {
                if (error) return res.status(500).json({ message: '상태 조회 중 오류가 발생했습니다.' });

                productModel.getAuctionProducts(req.user.U_ID, (error, products) => {
                    if (error) return res.status(500).json({ message: '경매 상품 조회 중 오류가 발생했습니다.' });
                    res.render('product/list_Auction_product_form', { loginedUser: req.user, products, result, category });
                });
            });
        });
    },

    detailProductForm: (req, res) => {
        productModel.getAllCategories((error, category) => {
            if (error) return res.status(500).json({ message: '카테고리 조회 중 오류가 발생했습니다.' });

            productModel.getAllStates((error, result) => {
                if (error) return res.status(500).json({ message: '상태 조회 중 오류가 발생했습니다.' });

                productModel.getProductById(req.query.p_no, (error, product) => {
                    if (error || product.length === 0) return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
                    res.render('product/detail_product_form', { loginedUser: req.user, product: product[0], category, result });
                });
            });
        });
    },

    /*
    filterCategoryProductConfirm: (req, res) => {
        const p_category = req.body.p_category;
    
        // 카테고리와 상태 가져오기
        productModel.getAllCategories((error, category) => {
            if (error) return res.status(500).json({ message: '카테고리 조회 중 오류가 발생했습니다.' });
    
            productModel.getAllStates((error, result) => {
                if (error) return res.status(500).json({ message: '상태 조회 중 오류가 발생했습니다.' });
    
                const pageQuery = req.query.page || 1;
                const currentPage = parsePageNumber(pageQuery);
                const itemsPerPage = 1; // 한 페이지당 상품 수
    
                // 전체 상품 수 가져오기
                productModel.getProductsCountByOwnerWithCategory(req.user.U_ID, p_category, (error, totalCount) => {
                    if (error || totalCount === undefined || totalCount === null) {
                        console.error(error);
                        return res.render('product/list_my_product_form', { loginedUser: req.user, products: [], pagination: {} });
                    }
    
                    const { totalPages, offset } = calculatePagination(totalCount, itemsPerPage, currentPage);
                    const paginationData = getPaginationData(currentPage, totalPages, '/product/list_my_product_form');
    
                    // 상품 가져오기
                    productModel.getProductsByOwnerWithCategory(req.user.U_ID, p_category, offset, itemsPerPage, (error, products) => {
                        if (error) {
                            console.error(error);
                            return res.render('product/list_my_product_form', { loginedUser: req.user, products: [], pagination: {} });
                        }
    
                        res.render('product/list_my_product_form', {
                            loginedUser: req.user,
                            products,
                            result,
                            category,
                            pagination: paginationData
                        });
                    });
                });
            });
        });
    },
    
    filterStateProductConfirm: (req, res) => {
        const p_state = req.body.p_state;
    
        // 카테고리와 상태 가져오기
        productModel.getAllCategories((error, category) => {
            if (error) return res.status(500).json({ message: '카테고리 조회 중 오류가 발생했습니다.' });
    
            productModel.getAllStates((error, result) => {
                if (error) return res.status(500).json({ message: '상태 조회 중 오류가 발생했습니다.' });
    
                const pageQuery = req.query.page || 1;
                const currentPage = parsePageNumber(pageQuery);
                const itemsPerPage = 1; // 한 페이지당 상품 수
    
                // 전체 상품 수 가져오기
                productModel.getProductsCountByOwnerWithState(req.user.U_ID, p_state, (error, totalCount) => {
                    if (error || totalCount === undefined || totalCount === null) {
                        console.error(error);
                        return res.render('product/list_my_product_form', { loginedUser: req.user, products: [], pagination: {} });
                    }
    
                    const { totalPages, offset } = calculatePagination(totalCount, itemsPerPage, currentPage);
                    const paginationData = getPaginationData(currentPage, totalPages, '/product/list_my_product_form');
    
                    // 상품 가져오기
                    productModel.getProductsByOwnerWithState(req.user.U_ID, p_state, offset, itemsPerPage, (error, products) => {
                        if (error) {
                            console.error(error);
                            return res.render('product/list_my_product_form', { loginedUser: req.user, products: [], pagination: {} });
                        }
    
                        res.render('product/list_my_product_form', {
                            loginedUser: req.user,
                            products,
                            result,
                            category,
                            pagination: paginationData
                        });
                    });
                });
            });
        });
    },
*/
    listSaleProductFormAny: (req, res) => {
        const keyword = req.query.keyword || '';
        const sortBy = req.query.sort || 'latest';
    
        productModel.getAllCategories((error, category) => {
            if (error) return res.status(500).json({ message: '카테고리 조회 중 오류가 발생했습니다.' });
    
            productModel.getAllStates((error, result) => {
                if (error) return res.status(500).json({ message: '상태 조회 중 오류가 발생했습니다.' });
    
                productModel.getProductsForSale(req.user ? req.user.U_ID : null, keyword, sortBy, (error, products) => {
                    if (error) return res.status(500).json({ message: '상품 조회 중 오류가 발생했습니다.' });
                    res.render('product/list_sale_product_form', { loginedUser: req.user, products, result, category, keyword });
                });
            });
        });
    }, 

    listAuctionProductFormAny: (req, res) => {
        productModel.getAllCategories((error, category) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).json({ message: '카테고리 조회 중 오류가 발생했습니다.' });
            }

            productModel.getAuctionProducts(req.user ? req.user.U_ID : null, (error, products) => {
                if (error) {
                    console.error('Database error:', error);
                    return res.status(500).json({ message: '경매 상품 조회 중 오류가 발생했습니다.' });
                }

                res.render('product/list_Auction_product_form', { loginedUser: req.user, products, category });
            });
        });
    },
    
};

module.exports = productService;
