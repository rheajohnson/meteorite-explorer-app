const express = require('express');
const graphqlHTTP = require('express-graphql');
const cors = require('cors');
const schema = require('./schema')
const path = require('path');

const app = express();

// Allow cross-origin
app.use(cors());
 
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.send('hello world')
  })

const PORT = process.env.PORT || 5000;
 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})