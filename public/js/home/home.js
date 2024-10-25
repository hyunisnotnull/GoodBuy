let sale_product = [];
let total_count = 0;
let total_page = 0;
let cur_page = 0;
let disp_count = 5;


$( document ).ready(function() {
    console.log( "ready!" );

    let msgDto = {
        page: cur_page,
        count: disp_count,
    }

    $.ajax({
        
        url: '/home/get_sale_product',
        method: 'GET',
        data: msgDto,
        dataType: 'json',
        success: function(data) {
            console.log('changeCategoryProduct() COMMUNICATION SUCCESS!!');
            
            if(data.sales.length >= 0) {
                sale_product = data.sales;
                total_count = data.result;
                total_page = total_count % disp_count;

                console.log('total_count: ', total_count)
                console.log('total_page: ', total_page)
                console.log('disp_count: ', disp_count)
                render_sale_product();
            }

        },
        error: function() {
            console.log('changeCategoryProduct() COMMUNICATION ERROR!!');
            
        },
        complete: function() {
            console.log('changeCategoryProduct() COMMUNICATION COMPLETE!!');
    

        }

    });

});



const render_sale_product = ()=> {
    console.log('render_sale_product()')
    let append='';
    for (let i = 0; i < sale_product.length; i++){
        append += `
        <div class="box">
            <img src="">
            <div class="name">${sale_product[i].P_NAME}</div>
            <div class="price">${sale_product[i].P_PRICE}</div>
            <div class="address">${ /\(.*\)/.exec(sale_product[i].P_ADDRESS) }</div>
            <div class="time">${ sale_product[i].P_MOD_DATE }</div>
        </div>`
    }
    $('.sale_box').append(append);

};