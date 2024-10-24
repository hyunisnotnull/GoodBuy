document.addEventListener('DOMContentLoaded', function () {
    const sliders = document.querySelectorAll('.banner-slider, .auction-slider, .product-slider');

    sliders.forEach(slider => {
        const prevButton = slider.querySelector('.prev');
        const nextButton = slider.querySelector('.next');
        const list = slider.querySelector('.banner-list, .auction-list, .product-list');
        const items = list.children;
        let currentIndex = 0;

        function updateSlider() {
            Array.from(items).forEach((item, index) => {
                item.style.display = index === currentIndex ? 'block' : 'none';
            });
        }

        nextButton.addEventListener('click', function () {
            currentIndex = (currentIndex + 1) % items.length;
            updateSlider();
        });

        prevButton.addEventListener('click', function () {
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            updateSlider();
        });

        // 자동 슬라이드 기능 (5초마다)
        setInterval(() => {
            currentIndex = (currentIndex + 1) % items.length;
            updateSlider();
        }, 5000);

        updateSlider();
    });
});
