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
    
    listProductForm: (req, res) => {     

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
                                
                                let sql = `select * from tbl_product where p_owner_id=? and p_state > 0 order by p_no desc`;
                                let state = [req.user.U_ID];
                                DB.query(
                                    sql,
                                    state,
                                    (error, products) => {
                                            res.render('product/list_product_form',{loginedUser: req.user, products, result, category});

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

}

module.exports = productService;