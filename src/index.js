const express = require('express')
const mongoose = require('mongoose')
const routes = require('./routes')
const cors = require('cors')

const app =  express()

mongoose.connect('mongodb://root:root@cluster0-shard-00-00-04pxy.mongodb.net:27017,cluster0-shard-00-01-04pxy.mongodb.net:27017,cluster0-shard-00-02-04pxy.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(()=>{
    console.log("conectado ao banco");
    
}).catch((err)=>{
    console.error(err);
    
})

app.use(cors())
app.use(express.json())
app.use(routes)

//query params: req.query
//Route params: req.params
//body: req.bodyy


app.listen(3333, ()=>{
    console.log("server on");
    
})