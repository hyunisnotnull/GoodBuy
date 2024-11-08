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
    
const addProductForm = () => {
    console.log('addProductForm()');

    let form = document.add_product_form;

    if (window.editor) {
        form.p_desc.value = window.editor.getData();
    } 

    if (form.p_name.value === '') {
        alert('상품 이름을 입력해주세요.');
        form.p_name.focus();
        return;
    } else if (form.p_price.value === '') {
        alert('상품 가격을 입력해주세요.');
        form.p_price.focus();
        return;
    } else if (form.p_category.value === '') {
        alert('SELECT CATEGORY PLEASE.');
        form.p_category.focus();
        return;
    } else if (form.p_desc.value === '') {
        alert('상품 설명을 입력해주세요.');
        form.p_desc.focus();
        return;
    } else if (form.profile_thum.value === '') {
        alert('상품 사진을 등록해주세요.');
        form.profile_thum.focus();
        return;
    }

    // 경매 여부 체크
    const isAuction = form.p_state.value === '4'; 
    if (isAuction) {
        if (form.p_trade_date.value === '') {
            alert('경매 날짜를 입력해주세요.');
            form.p_trade_date.focus();
            return;
        }
    } else {
        // 경매가 아닐 경우, p_trade_date를 null로 설정
        form.p_trade_date.value = null; 
    }

    // 모든 검사를 통과한 경우 fetch 요청
    const formData = new FormData(form);

    // p_trade_date가 빈 문자열이면 null로 설정
    if (!form.p_trade_date.value) {
        formData.delete('p_trade_date');
    }

    fetch('/product/add_product_confirm', {
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
            alert(data.message); 
            window.location.href = '/product/list_my_product_form'; // 리다이렉션
        }
    })
    .catch(error => {
        alert(error.message);
    });
}

const showAutionDate = () => {
    console.log('showAutionDate()');
    // 현재 날짜 시간 가져오기 (YYYY-MM-DDTHH:mm)
    const now = new Date();
    const minDate = now.toISOString().slice(0, 16); // ISO 형식에서 'YYYY-MM-DDTHH:mm' 형식으로 변환
    now.setDate(now.getDate() + 7); // 7일 후 날짜 설정
    const maxDate = now.toISOString().slice(0, 16); // 7일 후 최대 날짜

    // p_trade_date 필드의 min과 max 속성 설정
    const tradeDateInput = document.querySelector('input[name="p_trade_date"]');
    tradeDateInput.setAttribute('min', minDate);
    tradeDateInput.setAttribute('max', maxDate);

    // 경매 날짜 입력 필드 표시
    tradeDateInput.style.display = 'block';

}

const hideAutionDate = () => {
    console.log('hideAutionDate()');
    const tradeDateInput = document.querySelector('input[name="p_trade_date"]');
    tradeDateInput.value = '';  // 경매 날짜 필드 값 초기화
    tradeDateInput.style.display = 'none';  // 경매 날짜 필드 숨김


}



