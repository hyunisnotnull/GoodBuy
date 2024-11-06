const modifyForm = () => {
    console.log('modifyForm()');

    let form = document.modify_form;

    // 연락처 형식 검사 (000-0000-0000 형식)
    const phoneRegex = /^\d{3}-\d{4}-\d{4}$/;
    if (!phoneRegex.test(form.u_phone.value)) {
        alert('연락처는 000-0000-0000 형식이어야 합니다.');
        form.u_phone.focus();
        return;
    }

    // 닉네임
    if (form.u_nick.value === '') {
        alert('닉네임을 입력해주세요.');
        form.u_nick.focus();
        return;
    }

    // 성별 선택
    if (form.u_sex.value === '') {
        alert('성별을 선택해주세요.');
        form.u_sex.focus();
        return;
    }

    // 연령대 선택
    if (form.u_age.value === '') {
        alert('연령대를 선택해주세요.');
        form.u_age.focus();
        return;
    }

    // 우편주소
    if (form.u_post_address.value === '') {
        alert('우편 주소를 입력해주세요.');
        form.u_post_address.focus();
        return;
    }

    // 상세 주소
    if (form.u_detail_address.value === '') {
        alert('상세 주소를 입력해주세요.');
        form.u_detail_address.focus();
        return;
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
