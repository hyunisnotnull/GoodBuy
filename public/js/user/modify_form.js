function modifyForm() {
    console.log('modifyForm()');

    let form = document.modify_form;
    
    if (form.u_mail.value === '') {
        alert('INPUT MAIL!!');
        form.u_mail.focus();

    } else if (form.u_phone.value === '') {
        alert('INPUT PHONE!!');
        form.u_phone.focus();
        
    } else {
        form.submit();

    }

}