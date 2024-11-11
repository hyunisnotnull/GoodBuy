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
}

module.exports = homeService;
