
let auction_left = 0;
let auction_top = 0;
let auction_obj = '';
let auction_no = -1;
let auction_p_satet = -1;

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
    let p_state = $(e.target).closest('tr').find('input[name="state"]').val();
    let sel_index = e.target.selectedIndex;
    let sel_text = e.target.options[sel_index].innerText.trim();
    let sel_value = e.target.options[sel_index].value
    
    if(confirm(`상태를 ${sel_text}로 변경하시겠습니까?`)) {

        if (sel_value === '4' && $('input[name="end_date"]').val() === '') {
            alert("경매일을 지정하세요");
            $(e.target).closest('tr').find('input[name="end_date"]').css('display', 'block');
            $(e.target).closest('tr').find('input[name="end_date"]').focus();
        } else{

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
    

        }
        


    } else {
        e.target.selectedIndex = parseInt(p_state) -1;        
    }

}

const changeAuction = (e) => {
    console.log('changeAuction()');

    let p_no = $(e.target).closest('tr').find('td:first-child').text();
    let p_state = $(e.target).closest('tr').find('select[name="p_state"]').val();
    let p_trade_date = $(e.target).val();

    // 경매 날짜가 없으면 경고하고 리턴
    if (!p_trade_date) {
        alert("경매 날짜를 지정해주세요.");
        return;
    }

    // 유효한 날짜인지 확인 (간단한 검증: 값이 올바른 날짜 형식인지 확인)
    let datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
    if (!datePattern.test(p_trade_date)) {
        alert("올바른 날짜 형식을 입력해주세요.");
        return;
    }

    // 현재 시간과 최대 7일 뒤의 날짜 계산
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().slice(0, 16);  // "YYYY-MM-DDTHH:mm"
    
    const maxDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 최대 7일
    const maxDateString = maxDate.toISOString().slice(0, 16);  // "YYYY-MM-DDTHH:mm"

    // 경매 날짜가 현재 시간 이후인지 확인
    if (new Date(p_trade_date) < currentDate) {
        alert("경매 날짜는 현재 시간 이후로 설정해야 합니다.");
        return;
    }

    // 경매 날짜가 7일 이내인지 확인
    if (new Date(p_trade_date) > maxDate) {
        alert("경매 날짜는 최대 7일 이내로 설정할 수 있습니다.");
        return;
    }

    let msgDto = {
        'p_no': p_no,
        'p_state': p_state,
        'p_trade_date': p_trade_date
    }
 
    $.ajax({
        url: '/product/change_state_product_confirm',
        method: 'POST',
        data:  msgDto,
        dataType: 'json',
        success: function(data) {
            console.log('changeAuction() COMMUNICATION SUCCESS!!');

           location.href = "/product/list_my_product_form"
        },
        error: function() {
            console.log('changeAuction() COMMUNICATION ERROR!!');
            
        },
        complete: function() {
            console.log('changeAuction() COMMUNICATION COMPLETE!!');
    

        }

    });


}


const changeCategory = (e) => {
    console.log('changeCategory()');

    let p_no = $(e.target).closest('tr').find('td:first-child').text();
    let p_category = $(e.target).closest('tr').find('input[name="category"]').val();
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

function filterByCategory(event) {
    const selectedCategory = event.target.value;
    const selectedState = document.querySelector('select[name="state"]').value;
    const url = `/product/list_my_product_form?category=${selectedCategory || ''}&state=${selectedState}&page=1`;
    window.location.href = url;
}

function filterByState(event) {
    const selectedState = event.target.value;
    const selectedCategory = document.querySelector('select[name="category"]').value;
    const url = `/product/list_my_product_form?category=${selectedCategory}&state=${selectedState || ''}&page=1`;
    window.location.href = url;
}

function filterByCategoryForSale(event) {
    const selectedCategory = event.target.value;
    const url = `/product/list_sale_product_form?category=${selectedCategory || ''}&page=1`;
    window.location.href = url;
}

// function startChat() {
//     console.log('startChat()');

//     let form = document.test;
//     form.submit();

// }
