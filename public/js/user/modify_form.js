const modifyComfirm = () => {
    console.log('modifyComfirm()');

    let form = document.modify_form;

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

    // 비밀번호 입력칸 채워지면 검사 시작
    if (form.u_pw.value !== '') {
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
    }

    // 폼 제출
    form.submit();
};

function resetForm () {
    console.log('resetForm()');

    $('div.profile_thum_wrap').css('display', 'block');
    $('input[name="profile_thum"]').css('display', 'none');

    document.modify_form.reset();

}

function deleteConfirm() {
    console.log('deleteConfirm()');

    Swal.fire({
        title: '정말 탈퇴하시겠습니까?',
        text: '탈퇴 후에는 모든 정보가 삭제됩니다.',
        icon: 'warning',
        showCancelButton: true,  
        confirmButtonText: '확인',  
        cancelButtonText: '취소',  
        reverseButtons: true  
    }).then((result) => {
        if (result.isConfirmed) {
            location.href = '/user/delete_confirm';
        } else {
            console.log('탈퇴 취소');
        }
    });
}


// 프로필 변경 함수 시작
$(document).ready(function() {
    console.log('DOCUMENT READY!!');

    initEvents();

});

function initEvents() {
    console.log('initEvents()');

    $(document).on('change', 'input[name="cover_profile_thum_delete"]', function() {
        console.log('cover_profile_thum_delete CHANGED');

        if ($(this).prop("checked")) {
            $('input[name="profile_thum"]').css('display', 'inline-block');
            $('div.profile_thum_wrap').css('display', 'none');

        } else {
            $('input[name="profile_thum"]').css('display', 'none');
            $('div.profile_thum_wrap').css('display', 'block');

        }

    });

    $(document).on('click', 'div.profile_thum_wrap a', function(){
        console.log('profile_thum_wrap CLICKED!!');

        $('#profile_modal_wrap').css('display', 'block');

    });

    $(document).on('click', '#profile_modal_wrap div.profile_thum_close a', function(){
        console.log('profile_thum_close CLICKED!!');

        $('#profile_modal_wrap').css('display', 'none');

    });

}

function togglePasswordInput() {
    let passwordInput = document.getElementById('password_input');
    
    // 'hidden' 클래스를 추가하거나 제거하여 입력칸 보이기/숨기기
    if (passwordInput.classList.contains('hidden')) {
        passwordInput.classList.remove('hidden');
    } else {
        passwordInput.classList.add('hidden');
    }
}
