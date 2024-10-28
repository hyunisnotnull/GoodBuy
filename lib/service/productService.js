const DB = require('../db/db.js');
const fs = require('fs');

const productService = {

    addProductForm: (req, res) => {

        DB.query(
            `select * from tbl_category`,
            (error, category) => {
                res.render('product/add_product_form',{loginedUser: req.user, category});
            }
        );

    },

    addProductConfirm: (req, res) => {

        let body = req.body;
        let file_thum = req.file.filename;

        console.log (body);

        let sql = `
                insert into tbl_product (p_owner_id, p_owner_nick, p_category, p_image, p_name, p_desc, p_price, p_state) 
                values (?, ?, ?, ?, ?, ?, ?, ?)`;
        let state = [body.u_id, body.u_nick, body.p_category, file_thum, body.p_name, body.p_desc, body.p_price, body.p_state];
        DB.query(
            sql,
            state,
            (error, result) => {
                if (result) {
                    res.render('product/add_product_ok')
                } else {
                    res.render('product/add_product_ng')
                }
            }
        );
    },  
    
    listMyProductForm: (req, res) => {     

        DB.query(
            'select * from tbl_category',
            (error, category) => {
                if (category)
                {
                    DB.query(
                        'select * from tbl_state',
                        (error, result) => {
                            if (result) {

                                let sql = `select * from tbl_product order by p_no desc`;
                                DB.query(
                                    sql,
                                    (error, products) => {
                                            res.render('product/list_my_product_form',{loginedUser: req.user, products, result, category});

                                    }
                        
                                );

                            }
                        }
                    )

                }

            }
        );

    },

    modifyProductForm: (req, res) => {
        DB.query(
            `select * from tbl_category`,
            (error, category) => {
                DB.query(
                    `select * from tbl_state`,
                    (error, result) => {
                        DB.query(
                            `select * from tbl_product where p_no=${req.query.p_no}`,
                            (error, product) => {
                                if (product.length > 0) {
                                    res.render('product/modify_product_form', {loginedUser: req.user, product: product[0], category, result});
                                } 
                            }
                        );
                    }

                );
            }
        );
    },

    modifyProductConfirm: (req, res) => {
        let p_file = req.file;
        let body = req.body;
        console.log(body)
        console.log(p_file)
        let sql = `update tbl_product set p_category=?, p_name=?, p_desc=?, p_price=?, p_state=?, p_mod_date = now()
                     ${!!p_file ? ', p_image=?' : ''} where p_no=?`;
        let state = [body.p_category, body.p_name, body.p_desc, body.p_price, body.p_state, body.p_no];
        if(!!p_file )  state.splice( 5,0, p_file.filename);

        DB.query(
            sql,
            state,
            (error, result) => {
                if(result) {

                    res.render('product/modify_product_ok')
                } else {
                    res.render('product/modify_product_ng')

                }
            }
        )
    
    },

    deleteProductConfirm: (req, res) => {
        let p_no = req.body.p_no
        DB.query(
             `update tbl_product set p_state=0 where p_no=${p_no}`,
             (error, result) => {
                 if (result) {

                    res.json(result)
                } 
            }
        );

    },

    changeStateProductConfirm: (req, res) => {
        let p_no = req.body.p_no
        let p_state = req.body.p_state
        DB.query(
             `update tbl_product set p_state=${p_state} where p_no=${p_no}`,
             (error, result) => {
                 if (result) {

                    res.json(result)
                } 
            }
        );

    },

    changeCategoryProductConfirm: (req, res) => {
        let p_no = req.body.p_no
        let p_category = req.body.p_category
        DB.query(
             `update tbl_product set p_category=${p_category} where p_no=${p_no}`,
             (error, result) => {
                 if (result) {

                    res.json(result)
                } 
            }
        );

    },

    listSaleProductForm: (req, res) => {     
        DB.query(
            'select * from tbl_category',
            (error, category) => {
                if (category)
                {
                    DB.query(
                        'select * from tbl_state',
                        (error, result) => {
                            if (error) console.log(error)
                            if (result) {
                                let sql = `select p.*, u.u_post_address P_ADDRESS from tbl_product p join tbl_user u on p.p_owner_id = u.u_id where p_state = 3 and not p_owner_id = ? order by p_no desc`;
                                let state = [req.user.U_ID];
                                DB.query(
                                    sql,
                                    state,
                                    (error, products) => {
                                            res.render('product/list_sale_product_form',{loginedUser: req.user, products, result, category});

                                    }
                        
                                );

                            }
                        }
                    )

                }

            }
        );

    },

    listAuctionProductForm: (req, res) => {     

        DB.query(
            'select * from tbl_category',
            (error, category) => {
                if (category)
                {
                    DB.query(
                        'select * from tbl_state',
                        (error, result) => {
                            if (error) console.log(error)
                            if (result) {
                                
                                let sql = `select p.*, u.u_post_address P_ADDRESS from tbl_product p join tbl_user u on p.p_owner_id = u.u_id where p_state = 4 and not p_owner_id = ? order by p_no desc`;
                                let state = [req.user.U_ID];
                                DB.query(
                                    sql,
                                    state,
                                    (error, products) => {                           
                                            res.render('product/list_Auction_product_form',{loginedUser: req.user, products, result, category});

                                    }
                        
                                );

                            }
                        }
                    )

                }

            }
        );

    },

    detailProductForm: (req, res) => {
        DB.query(
            `select * from tbl_category`,
            (error, category) => {
                DB.query(
                    `select * from tbl_state`,
                    (error, result) => {
                        DB.query(
                            `select * from tbl_product where p_no=${req.query.p_no}`,
                            (error, product) => {
                                if (product.length > 0) {
                                    res.render('product/detail_product_form', {loginedUser: req.user, product: product[0], category, result});
                                } 
                            }
                        );
                    }

                );
            }
        );
    },

    filterCategoryProductConfirm:  (req, res) => {
        DB.query(
            'select * from tbl_category',
            (error, category) => {
                if (category)
                {
                    DB.query(
                        'select * from tbl_state',
                        (error, result) => {
                            if (error) console.log(error)
                            if (result) {
                                
                                let sql = `select * from tbl_product where p_owner_id=? ${ req.body.p_category !== '0' ? 'and p_category=?':'' } and p_state > 0 order by p_no desc`;
                                let state = [req.user.U_ID];
                                if (req.body.p_category !== '0' ) state.push(req.body.p_category)

                                DB.query(
                                    sql,
                                    state,
                                    (error, products) => {
                                            res.render('product/list_my_product_form',{loginedUser: req.user, products, result, category});

                                    }
                        
                                );

                            }
                        }
                    )

                }

            }
        );
    },

    filterStateProductConfirm:  (req, res) => {
        DB.query(
            'select * from tbl_category',
            (error, category) => {
                if (category)
                {
                    DB.query(
                        'select * from tbl_state',
                        (error, result) => {
                            if (error) console.log(error)
                            if (result) {
                                
                                let sql = `select * from tbl_product where p_owner_id=? ${ req.body.p_state !== '0' ? 'and p_state=?':'and p_state > 0' } order by p_no desc`;
                                let state = [req.user.U_ID];
                                if (req.body.p_state !== '0' ) state.push(req.body.p_state)
                                
                                DB.query(
                                    sql,
                                    state,
                                    (error, products) => {
                                            res.render('product/list_my_product_form',{loginedUser: req.user, products, result, category});

                                    }
                        
                                );

                            }
                        }
                    )

                }

            }
        );
    },

    listSaleProductFormAny: (req, res) => {     

        DB.query(
            'select * from tbl_category',
            (error, category) => {
                if (category)
                {
                    DB.query(
                        'select * from tbl_state',
                        (error, result) => {
                            if (error) console.log(error)
                            if (result) {
                                let sql = `select p.*, u.u_post_address P_ADDRESS from tbl_product p join tbl_user u on p.p_owner_id = u.u_id where p_state = 3 order by p_no desc`;
                                DB.query(
                                    sql,
                                    (error, products) => {
                                            res.render('product/list_sale_product_form',{loginedUser: req.user, products, result, category});

                                    }
                        
                                );

                            }
                        }
                    )

                }

            }
        );

    },

    listAuctionProductFormAny: (req, res) => {     

        DB.query(
            'select * from tbl_category',
            (error, category) => {
                if (category)
                {
                    DB.query(
                        'select * from tbl_state',
                        (error, result) => {
                            if (error) console.log(error)
                            if (result) {
                                
                                let sql = `select p.*, u.u_post_address P_ADDRESS from tbl_product p join tbl_user u on p.p_owner_id = u.u_id where p_state = 4 order by p_no desc`;
                                DB.query(
                                    sql,
                                    (error, products) => {                           
                                            res.render('product/list_Auction_product_form',{loginedUser: req.user, products, result, category});

                                    }
                        
                                );

                            }
                        }
                    )

                }

            }
        );

    },

}

module.exports = productService;



