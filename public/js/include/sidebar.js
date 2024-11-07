// 상품 클릭 시 세션에 저장하고, 상품 정보를 받아와서 표시
document.querySelectorAll('.product-link').forEach(item => {
    item.addEventListener('click', function (event) {
        const productId = event.target.closest('.product-link').dataset.productId; // data-product-id 가져오기
        console.log('상품 ID:', productId);

        // 세션에 상품 ID 추가하고, 상품 정보를 받아오는 요청
        fetch('/product/get_product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId: productId })
        })
        .then(response => response.json())
        .then(data => {
            console.log('최근 본 상품 정보:', data.products); // 서버로부터 받은 상품 정보 확인

            // 상품 정보를 세션 스토리지에 저장
            let recentProducts = JSON.parse(sessionStorage.getItem('recentProducts')) || [];

            // 새로 본 상품을 맨 앞에 추가
            if (!recentProducts.some(product => product.productId === productId)) {
                recentProducts.unshift({
                    productId: productId,
                    productName: data.products[data.products.length - 1].productName, // 이름
                    productImage: data.products[data.products.length - 1].productImage, // 이미지
                    productOwnerId: data.products[data.products.length - 1].productOwnerId,
                    productPrice: data.products[data.products.length - 1].productPrice // 가격
                });

                // 최대 5개의 최근 본 상품만 저장
                if (recentProducts.length > 5) {
                    recentProducts.pop(); // 가장 오래된 상품 삭제 (맨 뒤에서 삭제)
                }
            }

            // 세션 스토리지에 저장
            sessionStorage.setItem('recentProducts', JSON.stringify(recentProducts));

            // 상품 상세 페이지로 이동
            window.location.href = event.target.closest('.product-link').href; // 이동
        })
        .catch(error => {
            console.error('상품 정보를 불러오는 중 오류가 발생했습니다:', error);
        });
    });
});

window.addEventListener('DOMContentLoaded', function () {
    // 세션 스토리지에서 최근 본 상품 정보를 가져오기
    let recentProducts = JSON.parse(sessionStorage.getItem('recentProducts')) || [];
    let currentIndex = 0;

    // 최근 본 상품을 사이드바에 표시
    const recentProductsContainer = document.querySelector('.recent-products');
    const pageInfo = document.querySelector('.page-info'); // 페이지 번호 표시용 요소
    const topButton = document.querySelector('.top-button'); // Top 버튼

    // 페이지네이션 텍스트 처리 함수
    function updatePaginationText() {
        // 페이지 번호 표시
        if (recentProducts.length > 0) {
            pageInfo.textContent = `${currentIndex + 1} / ${recentProducts.length}`;
        } else {
            pageInfo.textContent = '';  // 상품이 없으면 페이지 번호 숨김
        }
    }

    // 함수: 최근 본 상품을 화면에 표시
    function displayRecentProducts() {
        recentProductsContainer.innerHTML = ''; // 기존 내용 초기화

        if (recentProducts.length > 0) {
            const product = recentProducts[currentIndex];

            const productItem = document.createElement('div');
            productItem.classList.add('product-item');
            productItem.innerHTML = `
                <a href="/product/detail_product_form?p_no=${product.productId}">
                    <img src="/${product.productOwnerId}/${product.productImage}" alt="${product.productName}" />
                </a>
                <div class="product-info">
                    <p>${product.productName}</p>
                    <p>${product.productPrice.toLocaleString().concat('원')}</p>
                </div>
            `;

            recentProductsContainer.appendChild(productItem);
        } else {
            recentProductsContainer.innerHTML = '<p>최근 본 상품이 없습니다.</p>';
        }

        // 페이지 네비게이션 텍스트 업데이트
        updatePaginationText();
    }

    // 이전 페이지로 이동
    function goToPrevPage() {
        if (currentIndex > 0) {
            currentIndex--;  // 이전 상품으로 이동
            displayRecentProducts();  // 상품 업데이트
        }
    }

    // 다음 페이지로 이동
    function goToNextPage() {
        if (currentIndex < recentProducts.length - 1) {
            currentIndex++;  // 다음 상품으로 이동
        } else {
            currentIndex = 0;  // 마지막 상품에서 다음을 누르면 첫 번째 상품으로 이동
        }
            displayRecentProducts();  // 상품 업데이트
    }

    // Top 버튼 클릭 시
    topButton.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' }); // 페이지 상단으로 스크롤 이동
    });

    // 이전, 다음 네비게이션 링크 클릭 시
    document.querySelector('.prev-text').addEventListener('click', goToPrevPage);
    document.querySelector('.next-text').addEventListener('click', goToNextPage);

    // 처음 로드 시 최근 본 상품 표시
    displayRecentProducts();
});
