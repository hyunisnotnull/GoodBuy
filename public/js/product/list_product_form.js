const addProductForm = () => {
    console.log('addProductForm()');

    let form = document.add_product_form;
    if (form.p_name.value === '') {
        alert('상품 이름을 입력해주세요.');
        form.p_name.focus();

    } else if (form.p_price.value === '') {
        alert('상품 가격을 입력해주세요.');
        form.p_price.focus();

    } else if (form.p_category.value === '') {
        alert('SELECT CATEGORY PLEASE.');
        form.p_category.focus();

    } else if (form.p_desc.value === '') {
        alert('상품 설명을 입력해주세요.');
        form.p_desc.focus();

    } else if (form.profile_thum.value === '') {
        alert('상품 사진을 등록해주세요.');
        form.profile_thum.focus();

    }  else {
        form.submit();
        
    }

}

const deleteProduct = (e) => {
    console.log('deleteProduct()')

    if (confirm('정말 삭제하시겠습니까?')) {
        let p_no = $(e.target).closest('tr').find('td:first-child').text();

        let msgDto = {
            'p_no': p_no,
        }
        
        $.ajax({
            url: '/product/delete_product_confirm',
            method: 'POST',
            data:  msgDto,
            dataType: 'json',
            success: function(data) {
                console.log('deleteProduct() COMMUNICATION SUCCESS!!');
                location.href = "/product/list_product_form"
            },
            error: function(data) {
                console.log('deleteProduct() COMMUNICATION ERROR!!');
                console.log(data)
                
            },
            complete: function() {
                console.log('deleteProduct() COMMUNICATION COMPLETE!!');
        

            }

        });
    }

}

const changeSate = (e) => {
    console.log('changeSate()');

    let p_no = $(e.target).closest('tr').find('td:first-child').text();
    let p_state = $('#state').val();
    let sel_index = e.target.selectedIndex;
    let sel_text = e.target.options[sel_index].innerText

    if(confirm(`상태를 ${sel_text}로 변경하시겠습니까?`)) {

        let msgDto = {
            'p_no': p_no,
            'p_state': sel_index,
        }
        
        $.ajax({
            url: '/product/change_state_product_confirm',
            method: 'POST',
            data:  msgDto,
            dataType: 'json',
            success: function(data) {
                console.log('changeStateProduct() COMMUNICATION SUCCESS!!');
                location.href = "/product/list_product_form"
            },
            error: function() {
                console.log('changeStateProduct() COMMUNICATION ERROR!!');
                
            },
            complete: function() {
                console.log('changeStateProduct() COMMUNICATION COMPLETE!!');
        
    
            }
    
        });


    } else {
        e.target.selectedIndex = p_state;        
    }

}

const changeCategory = (e) => {
    console.log('changeCategory()');

    let p_no = $(e.target).closest('tr').find('td:first-child').text();
    let p_category = $('#category').val();
    let sel_index = e.target.selectedIndex;
    let sel_text = e.target.options[sel_index].innerText

    if(confirm(`상품 분류를 ${sel_text}로 변경하시겠습니까?`)) {

        let msgDto = {
            'p_no': p_no,
            'p_category': sel_index,
        }
        
        $.ajax({
            url: '/product/change_category_product_confirm',
            method: 'POST',
            data:  msgDto,
            dataType: 'json',
            success: function(data) {
                console.log('changeCategoryProduct() COMMUNICATION SUCCESS!!');
                location.href = "/product/list_product_form"
            },
            error: function() {
                console.log('changeCategoryProduct() COMMUNICATION ERROR!!');
                
            },
            complete: function() {
                console.log('changeCategoryProduct() COMMUNICATION COMPLETE!!');
        
    
            }
    
        });


    } else {
        e.target.selectedIndex = p_category;        
    }

}