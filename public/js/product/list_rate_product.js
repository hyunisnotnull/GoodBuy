document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('priceChart');

    if (!ctx) {
        console.error("Canvas 요소를 찾을 수 없습니다.");
        return;
    }

    console.log("Sale Prices:", salePrices);
    console.log("Registered Prices:", registeredPrices);

    // 날짜 레이블을 모두 합친 후 중복 제거
    const allDates = new Set();

    // 등록가 시세에서 날짜 추가
    registeredPrices.forEach(price => allDates.add(price.date));

    // 판매가 시세에서 날짜 추가
    salePrices.forEach(price => allDates.add(price.date));

    // 날짜를 오름차순으로 정렬 (최신 날짜가 맨 뒤에 오도록)
    const sortedLabels = Array.from(allDates).sort((a, b) => new Date(a) - new Date(b));

    // 등록가와 판매가 데이터를 해당 날짜에 맞춰 매핑 (이전 가격 유지)
    let previousRegisteredPrice = null;
    const registeredData = sortedLabels.map(date => {
        const price = registeredPrices.find(p => p.date === date);
        if (price) {
            previousRegisteredPrice = parseInt(price.averagePrice);
        }
        return previousRegisteredPrice !== null ? previousRegisteredPrice : null;
    });

    let previousSalePrice = null;
    const saleData = sortedLabels.map(date => {
        const price = salePrices.find(p => p.date === date);
        if (price) {
            previousSalePrice = parseInt(price.averagePrice);
        }
        return previousSalePrice !== null ? previousSalePrice : null;
    });

    // 만약 마지막 날짜까지 데이터가 없으면, 마지막 값으로 채워줌
    if (previousRegisteredPrice !== null) {
        // 등록가 데이터가 비어있으면 마지막 등록가로 채워줌
        while (registeredData.length < sortedLabels.length) {
            registeredData.push(previousRegisteredPrice);
        }
    }
    
    if (previousSalePrice !== null) {
        // 판매가 데이터가 비어있으면 마지막 판매가로 채워줌
        while (saleData.length < sortedLabels.length) {
            saleData.push(previousSalePrice);
        }
    }

    // 차트 데이터 준비
    const chartData = {
        labels: sortedLabels,  // 정렬된 날짜를 x축 레이블로 설정
        datasets: []
    };

    // 등록가 데이터가 있으면 추가
    if (registeredData.some(data => data !== null)) {
        chartData.datasets.push({
            label: '등록가',
            data: registeredData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        });
    }

    // 판매가 데이터가 있으면 추가
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
                    },
                    x: {
                        ticks: {
                            autoSkip: true,  // 날짜가 많으면 자동으로 스킵

                        }
                    }
                }
            }
        });
    } else {
        console.log("등록가와 판매가 데이터가 없습니다.");
    }
});
