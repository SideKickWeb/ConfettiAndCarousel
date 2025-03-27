// Simple script to test the categories endpoint
import http from 'http';

const url = 'http://localhost:3000/api/products/categories';

http.get(url, (res) => {
  let data = '';

  // A chunk of data has been received
  res.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received
  res.on('end', () => {
    console.log("Status code:", res.statusCode);
    console.log("Response headers:", res.headers);
    try {
      const parsedData = JSON.parse(data);
      console.log("Parsed data:", JSON.stringify(parsedData, null, 2));
    } catch (e) {
      console.error("Error parsing JSON:", e);
      console.log("Raw data:", data);
    }
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});

console.log("Request sent to:", url); 