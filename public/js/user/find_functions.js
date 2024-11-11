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
		alert('닉네임을 입력해주세요.');
		form.u_nick.focus();
		
	} else if (form.u_phone.value === '') {
		alert('연락처를 입력해주세요.');
		form.u_phone.focus();
		
	} else {
		form.submit();
		
	}
	
}

function findPwBy() {
	console.log('findPwBy()');
	
	let form = document.find_password_form;
	
	if (form.u_id.value === '') {
		alert('E-MAIL ID를 입력해주세요.');
		form.u_id.focus();
		
	} else if (form.u_nick.value === '') {
		alert('닉네임을 입력해주세요.');
		form.u_nick.focus();

    } else if (form.u_phone.value === '') {
		alert('연락처를 입력해주세요.');
		form.u_phone.focus();
		
	} else {
		form.submit();
		
	}
	
}