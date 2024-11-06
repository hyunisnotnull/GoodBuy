const DB = require('../db/db.js');
const fs = require('fs');
const homeModel = require('../model/homeModel');

const homeService = {
    home: (req, res) => {
        // 이벤트 데이터 가져오기
        homeModel.getEvents((error, events) => {
            if (error) {
                console.error(error);
                events = []; 
            }

            // 경매 데이터 가져오기
            homeModel.getAuctions((error, auctions) => {
                if (error) {
                    console.error(error);
                    auctions = []; 
                }

                // 상품 데이터 가져오기
                homeModel.getProducts((error, products) => {
                    if (error) {
                        console.error(error);
                        products = []; 
                    }

                    res.render('home/home', {
                        loginedUser: req.user,
                        events: events,
                        auctions: auctions,
                        products: products
                    });
                });
            });
        });
    },
    /*
    getSaleProduct: (req, res) => {
        let count = req.query.count;
        let start = 0;
        DB.query(
            'select count(*) p_count from tbl_product where p_state=3',
            (error, result) => {
                
                DB.query(
                    `select p.*, u.u_post_address as P_ADDRESS  from tbl_product p join tbl_user u where p.p_owner_id = u.u_id and p_state=3 order by p_mod_date desc limit ${start}, ${count} `,
                    (error, sales) => {
                        res.json({sales, result: result[0].p_count})
        
                    }
                );
            })

    },

    getAuctionProduct: (req, res) => {
        let count = req.query.count;
        let start = 0;
        DB.query(
            'select count(*) p_count from tbl_product where p_state=4',
            (error, result) => {
                
                DB.query(
                    `select p.*, u.u_post_address as P_ADDRESS  from tbl_product p join tbl_user u where p.p_owner_id = u.u_id and p_state=4 order by p_mod_date desc limit ${start}, ${count} `,
                    (error, auctions) => {
                        res.json({auctions, result: result[0].p_count})
        
                    }
                );
            })

    },
    */
}

module.exports = homeService;
