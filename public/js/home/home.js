// let sale_product = [];
// let auction_product = [];
// let disp_count = 5;


// $( document ).ready(function() {
//     console.log( "ready!" );



//     // listSaleProduct();
//     // listAuctionProduct();




// });

// const listSaleProduct = () => {

//     let msgDto = {
//         count: disp_count,
//     }

//     $.ajax({
        
//         url: '/home/get_sale_product',
//         method: 'GET',
//         data: msgDto,
//         dataType: 'json',
//         async: false,
//         success: function(data) {
//             console.log('getSaleProduct() COMMUNICATION SUCCESS!!');
            
//             if(data.sales.length >= 0) {
//                 sale_product = data.sales;
//                 render_sale_product();
//             }

//         },
//         error: function() {
//             console.log('getSaleProduct() COMMUNICATION ERROR!!');
            
//         },
//         complete: function() {
//             console.log('getSaleProduct() COMMUNICATION COMPLETE!!');
    

//         }

//     });

// }

// const listAuctionProduct = () => {

//     let msgDto = {
//         count: disp_count,
//     }

//     $.ajax({
        
//         url: '/home/get_auction_product',
//         method: 'GET',
//         data: msgDto,
//         dataType: 'json',
//         async: false,
//         success: function(data) {
//             console.log('getAuctionProduct() COMMUNICATION SUCCESS!!');
            
//             if(data.auctions.length >= 0) {
//                 auction_product = data.auctions;
//                 render_auction_product();
//             }

//         },
//         error: function() {
//             console.log('getAuctionProduct() COMMUNICATION ERROR!!');
            
//         },
//         complete: function() {
//             console.log('getAuctionProduct() COMMUNICATION COMPLETE!!');
    

//         }

//     });
// }

// // const render_sale_product = ()=> {
// //     console.log('render_sale_product()')
// //     let append='';
// //     for (let i = 0; i < sale_product.length; i++){
// //         append += `
// //         <div class="box">
// //             <img src="\\${sale_product[i].P_OWNER_ID}\\${sale_product[i].P_IMAGE}">
// //             <div class="name">${sale_product[i].P_NAME}</div>
// //             <div class="price">${sale_product[i].P_PRICE.toLocaleString()}원</div>
// //             <div class="address">${ /(?<=\().*(?=\))/.exec(sale_product[i].P_ADDRESS)} ${ sale_product[i].P_MOD_DATE.substring(5,16).replace('-','/').replace('T',' ') }</div>
// //             </div>
// //         </div>`
// //     }
// //     $('.sale_box').append(append);

// // };

// // const render_auction_product = ()=> {
// //     console.log('render_auction_product()')
// //     let append='';
// //     for (let i = 0; i < auction_product.length; i++){
// //         append += `
// //         <div class="box">
// //             <img src="\\${auction_product[i].P_OWNER_ID}\\${auction_product[i].P_IMAGE}">
// //             <div class="name">${auction_product[i].P_NAME}</div>
// //             <div class="price">${auction_product[i].P_PRICE.toLocaleString()}원</div>
// //             <div class="address">${ /(?<=\().*(?=\))/.exec(auction_product[i].P_ADDRESS)} ${ auction_product[i].P_MOD_DATE.substring(5,16).replace('-','/').replace('T',' ') }</div>
// //             </div>
// //         </div>`
// //     }
// //     $('.auction_box').append(append);

// // };