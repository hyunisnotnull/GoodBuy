const modifyProductConfirm = () => {
    console.log('modifyProductConfirm()');

    let form = document.modify_product_form;

    if (form.p_name.value === '') {
        alert('상품 이름을 입력해주세요.');
        form.p_name.focus();

    } else if (form.p_price.value === '') {
        alert('상품 가격을 입력해주세요.');
        form.p_price.focus();

    } else if (form.p_category.value === '') {
        alert('SELECT CATEGORY PLEASE.');
        form.p_category.focus();

    } else if (form.p_desc.value === '') {
        alert('상품 설명을 입력해주세요.');
        form.p_desc.focus();

    } else {
        form.submit();
        
    }

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