const express = require('express');
const app = express();

app.get('/', (req, res) => {
  return res.json({
    message: "<h1>Welcome</h1><p>This is Express</p>",
    status: "success"
  });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
