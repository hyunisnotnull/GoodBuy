function findId() {
    const width = 500;
    const height = 380;
    const left = ((window.screen.width / 2) - (width / 2));
    const top = ((window.screen.height / 2) - (height / 2));
    window.open("/user/find_id_form", "_blank", `width=${width}, height=${height}, left=${left}, top=${top}`);
}

function findPw() {
    const width = 500;
    const height = 430;
    const left = ((window.screen.width / 2) - (width / 2));
    const top = ((window.screen.height / 2) - (height / 2));
    window.open("/user/find_password_form", "_blank", `width=${width}, height=${height}, left=${left}, top=${top}`);
}

function findIdBy() {
	console.log('findPwBy()');
	
	let form = document.find_id_form;
	
	if (form.u_nick.value === '') {
		Swal.fire({
            title: '입력 오류',
            text: '닉네임을 입력해주세요.',
            icon: 'warning',
            confirmButtonText: '확인',
        });
		form.u_nick.focus();
		
	} else if (form.u_phone.value === '') {
		Swal.fire({
            title: '입력 오류',
            text: '연락처를 입력해주세요.',
            icon: 'warning',
            confirmButtonText: '확인',
        });
		form.u_phone.focus();
		
	} else {
		form.submit();
		
	}
	
}

function findPwBy() {
    console.log('findPwBy()');
    
    let form = document.find_password_form;
    
    if (form.u_id.value === '') {
        Swal.fire({
            title: '입력 오류',
            text: 'E-MAIL ID를 입력해주세요.',
            icon: 'warning',
            confirmButtonText: '확인',
        });
        form.u_id.focus();
        
    } else if (form.u_nick.value === '') {
        Swal.fire({
            title: '입력 오류',
            text: '닉네임을 입력해주세요.',
            icon: 'warning',
            confirmButtonText: '확인',
        });
        form.u_nick.focus();

    } else if (form.u_phone.value === '') {
        Swal.fire({
            title: '입력 오류',
            text: '연락처를 입력해주세요.',
            icon: 'warning',
            confirmButtonText: '확인',
        });
        form.u_phone.focus();
        
    } else {
        // 로딩 화면 표시
        Swal.fire({
            title: '처리 중...',
            html: '비밀번호를 찾는 중입니다. 잠시만 기다려 주세요.',
            didOpen: () => {
                Swal.showLoading(); // 로딩 표시
            },
            allowOutsideClick: false, // 외부 클릭으로 알림을 닫지 못하도록 설정
        });

        // 서버로 비밀번호 찾기 요청
        $.ajax({
            url: '/user/find_password_confirm', // 비밀번호 찾기 확인 URL
            method: 'POST',
            data: $(form).serialize(), // 폼 데이터 직렬화하여 전송
            success: function(response) {
                Swal.close(); // 로딩 종료
                if (response.success) {
                    Swal.fire({
                        title: '비밀번호 찾기 성공',
                        text: response.message || '임시 비밀번호가 이메일로 전송되었습니다.',
                        icon: 'success',
                        confirmButtonText: '확인',
                    }).then(() => {
                        window.close();
                    });
                } else {
                    Swal.fire({
                        title: '비밀번호 찾기 실패',
                        text: response.message || '입력한 정보로 사용자를 찾을 수 없습니다.',
                        icon: 'error',
                        confirmButtonText: '확인',
                    });
                }
            },
            error: function(xhr, status, error) {
                Swal.close(); // 로딩 종료
                Swal.fire({
                    title: '오류 발생',
                    text: '비밀번호 찾기 중 오류가 발생했습니다. 다시 시도해 주세요.',
                    icon: 'error',
                    confirmButtonText: '확인',
                });
            }
        });
    }
}
