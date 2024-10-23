"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveChart = serveChart;
var http = require("http");
function serveChart(xArray, yArray, yPredicted) {
    var server = http.createServer(function (req, res) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end("\n      <!DOCTYPE html>\n      <html lang=\"en\">\n      <head>\n          <meta charset=\"UTF-8\">\n          <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n          <title>Chart.js Example</title>\n          <script src=\"https://cdn.jsdelivr.net/npm/chart.js\"></script>\n      </head>\n      <body>\n          <canvas id=\"myChart\" width=\"800\" height=\"400\"></canvas>\n          <script>\n              const ctx = document.getElementById('myChart').getContext('2d');\n              const myChart = new Chart(ctx, {\n                  type: 'line',\n                  data: {\n                      labels: ".concat(JSON.stringify(xArray), ",\n                        datasets: [{\n                        label: 'Predicted Values',\n                        data: ").concat(JSON.stringify(yArray), ",\n                        borderColor: 'rgba(75, 192, 192, 1)',\n                        backgroundColor: 'rgba(75, 192, 192, 0.2)',\n                        borderWidth: 1,\n                    }, {\n                        label: 'Overlay Values',\n                        data: ").concat(JSON.stringify(yPredicted), ",\n                        borderColor: 'rgba(192, 56, 56, 1)',\n                        backgroundColor: 'rgba(192, 56, 56, 0.2)',\n                        borderWidth: 1,\n                    }]\n                  },\n                  options: {\n                      scales: {\n                          y: {\n                              beginAtZero: false,\n                              min: -20,\n                              max: 200  \n                          }\n                      }\n                  }\n              });\n          </script>\n      </body>\n      </html>\n    "));
    });
    var PORT = 8000;
    server.listen(PORT, function () {
        console.log("Server running at http://localhost:".concat(PORT));
    });
}
