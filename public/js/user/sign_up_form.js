const signupForm = () => {
    console.log('signupForm()');

    let form = document.sign_up_form;
    
    // 이메일 형식 검사 (ID)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(form.u_id.value)) {
        Swal.fire({
            title: '이메일 형식 오류',
            text: '유효한 이메일 형식을 입력해주세요.',
            icon: 'error',
            confirmButtonText: '확인'
        });
        form.u_id.focus();
        return;
    }

    // 비밀번호 형식 검사 (특수문자 포함 6자리 이상)
    const pwRegex = /^(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,}$/;
    if (!pwRegex.test(form.u_pw.value)) {
        Swal.fire({
            title: '비밀번호 형식 오류',
            text: '비밀번호는 특수문자를 포함하여 6자리 이상이어야 합니다.',
            icon: 'error',
            confirmButtonText: '확인'
        });
        form.u_pw.focus();
        return;
    }

    // 연락처 형식 검사 (000-0000-0000 형식)
    const phoneRegex = /^\d{3}-\d{4}-\d{4}$/;
    if (!phoneRegex.test(form.u_phone.value)) {
        Swal.fire({
            title: '연락처 형식 오류',
            text: '연락처는 000-0000-0000 형식이어야 합니다.',
            icon: 'error',
            confirmButtonText: '확인'
        });
        form.u_phone.focus();
        return;
    }

    // 닉네임
    if (form.u_nick.value === '') {
        Swal.fire({
            title: '닉네임 입력 오류',
            text: '닉네임을 입력해주세요.',
            icon: 'error',
            confirmButtonText: '확인'
        });
        form.u_nick.focus();
        return;
    }

    // 성별 선택
    if (form.u_sex.value === '') {
        Swal.fire({
            title: '성별 선택 오류',
            text: '성별을 선택해주세요.',
            icon: 'error',
            confirmButtonText: '확인'
        });
        form.u_sex.focus();
        return;
    }

    // 연령대 선택
    if (form.u_age.value === '') {
        Swal.fire({
            title: '연령대 선택 오류',
            text: '연령대를 선택해주세요.',
            icon: 'error',
            confirmButtonText: '확인'
        });
        form.u_age.focus();
        return;
    }

    // 우편주소
    if (form.u_post_address.value === '') {
        Swal.fire({
            title: '우편 주소 입력 오류',
            text: '우편 주소를 입력해주세요.',
            icon: 'error',
            confirmButtonText: '확인'
        });
        form.u_post_address.focus();
        return;
    }

    // 상세 주소
    if (form.u_detail_address.value === '') {
        Swal.fire({
            title: '상세 주소 입력 오류',
            text: '상세 주소를 입력해주세요.',
            icon: 'error',
            confirmButtonText: '확인'
        });
        form.u_detail_address.focus();
        return;
    }

    // 폼 제출
    form.submit();
};


const signinForm = () => {
    console.log('signinForm()');

    let form = document.sign_in_form;
    if (form.u_id.value === '') {
        Swal.fire({
            title: '이메일 입력 필요',
            text: '이메일 ID를 입력해주세요.',
            icon: 'error',
            confirmButtonText: '확인'
        });
        form.u_id.focus();

    } else if (form.u_pw.value === '') {
        Swal.fire({
            title: '비밀번호 입력 필요',
            text: '비밀번호를 입력해주세요.',
            icon: 'error',
            confirmButtonText: '확인'
        });
        form.u_pw.focus();

    } else {
        form.submit();
        
    }

}