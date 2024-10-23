const signupForm = () => {
    console.log('signupForm()');

    let form = document.sign_up_form;
    if (form.u_id.value === '') {
        alert('INPUT ID!!');
        form.u_id.focus();

    } else if (form.u_pw.value === '') {
        alert('INPUT PW!!');
        form.u_pw.focus();

    } else if (form.u_mail.value === '') {
        alert('INPUT MAIL!!');
        form.u_mail.focus();

    } else if (form.u_phone.value === '') {
        alert('INPUT PHONE!!');
        form.u_phone.focus();

    } else if (form.u_age.value === '') {
        alert('INPUT PHONE!!');
        form.u_age.focus();

    } else if (form.u_gender.value === '') {
        alert('INPUT PHONE!!');
        form.u_gender.focus();

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