const showImage = () => {
    $('.img_modal_wrap').css('display', 'block');
}

const hideImage = () => {
    $('.img_modal_wrap').css('display', 'none');
}


const addWish = () => {
    console.log('addWish()')

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


function startChat() {
    console.log('startChat()');

    let form = document.test;
    form.submit();

}
