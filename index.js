const express = require('express');

const hbs = require('hbs');
const app = express()
const port = 3000

app.set('view engine', 'hbs');
app.set('views','./src/views')

// partials

hbs.registerPartials("./src/views/partials")

// midleware
app.use('/assets', express.static('./src/assets'))


app.get('/myHome', (req, res) => {
  res.render('home')
})

app.get('/my-services', (req, res) => {
  res.render('services')
})  

app.get('/contac-me', (req, res) => {
  res.render('contac')
}) 

app.get('/about-my', (req, res) => {
  res.render('about')
}) 

app.get('/form', (req, res) => {
  res.render('form')
})  



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
