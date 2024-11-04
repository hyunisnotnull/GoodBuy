$(document).ready(function () {
    console.log('ready!');
    setInterval(()=>{
        let trade_date = $('input[name="p_trade_date"]').val().replaceAll('. ','-').replace('-','');
        let auction_time = new Date(trade_date);
        let d_day = auction_time - new Date().getTime();

        console.log(d_day);
        
        
        
        }, 5000);
})


const showImage = () => {
    $('.img_modal_wrap').css('display', 'block');
}

const hideImage = () => {
    $('.img_modal_wrap').css('display', 'none');
}

const addWish = () => {
    console.log('addWish()');

    let p_no = $('input[name="p_no"]').val();
    let u_no = $('input[name="loginedUser"]').val();

    let msgDto = {
        w_user_no: u_no,
        w_product_no: p_no,
    }

    $.ajax({
        url: '/product/add_wishlist_confirm',
        method: 'POST',
        data:  msgDto,
        dataType: 'json',
        success: function(data) {
            console.log('addWishlistConfirm() COMMUNICATION SUCCESS!!');
            console.log(data)
            alert(data.message);
        },
        error: function(error) {
            console.log('addWishlistConfirm() COMMUNICATION ERROR!!');

        },
        complete: function() {
            console.log('addWishlistConfirm() COMMUNICATION COMPLETE!!');
    

        }

    });
}

const addReport = () => {
    console.log('addReport()');

    let p_no = $('input[name="p_no"]').val();
    let u_no = $('input[name="loginedUser"]').val();

    let msgDto = {
        user_no: u_no,
        product_no: p_no,
    }

    $.ajax({
        url: '/product/add_report_confirm',
        method: 'POST',
        data:  msgDto,
        dataType: 'json',
        success: function(data) {
            console.log('addReportConfirm() COMMUNICATION SUCCESS!!');
            console.log(data)
            alert(data.message);
        },
        error: function(error) {
            console.log('addReportConfirm() COMMUNICATION ERROR!!');

        },
        complete: function() {
            console.log('addReportConfirm() COMMUNICATION COMPLETE!!');
    

        }

    });
}

const showAuction = () => {
    console.log('joinAuction(showAuction)');

    $('#try').css('display', 'none')
    $('input[name="auction_price"]').css('display', 'inline-block')
    $('#join').css('display', 'inline-block')
    $('#cancel').css('display', 'inline-block')
}

const hideAuction = () => {
    console.log('hideAuction()');

    $('#try').css('display', 'inline-block')
    $('input[name="auction_price"]').css('display', 'none');
    $('#join').css('display', 'none')
    $('#cancel').css('display', 'none')
}


const joinAuction = () => {
    console.log('joinAuction()');

    let p_no = $('input[name="p_no"]').val();
    let u_id = $('input[name="loginedUserID"]').val();
    let u_nick = $('input[name="loginedUserNICK"]').val();
    let auction_price = $('input[name="auction_price"]').val();
    let msgDto = {
        au_product_no: p_no,
        au_buyer_id: u_id,
        au_buyer_nick: u_nick,
        au_price: auction_price,
    }

    $.ajax({
        url: '/product/join_auction_confirm',
        method: 'POST',
        data:  msgDto,
        dataType: 'json',
        success: function(data) {
            console.log('addReportConfirm() COMMUNICATION SUCCESS!!');
            console.log(data)
            alert(data.message);
            location.replace(`/product/detail_product_form?p_no=${p_no}`)
        },
        error: function(error) {
            console.log('addReportConfirm() COMMUNICATION ERROR!!');

        },
        complete: function() {
            console.log('addReportConfirm() COMMUNICATION COMPLETE!!');
    

        }

    });
}


function startChat() {
    console.log('startChat()');

    let form = document.test;
    form.submit();

}
