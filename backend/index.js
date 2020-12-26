require('elastic-apm-node').start({
  // Override service name from package.json
  // Allowed characters: a-z, A-Z, 0-9, -, _, and space
  serviceName: 'backend',

  // Set custom APM Server URL (default: http://localhost:8200)
  serverUrl: process.env.APM_SERVER_URL || 'http://localhost:8200',
});
const express = require('express')
const app = express()
const port = 3000
const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: process.env.ES_SERVER_URL || 'http://localhost:9200' })
const cors = require('cors')

app.use(express.json())
app.use(cors())

app.get('/countries', async (req, res) => {
  const result = (await client.search({
    index: 'wine',
    typed_keys: true,
    size: 1000,
    body: {
      aggs: {
        "country": {
          "terms": {
            "field": "country.keyword"
          }
        }
      },
      sort:[
        { "country.keyword": {"order": "asc"} }
      ],
      collapse: {
        field: "country.keyword"
      }
    }
  }));
  res.json(result.body.hits.hits.map(function (value) {
    return value.sort[0]
  }))
});

app.post('/wine/country', async (req, res) => {
  const result = await client.search({
    index: 'wine',
    size: 1000,
    body: {
      query: {
        match: { country: req.body.country }
      }
    }
  })
  res.send(result["body"]["hits"])
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})