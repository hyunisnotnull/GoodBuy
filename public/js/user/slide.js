document.addEventListener('DOMContentLoaded', function () {
    // 배너, 경매, 상품 슬라이더 모두 선택
    const bannerSliders = document.querySelectorAll('.banner-slider');
    const auctionSliders = document.querySelectorAll('.auction-slider');
    const productSliders = document.querySelectorAll('.product-slider');

    // 슬라이더 업데이트 함수 (각각의 슬라이더에 맞게)
    function setupSlider(slider, groupSize) {
        const prevButton = slider.querySelector('.prev');
        const nextButton = slider.querySelector('.next');
        const list = slider.querySelector('.banner-list, .auction-list, .product-list');
        const items = Array.from(list.children);  // 모든 항목을 배열로 변환
        let currentIndex = 0;  // 슬라이드 초기 인덱스 설정

        // 슬라이드를 업데이트 하는 함수
        function updateSlider() {
            const totalSlides = Math.ceil(items.length / groupSize);  // 전체 슬라이드 개수 계산
            const slideIndex = currentIndex % totalSlides;  // 현재 슬라이드 인덱스

            // 모든 항목을 숨김
            items.forEach((item, index) => {
                item.style.display = 'none';
            });

            // 3개씩 묶어서 표시
            const groupStartIndex = slideIndex * groupSize;  // 그룹의 시작 인덱스
            for (let i = groupStartIndex; i < groupStartIndex + groupSize && i < items.length; i++) {
                items[i].style.display = 'block';  // 3개의 아이템을 보이게 함
            }
        }

        // "다음" 버튼 클릭 시 슬라이드 이동
        nextButton.addEventListener('click', function () {
            currentIndex = (currentIndex + 1) % Math.ceil(items.length / groupSize);
            updateSlider();
        });

        // "이전" 버튼 클릭 시 슬라이드 이동
        prevButton.addEventListener('click', function () {
            currentIndex = (currentIndex - 1 + Math.ceil(items.length / groupSize)) % Math.ceil(items.length / groupSize);
            updateSlider();
        });

        // 자동 슬라이드 기능 (5초마다)
        setInterval(() => {
            currentIndex = (currentIndex + 1) % Math.ceil(items.length / groupSize);
            updateSlider();
        }, 3000);

        updateSlider();  // 초기 상태 설정
    }

    // 배너는 1개씩 슬라이드
    bannerSliders.forEach(slider => setupSlider(slider, 1));

    // 경매와 상품은 3개씩 슬라이드
    auctionSliders.forEach(slider => setupSlider(slider, 3));
    productSliders.forEach(slider => setupSlider(slider, 3));
});
