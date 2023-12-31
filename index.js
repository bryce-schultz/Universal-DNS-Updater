const express = require('express');
const path = require('path') ;


const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.post('/api', (req, res) =>
{
  res.send('POST request to the homepage');
});

app.use((req, res) => 
{
  res.type('text/plain');
  res.status(404);
  res.send('404 Not found');
});

app.listen(port, () => 
{
  console.log(`Example app listening on port ${port}`)
});