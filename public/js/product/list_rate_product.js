document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('priceChart');

    if (!ctx) {
        console.error("Canvas 요소를 찾을 수 없습니다.");
        return;
    }

    console.log("Sale Prices:", salePrices);
    console.log("Registered Prices:", registeredPrices);

    // 날짜 레이블 생성
    const labels = salePrices.map(price => price.date).reverse();
    const registeredData = registeredPrices.map(price => parseFloat(price.averagePrice)).reverse();
    const saleData = salePrices.map(price => parseFloat(price.averagePrice)).reverse();

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: '등록가',
                data: registeredData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: '판매가',
                data: saleData,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }
        ]
    };

    // 차트 렌더링 함수
    function renderChart() {
        const priceChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    renderChart();
});
