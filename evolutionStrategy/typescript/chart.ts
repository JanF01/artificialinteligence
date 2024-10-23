
import * as http from 'http';

function serveChart(xArray: Array<number>,yArray: Array<number>,yPredicted: Array<number>){

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Chart.js Example</title>
          <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      </head>
      <body>
          <canvas id="myChart" width="800" height="400"></canvas>
          <script>
              const ctx = document.getElementById('myChart').getContext('2d');
              const myChart = new Chart(ctx, {
                  type: 'line',
                  data: {
                      labels: ${JSON.stringify(xArray)},
                        datasets: [{
                        label: 'Predicted Values',
                        data: ${JSON.stringify(yArray)},
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderWidth: 1,
                    }, {
                        label: 'Overlay Values',
                        data: ${JSON.stringify(yPredicted)},
                        borderColor: 'rgba(192, 56, 56, 1)',
                        backgroundColor: 'rgba(192, 56, 56, 0.2)',
                        borderWidth: 1,
                    }]
                  },
                  options: {
                      scales: {
                          y: {
                              beginAtZero: false,
                              min: -20,
                              max: 200  
                          }
                      }
                  }
              });
          </script>
      </body>
      </html>
    `);
  });

    const PORT = 8000;
    server.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}
export { serveChart };