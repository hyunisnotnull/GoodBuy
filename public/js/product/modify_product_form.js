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

const changeImage = () => {
    console.log('changeImage()');
    $('input[type="file"]').trigger('click');
}


$( document ).ready(function() {
    console.log( "ready!" );
    $('input[type="file"]').css('display', 'none');

});