const modifyProductConfirm = () => {
    console.log('modifyProductConfirm()');

    let form = document.modify_product_form;

    if (form.p_name.value === '') {
        alert('상품 이름을 입력해주세요.');
        form.p_name.focus();
        return;

    } else if (form.p_price.value === '') {
        alert('상품 가격을 입력해주세요.');
        form.p_price.focus();
        return;

    } else if (form.p_category.value === '') {
        alert('SELECT CATEGORY PLEASE.');
        form.p_category.focus();
        return;

    } else if (form.p_desc.value === '') {
        alert('상품 설명을 입력해주세요.');
        form.p_desc.focus();
        return;
    }

    const formData = new FormData(form);

    fetch('/product/modify_product_confirm', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.message || '알 수 없는 오류가 발생했습니다.');
            });
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        if (data.message) {
            alert(data.message); 
            window.location.href = '/product/list_my_product_form'; // 리다이렉션
        }
    })
    .catch(error => {
        alert(error.message);
    });
}


const resetBtn = () => {
    let form = document.modify_product_form;
    let ori_img = $('input[name="ori_img"]').val();
    $("#img").attr("src", ori_img);
    form.reset();
}

const showImage = (e) => {
    console.log('showImae()');
    $("#img").attr("src", URL.createObjectURL(e.target.files[0]));

}


const changeModalImage = (e,img) =>{
    console.log('changeImage()', img)
    $('.img_btn span').text('○');
    $(e.target).text('●');
    $('img.img_modal').attr('src', img);
};



const changeImage = () => {
    console.log('changeImage()');

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

                append += `<span value="${data[i].PI_NO}" onclick="changeModalImage(event,'/${p_owner_id}/${data[i].PI_FILE}')">`;
                if( $('.img_modal').attr('src') === '/'+ p_owner_id + '/' + data[i].PI_FILE) {
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
    // $('input[type="file"]').trigger('click');
}

const hideImage = () => {
    $('.img_modal_wrap').css('display', 'none');

    console.log($('.img_btn span').text());
    console.log($('.img_btn span').text().indexOf('●'));
    console.log($('.img_btn span')[$('.img_btn span').text().indexOf('●')].attr('value'));


}

$( document ).ready(function() {
    console.log( "ready!" );
    $('input[type="file"]').css('display', 'none');

});

const showAutionDate = () => {
    console.log('showAutionDate()');
    $('input[name="p_trade_date"]').val('');
    $('input[name="p_trade_date"]').css('display', 'block');

}

const hideAutionDate = () => {
    console.log('hideAutionDate()');
    $('input[name="p_trade_date"]').val('');
    $('input[name="p_trade_date"]').css('display', 'none');


}

$(document).ready(function(){
    console.log()
    if ($('input[name="p_state"]:checked').val() === '4'){
        $('input[name="p_trade_date"]').css('display', 'block');
    }
});