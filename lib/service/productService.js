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
        res.send(body);
        let sql = `
                insert into tbl_product (p_owner_id, p_owner_nick, p_category, p_image, p_name, p_desc, p_price, p_state) 
                values (?, ?, ?, ?, ?, ?, ?, ?)`;
        let state = [body.u_id, body.u_nick, body.p_category, file_thum, body.p_name, body.p_desc, body.p_price, body.p_state];
        DB.query(
            sql,
            state,
            (error, result) => {
                if (result) {
                    res.send('product/add_product_ok')
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
                        (error, state) => {
                            if (state) {

                                let sql = `select * from tbl_product where p_owner_id=? order by p_no desc`;
                                let state = [req.user.U_ID];
                                DB.query(
                                    sql,
                                    state,
                                    (error, products) => {
                                        if (error) res.send(error);
                                        if (products.length > 0) {
                                            res.render('product/list_product_form',{loginedUser: req.user, products,state, category});
                                        } else {
                                            res.render('/',{loginedUser: req.user});
                                        }
                                    }
                        
                                );

                            }
                        }
                    )

                }

            }
        );

    },
    removeProductConfirm: (req, res) => {},


}

module.exports = productService;