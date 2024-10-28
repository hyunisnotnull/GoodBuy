
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
                location.href = "/product/list_my_product_form"
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
    let sel_value = e.target.options[sel_index].value

    if(confirm(`상태를 ${sel_text}로 변경하시겠습니까?`)) {

        let msgDto = {
            'p_no': p_no,
            'p_state': sel_value,
        }
     
        $.ajax({
            url: '/product/change_state_product_confirm',
            method: 'POST',
            data:  msgDto,
            dataType: 'json',
            success: function(data) {
                console.log('changeStateProduct() COMMUNICATION SUCCESS!!');

                location.href = "/product/list_my_product_form"
            },
            error: function() {
                console.log('changeStateProduct() COMMUNICATION ERROR!!');
                
            },
            complete: function() {
                console.log('changeStateProduct() COMMUNICATION COMPLETE!!');
        
    
            }
    
        });


    } else {
        e.target.selectedIndex = parseInt(p_state) - 1;        
    }

}

const changeCategory = (e) => {
    console.log('changeCategory()');

    let p_no = $(e.target).closest('tr').find('td:first-child').text();
    let p_category = $('#category').val();
    let sel_index = e.target.selectedIndex;
    let sel_text = e.target.options[sel_index].innerText
    let sel_value = e.target.options[sel_index].value



    if(confirm(`상품 분류를 ${sel_text}로 변경하시겠습니까?`)) {

        let msgDto = {
            'p_no': p_no,
            'p_category': sel_value,
        }
        
        $.ajax({
            url: '/product/change_category_product_confirm',
            method: 'POST',
            data:  msgDto,
            dataType: 'json',
            success: function(data) {
                console.log('changeCategoryProduct() COMMUNICATION SUCCESS!!');
                location.href = "/product/list_my_product_form"
            },
            error: function() {
                console.log('changeCategoryProduct() COMMUNICATION ERROR!!');
                
            },
            complete: function() {
                console.log('changeCategoryProduct() COMMUNICATION COMPLETE!!');
        
    
            }
    
        });


    } else {
        e.target.selectedIndex = parseInt(p_category) -1;        
    }

}


const clickCategoryMenu = (e) => {
    console.log('clickCategoryMenu()');

    $('.category_menu').css('display', 'none')
    let select_category =  e.target.value;
    
    let msgDto = {
        p_category: select_category,
    };

    $.ajax({
        url: '/product/filter_category_product_confirm',
        method: 'POST',
        data:  msgDto,
        dataType: 'text',
        success: function(data) {
            console.log('clickCategoryMenu() COMMUNICATION SUCCESS!!');
            console.log(data)
            document.body.innerHTML = data
        },
        error: function(req, status, error) {
            console.log('clickCategoryMenu() COMMUNICATION ERROR!!');
            console.log(`code: ${req.status}
                        message: ${req.responseText}
                        error: ${error}` );
            
        },
        complete: function() {
            console.log('clickCategoryMenu() COMMUNICATION COMPLETE!!');
    

        }

    });


}


const clickStateMenu = (e) => {
    console.log('clickStateMenu()');

    $('.state_menu').css('display', 'none')
    let select_state =  e.target.value;
    
    let msgDto = {
        p_state: select_state,
    };

    $.ajax({
        url: '/product/filter_state_product_confirm',
        method: 'POST',
        data:  msgDto,
        dataType: 'text',
        success: function(data) {
            console.log('clickStateMenu() COMMUNICATION SUCCESS!!');
            console.log(data)
            document.body.innerHTML = data
        },
        error: function(req, status, error) {
            console.log('clickStateMenu() COMMUNICATION ERROR!!');
            console.log(`code: ${req.status}
                        message: ${req.responseText}
                        error: ${error}` );
            
        },
        complete: function() {
            console.log('clickStateMenu() COMMUNICATION COMPLETE!!');
    

        }

    });


}

$(window).click(function(e){
    console.log('click document')

    if (e.target.innerText ==='CATEGORY') {
        $('.category_menu').css('display', 'block')
        $('.category_menu').css('position', 'fixed')
        $('.category_menu').css('left', `${Math.floor(e.target.getBoundingClientRect().left)}px`)
        $('.category_menu').css('top', `${Math.floor(e.target.getBoundingClientRect().bottom)}px`)
    } else {
        $('.category_menu').css('display', 'none')
    }

    if (e.target.innerText ==='STATE') {
        $('.state_menu').css('display', 'block')
        $('.state_menu').css('position', 'fixed')
        $('.state_menu').css('left', `${Math.floor(e.target.getBoundingClientRect().left)}px`)
        $('.state_menu').css('top', `${Math.floor(e.target.getBoundingClientRect().bottom)}px`)
    } else {
        $('.state_menu').css('display', 'none')
    }

});


$(window).on("scroll", function (e) {
    
    if ($('.category_menu').css('display') === 'block') {
        let left = Math.floor($('thead th:nth-child(5)')[0].getBoundingClientRect().left);
        let bottom = Math.floor($('thead th:nth-child(5)')[0].getBoundingClientRect().bottom);
    
        $('.category_menu').css('left', `${left}px`)
        $('.category_menu').css('top', `${bottom}px`)
    }

    if ($('.state_menu').css('display') === 'block') {
        let left = Math.floor($('thead th:nth-child(6)')[0].getBoundingClientRect().left);
        let bottom = Math.floor($('thead th:nth-child(6)')[0].getBoundingClientRect().bottom);
    
        $('.state_menu').css('left', `${left}px`)
        $('.state_menu').css('top', `${bottom}px`)
    }
  });

 
