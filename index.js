const express = require('express');

const server = express();

server.use(express.json());

const postRoutes = require('./router/router.js');


server.use('/api/posts', postRoutes);

server.get('/', (req, res) => {
    res.send('Hello Me')
})


const port = 8000

server.listen(port, () => console.log(`\n == API on port ${port} == \n`))

  