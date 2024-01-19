const express = require('express');
const path = require('path');
const { readFileSync, writeFileSync, existsSync } = require('fs');
const bodyParser = require('body-parser');
const http = require('http');
var dialog = require('dialog');

const default_data = 
{
  'records': [],
  'providers': []
};

const MINUTE = 60 * 1000;

setInterval(async function()
{
  const data = readData();
  http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) 
  {
    resp.on('data', function(ip) 
    {
      data.records.forEach(record =>
      {
        console.log(`Updating ${record.name} with ${ip}`);
        const url = record.url.replace('$IP', ip);

        fetch(url).then(response => response.text()).then(text => console.log(text));
      });
    });
  });
}, MINUTE * 10);

class Provider
{
  constructor(name, url, params)
  {
    this.name = name;
    this.url = url;
    this.params = params;
  }
}

class Record
{
  constructor(name, url)
  {
    this.name = name;
    this.url = url;
  }
}

const app = express();
const port = 80;
const data_file = 'dns.json';

function createDataFileIfNotExists()
{
  if (!existsSync(data_file))
  {
    writeFileSync(data_file, "", {flag: 'wx'});
  }
}

createDataFileIfNotExists();

function readData()
{
  const data = readFileSync(data_file);
  if (data.length == 0) 
  {
    writeData(default_data);
    return default_data;
  }
  return JSON.parse(data);
}

function writeData(data)
{
  writeFileSync(data_file, JSON.stringify(data));
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.get('/dns-records', (req, res) =>
{
  res.type('application/json');

  const data = readData();
  res.send(data.records);
});

app.get('/dns-providers', (req, res) =>
{
  res.type('application/json');

  const data = readData();
  res.send(data.providers);
});

app.post('/dns-providers/add', (req, res) =>
{
  res.type('application/json');

  const name = req.body.name;
  const url = req.body.url;
  const params = req.body.params;

  const provider = new Provider(name, url, params);

  let data = readData();

  data.providers.forEach(p =>
  {
    if (p.name !== provider.name)
    {
      data.providers.push(provider);
      writeData(data);
    }
  });

  if (data.providers.length === 0)
  {
    data.providers.push(provider);
    writeData(data);
  }

  res.status(201).send({'status': 'success'});
});

function getProviderByName(name)
{
  const data = readData();
  return data.providers.find(provider => provider.name === name);
}

app.post('/dns-records/add', (req, res) =>
{
  res.type('application/json');

  const data = readData();
  const name = req.body.name;
  const provider_name = req.body.provider;
  const params = req.body.params;

  console.log('test', name, provider_name, params);

  let provider = getProviderByName(provider_name);

  let url = provider.url;
  provider.params.forEach(param =>
  {
    url = url.replace(`[${param}]`, params[param]);
  });

  let record = new Record(name, url);
  data.records.push(record);
  writeData(data);

  res.send({'status': 'success'});
});

app.use((req, res) => 
{
  res.redirect('/');
});

app.listen(port, () => 
{
  const port_text = port == 80 ? '' : `:${port}`;
  console.log(`App Hosted on http://localhost${port_text}
              http://127.0.0.1${port_text}`);
              
  require('child_process').exec(`start http://localhost${port_text}/`);
});