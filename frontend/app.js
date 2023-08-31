const path = require('path');
const express = require('express');

const app = express();

app.disable('x-powered-by');

// Serve static files from the current directory
app.use(express.static(path.join(__dirname, './')));

const port = 9000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
