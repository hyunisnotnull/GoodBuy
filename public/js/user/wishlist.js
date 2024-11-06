$(document).on('click', '.cancel-btn', function(e) {
    e.preventDefault();

    if (confirm('찜 취소를 하시겠습니까?')) {
        const productNo = $(this).data('product-no');

        $.ajax({
            url: '/user/cancel_wishlist',
            method: 'POST',
            data: { productNo: productNo },
            success: function(response) {
                console.log(response);

                if (response.success) {
                    alert(response.message); 
                    location.reload(); 

                } else {
                    alert('찜 취소 실패');

                }
            },
            error: function() {
                alert('오류가 발생했습니다.');

            }
        });
    }
});
