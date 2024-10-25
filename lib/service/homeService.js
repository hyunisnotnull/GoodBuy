const DB = require('../db/db.js');
const fs = require('fs');

const homeService = {

    home: (req, res) => {
        res.render('home/home', {loginedUser: req.user});

    },
    
    getSaleProduct: (req, res) => {
        let page = req.query.page;
        let count = req.query.count;
        let start = count * page;
        DB.query(
            'select count(*) p_count from tbl_product where p_state=4',
            (error, result) => {
                
                DB.query(
                    `select p.*, u.u_post_address as P_ADDRESS  from tbl_product p join tbl_user u where p.p_owner_id = u.u_id and p_state=4 order by p_mod_date desc limit ${start}, ${count} `,
                    (error, sales) => {
                        res.json({sales, result: result[0].p_count})
        
                    }
                );
            })

    },
}

module.exports = homeService;