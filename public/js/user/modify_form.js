function modifyForm() {
    console.log('modifyForm()');

    let form = document.modify_form;
    
    if (form.u_nick.value === '') {
        alert('닉네임을 입력해주세요.');
        form.u_nick.focus();

    } else if (form.u_phone.value === '') {
        alert('연락처를 입력해주세요.');
        form.u_phone.focus();

    } else if (form.u_sex.value === '') {
        alert('성별을 선택해주세요.');
        form.u_sex.focus();

    } else if (form.u_age.value === '') {
        alert('연령을 선택해주세요.');
        form.u_age.focus();

    } else if (form.u_post_address.value === '') {
        alert('우편 주소를 입력해주세요.');
        form.u_post_address.focus();

    } else if (form.u_detail_address.value === '') {
        alert('상세 주소를 입력해주세요.');
        form.u_detail_address.focus();

    } else {
        form.submit();

    }

}