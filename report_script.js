const urlParams = new URLSearchParams(window.location.search);
const coin = urlParams.get('coin');

async function loadReport() {
  document.getElementById('coinTitle').innerText = `${coin.charAt(0).toUpperCase() + coin.slice(1)} Report`;

  // Price
  try {
    const priceRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`);
    const priceData = await priceRes.json();
    document.getElementById('price').innerText = `💰 Current Price: $${priceData[coin].usd}`;
  } catch {
    document.getElementById('price').innerText = "Error fetching price.";
  }

  // Price Analysis
  try {
    const analysisRes = await fetch(`https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=7`);
    const analysisData = await analysisRes.json();
    const prices = analysisData.prices;
    const startPrice = prices[0][1];
    const endPrice = prices[prices.length - 1][1];
    const change = ((endPrice - startPrice) / startPrice * 100).toFixed(2);
    const trend = change > 0 ? "📈 Uptrend" : (change < 0 ? "📉 Downtrend" : "➡️ Stable");
    document.getElementById('analysis').innerText = `Start Price: $${startPrice.toFixed(2)} ➔ End Price: $${endPrice.toFixed(2)} (${change}%)\nTrend: ${trend}`;
  } catch {
    document.getElementById('analysis').innerText = "Error analyzing price.";
  }

  // News
  try {
    const newsRes = await fetch(`https://cryptopanic.com/api/v1/posts/?auth_token=YOUR_CRYPTOPANIC_API_KEY&currencies=${coin.toUpperCase()}&public=true`);
    const newsData = await newsRes.json();
    const articles = newsData.results.slice(0, 5).map(a => `- ${a.title}`).join("<br>");
    document.getElementById('news').innerHTML = articles || "No fresh news.";
  } catch {
    document.getElementById('news').innerText = "Error loading news.";
  }

  // Price Chart
  const priceChartRes = await fetch(`https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=7`);
  const priceChartData = await priceChartRes.json();
  const ctx = document.createElement('canvas');
  ctx.width = 400;
  ctx.height = 200;
  document.getElementById('priceChart').appendChild(ctx);

  const labels = priceChartData.prices.map(p => new Date(p[0]).toLocaleDateString());
  const prices = priceChartData.prices.map(p => p[1]);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: `${coin.toUpperCase()} Price`,
        data: prices,
        borderColor: '#00ffcc',
        backgroundColor: 'transparent',
        tension: 0.3,
      }]
    }
  });

  // Candle Chart
  const candleDiv = document.createElement('div');
  candleDiv.id = "tradingview-widget";
  document.getElementById('candleChart').appendChild(candleDiv);

  const tvScript = document.createElement('script');
  tvScript.src = 'https://s3.tradingview.com/tv.js';
  tvScript.onload = () => {
    new TradingView.widget({
      container_id: "tradingview-widget",
      width: "100%",
      height: 400,
      symbol: `BINANCE:${coin.toUpperCase()}USDT`,
      interval: "60",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      toolbar_bg: "#0d0d2b",
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      studies: ["RSI@tv-basicstudies"],
      details: true
    });
  };
  document.body.appendChild(tvScript);
}

loadReport();
