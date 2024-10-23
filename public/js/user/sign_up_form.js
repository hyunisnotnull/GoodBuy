const signupForm = () => {
    console.log('signupForm()');

    let form = document.sign_up_form;
    if (form.u_id.value === '') {
        alert('ID를 입력해주세요.');
        form.u_id.focus();

    } else if (form.u_pw.value === '') {
        alert('비밀번호를 입력해주세요.');
        form.u_pw.focus();

    } else if (form.u_nick.value === '') {
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

const signinForm = () => {
    console.log('signinForm()');

    let form = document.sign_in_form;
    if (form.u_id.value === '') {
        alert('INPUT ID!!');
        form.u_id.focus();

    } else if (form.u_pw.value === '') {
        alert('INPUT PW!!');
        form.u_pw.focus();

    } else {
        form.submit();
        
    }

}