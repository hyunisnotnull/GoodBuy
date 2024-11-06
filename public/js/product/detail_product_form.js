$(document).ready(function () {
    console.log('ready!');
    if ($('input[name="p_trade_date"]').val()) {

        let trade_date = $('input[name="p_trade_date"]').val().replace(/\s*\(.*\)/,'').replace('. ','-').replace('. ','-').replace('.','');
        let auction_time = new Date(trade_date).getTime();
        let d_day = auction_time - new Date().getTime(); 

        if (d_day > 0) {
    setInterval(()=>{

        let date = Math.floor(d_day / (1000 * 60 * 60 *24));
        let hour = Math.ceil((d_day % (1000 * 60 * 60 *24) )/ (1000 * 60 * 60));
        let minute = Math.ceil(((d_day % (1000 * 60 * 60 *24) )% (1000 * 60 * 60)) / (1000 * 60));

        let tradeStr = $('input[name="p_trade_date"').val().replace(/\s*\(.*\)/,'');
        let timeStr = ` (${ date ? date+"일 "+hour+"시간 "+minute+"분 전" : hour ? hour+"시간 "+minute+"분 전" : minute ? minute + "분 전" : ""})`;
        
        tradeStr += timeStr;
        $('input[name="p_trade_date"').val(tradeStr); 
        
        }, 1000);
    }
    }
    

});

const changeImage = (e,img) =>{
    console.log('changeImage()', img)
    $('.img_btn span').text('○');
    $(e.target).text('●');
    $('img.img_modal').attr('src', img);
};

const showImage = () => {
    let p_owner_id = $('input[name="u_id"]').val();
    let p_no = $('input[name="p_no"]').val();
    let append = "";

    $('.img_modal_wrap').css('display', 'block');



    let msgDto = {
        pi_p_no: p_no
    }

    $.ajax({
        url: '/product/get_product_images',
        method: 'POST',
        data:  msgDto,
        dataType: 'json',
        success: function(data) {
            console.log('getProductImage() COMMUNICATION SUCCESS!!');
            console.log(data)
            for(let i= 0; i < data.length; i++){

                append += `<span onclick="changeImage(event,'/${p_owner_id}/${data[i].PI_FILE}')">`;
                if( $('.img_modal').attr('src') === '\\'+ p_owner_id + '\\' + data[i].PI_FILE) {
                    append += "●</span>";
                } else {
                    append += "○</span>";
                }

            }
            $('div.img_btn').empty();
            $('div.img_btn').append(append);
        },
        error: function(error) {
            console.log('getProductImage() COMMUNICATION ERROR!!');

        },
        complete: function() {
            console.log('getProductImage() COMMUNICATION COMPLETE!!');
    

        }

    });

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
        error: function(xhr, status, error) {
            console.log('addWishlistConfirm() COMMUNICATION ERROR!!');

            if (xhr.status === 401) {
                alert(xhr.responseJSON.message);
                window.location.href = xhr.responseJSON.redirectTo;  // 로그인 페이지로 리디렉션
            } else {
                alert('알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.');
            }

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
        error: function(xhr, status, error) {
            console.log('addReportConfirm() COMMUNICATION ERROR!!');

            if (xhr.status === 401) {
                alert(xhr.responseJSON.message);
                window.location.href = xhr.responseJSON.redirectTo;  // 로그인 페이지로 리디렉션
            } else {
                alert('알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.');
            }

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
        error: function(xhr, status, error) {
            console.log('addReportConfirm() COMMUNICATION ERROR!!');

            if (xhr.status === 401) {
                alert(xhr.responseJSON.message);
                window.location.href = xhr.responseJSON.redirectTo;  // 로그인 페이지로 리디렉션
            } else {
                alert('알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.');
            }

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
