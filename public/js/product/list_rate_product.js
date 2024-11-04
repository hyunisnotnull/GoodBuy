document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('priceChart');

    if (!ctx) {
        console.error("Canvas 요소를 찾을 수 없습니다.");
        return;
    }

    console.log("Sale Prices:", salePrices);
    console.log("Registered Prices:", registeredPrices);

    // 날짜 레이블 생성
    const labels = [];
    if (registeredPrices.length > 0) {
        registeredPrices.forEach(price => {
            if (!labels.includes(price.date)) labels.push(price.date);
        });
    }
    if (salePrices.length > 0) {
        salePrices.forEach(price => {
            if (!labels.includes(price.date)) labels.push(price.date);
        });
    }
    labels.reverse(); // 차트에 날짜가 역순으로 표시되도록

    const registeredData = labels.map(date => {
        const price = registeredPrices.find(p => p.date === date);
        return price ? parseInt(price.averagePrice) : null;
    });

    const saleData = labels.map(date => {
        const price = salePrices.find(p => p.date === date);
        return price ? parseInt(price.averagePrice) : null;
    });

    const chartData = {
        labels: labels,
        datasets: []
    };

    // 등록가 데이터가 있는 경우
    if (registeredData.some(data => data !== null)) {
        chartData.datasets.push({
            label: '등록가',
            data: registeredData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        });
    }

    // 판매가 데이터가 있는 경우
    if (saleData.some(data => data !== null)) {
        chartData.datasets.push({
            label: '판매가',
            data: saleData,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        });
    }

    // 차트 렌더링
    if (chartData.datasets.length > 0) {
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
    } else {
        console.log("등록가와 판매가 데이터가 없습니다.");
    }
});
