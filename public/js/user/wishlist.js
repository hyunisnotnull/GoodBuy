$(document).on('click', '.cancel-btn', function(e) {
    e.preventDefault();

    Swal.fire({
        title: '찜 취소 확인',
        text: '찜을 취소하시겠습니까?',
        icon: 'warning',
        showCancelButton: true,  
        confirmButtonText: '확인',
        cancelButtonText: '취소',
        reverseButtons: true      
    }).then((result) => {
        if (result.isConfirmed) {
            const productNo = $(this).data('product-no');

            $.ajax({
                url: '/user/cancel_wishlist',
                method: 'POST',
                data: { productNo: productNo },
                success: function(response) {
                    console.log(response);

                    if (response.success) {
                        Swal.fire({
                            title: '찜 취소 성공',
                            text: response.message,
                            icon: 'success',
                            confirmButtonText: '확인'
                        }).then(() => {
                            // 페이지 새로고침
                            location.reload();
                        });
                    } else {
                        Swal.fire({
                            title: '찜 취소 실패',
                            text: response.message || '찜 취소에 실패하셨습니다.',
                            icon: 'error',
                            confirmButtonText: '확인'
                        });
                    }
                },
                error: function(xhr, status, error) {
                    Swal.fire({
                        title: '오류 발생',
                        text: '서버와의 통신에 실패하였습니다. 다시 시도해 주세요.',
                        icon: 'error',
                        confirmButtonText: '확인'
                    });
                }
            });
        }
    });
});
