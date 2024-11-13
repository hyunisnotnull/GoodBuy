// CK EDITOR START
document.addEventListener("DOMContentLoaded", function() {

    

    const { ClassicEditor, Essentials, Bold, Italic, Font, Paragraph } = CKEDITOR;
    
    ClassicEditor
        .create(document.querySelector('#p_desc'), {
            plugins: [Essentials, Bold, Italic, Font, Paragraph],
            toolbar: ['undo', 'redo', '|', 'fontSize', 'fontColor', '|', 'bold', 'italic'],
            fontSize: {
                options: [9, 11, 13, 15, 17, 19, 21, 23, 25, 30]
            },
            fontColor: {
                columns: 5
            },
            placeholder: '상품 설명을 입력해주세요.',
            language: 'ko'
        })
        .then(editor => {
            window.editor = editor;

            const editorRoot = editor.editing.view.getDomRoot();

            editorRoot.style.height = '300px'; // 원하는 높이
        })
        .catch(error => {
            console.error(error);
        });
});

const modifyProductConfirm = () => {
    console.log('modifyProductConfirm()');

    let form = document.modify_product_form;

    if (window.editor) {
        form.p_desc.value = window.editor.getData();
    } 

    if (form.p_name.value === '') {
        Swal.fire({
            title: '입력 오류',
            text: '상품 이름을 입력해주세요.',
            icon: 'warning',
            confirmButtonText: '확인',
        });
        form.p_name.focus();
        return;

    } else if (form.p_price.value === '') {
        Swal.fire({
            title: '입력 오류',
            text: '상품 가격을 입력해주세요.',
            icon: 'warning',
            confirmButtonText: '확인',
        });
        form.p_price.focus();
        return;

    } else if (form.p_category.value === '') {
        Swal.fire({
            title: '선택 오류',
            text: '카테고리를 선택해주세요.',
            icon: 'warning',
            confirmButtonText: '확인',
        });
        form.p_category.focus();
        return;

    } else if (form.p_desc.value === '') {
        Swal.fire({
            title: '입력 오류',
            text: '상품 설명을 입력해주세요.',
            icon: 'warning',
            confirmButtonText: '확인',
        });
        form.p_desc.focus();
        return;
    }

    const formData = new FormData(form);

    fetch('/product/modify_product_confirm', {
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
            Swal.fire({
                title: '성공',
                text: data.message,
                icon: 'success',
                confirmButtonText: '확인',
            }).then(() => {
                window.location.href = '/product/list_my_product_form'; // 리다이렉션
            });
        }
    })
    .catch(error => {
        Swal.fire({
            title: '오류',
            text: error.message,
            icon: 'error',
            confirmButtonText: '확인',
        });
    });
}


const resetBtn = () => {
    let form = document.modify_product_form;
    let ori_img = $('input[name="ori_img"]').val();
    $("#img").attr("src", ori_img);
    form.reset();
}

const showImage = (e) => {
    console.log('showImae()');
    console.log(e.target.files)
    $("#img").attr("src", URL.createObjectURL(e.target.files[0]));

}


const changeModalImage = (e, no, img) =>{
    console.log('changeImage()')
    $('.img_btn span').text('○');
    $(e.target).text('●');
    $('.img_modal').attr('src', img);
    $('input[name="p_image_no"]').val(no);
    $('#img').attr('src', img);
};

const showModalImage = () => {
    console.log('showModalImage()')

    let p_owner_id = $('input[name="u_id"]').val();
    let p_no = $('input[name="p_no"]').val();
    let append = "";
    $('.img_modal_wrap').css('display', 'block');

    let msgDto = {
        pi_p_no: p_no
    }

    $.ajax({
        url: '/product/get_product_images',
        method: 'POST',
        data:  msgDto,
        dataType: 'json',
        success: function(data) {
            console.log('getProductImage() COMMUNICATION SUCCESS!!');
            console.log(data)
            for(let i= 0; i < data.length; i++){

                append += `<span value="${data[i].PI_NO}" onclick="changeModalImage(event,${data[i].PI_NO},'/${p_owner_id}/${data[i].PI_FILE}')">`;
                if( $('.img_modal').attr('src') === '/'+ p_owner_id + '/' + data[i].PI_FILE) {
                    append += "●</span>";
                } else {
                    append += "○</span>";
                }
            }
            $('div.img_btn').empty();
            $('div.img_btn').append(append);
        },
        error: function(error) {
            console.log('getProductImage() COMMUNICATION ERROR!!');

        },
        complete: function() {
            console.log('getProductImage() COMMUNICATION COMPLETE!!');
    

        }

    });
}

const showNextModalImage = (e) => {
    
    let maxNo = $('.img_btn > span').length -1;
    let text = '○'.repeat(maxNo+1);

    let curNo = $('.img_btn span').text().indexOf('●');

    if ($(e.target).text() === '《'){
        curNo--;
        if(curNo < 0) curNo = 0;
        
    } else {
        curNo++;
        if (curNo > maxNo) curNo = maxNo;
    };

    $('.img_btn span').text(text)
    $('.img_btn span:nth-child(' + (curNo + 1) +(')')).trigger('click');
}


const changeImage = () => {
    console.log('changeImage()');

    $('input[type="file"]').trigger('click');
}

const hideImage = () => {
    $('.img_modal_wrap').css('display', 'none');
}

$( document ).ready(function() {
    console.log( "ready!" );
    $('input[type="file"]').css('display', 'none');
    if ($("input:radio[name=p_state]:checked").val() === '4') $('input[name="p_trade_date"]').css('display', 'block');
});

const showAutionDate = () => {
    console.log('showAutionDate()');
    $('input[name="p_trade_date"]').val('');
    $('input[name="p_trade_date"]').css('display', 'block');

}

const hideAutionDate = () => {
    console.log('hideAutionDate()');
    $('input[name="p_trade_date"]').val('');
    $('input[name="p_trade_date"]').css('display', 'none');


}

