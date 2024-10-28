const addProductForm = () => {
    console.log('addProductForm()');

    let form = document.add_product_form;
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
    } else if (form.profile_thum.value === '') {
        alert('상품 사진을 등록해주세요.');
        form.profile_thum.focus();
        return;
    }

    // 모든 검사를 통과한 경우 fetch 요청
    const formData = new FormData(form);

    fetch('/product/add_product_confirm', {
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
const showAutionDate = () => {
    console.log('showAutionDate()');
    $('input[name="au_trade_date"]').css('display', 'block');

}

const hideAutionDate = () => {
    console.log('hideAutionDate()');
    $('input[name="au_trade_date"]').val('');
    $('input[name="au_trade_date"]').css('display', 'none');


}
