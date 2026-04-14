import express from 'express'
import { engine } from 'express-handlebars';
import { db } from "./config/database.js";


import { getProjects, creatProjects, showProject, getEdit, postEdit, projectDelet } from './src/assets/script/projects.js';
import hbs from 'hbs'

import session from 'express-session';
import { createUser, login } from './src/assets/script/auth.js';

import flash from 'connect-flash';

import { isAuthenticated } from './middleware/auth.js';

import upload from "./middleware/multer.js";
import { handleUploadError } from './middleware/uploadError.js'


const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));

app.set('view engine', 'hbs');
app.set('views', './src/views');

// session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 40,
    httpOnly: true
  }
}
));

// flash setup
app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.success = req.flash('success')[0];
  res.locals.error = req.flash('error')[0];
  next()
})



// partials
hbs.registerPartials("./src/views/partials/")

// midleware
app.use('/assets', express.static('./src/assets'))

// title

app.get('/myHome', (req, res) => {
  console.log("MASUK HOME");

  res.render('home', {
    title: 'home page',
  })
})

app.get('/my-services', (req, res) => {
  res.render('services', {
    title: 'services page'
  })
})

app.get('/contac-me', (req, res) => {
  res.render('contac', {
    title: 'contac page'
  })
})

app.get('/about-me', (req, res) => {
  res.render('about', {
    title: 'aboutme page'
  })
})

// register

app.get('/register', (req, res) => {
  res.render('register', {
    title: 'register page'
  })
})
app.post('/register', (req, res) => createUser(req, res, db))

app.get('/login', (req, res) => {
  res.render('login', {
    title: 'login page',
  })
})

app.post('/login', (req, res) => login(req, res, db));

app.use(express.urlencoded({ extended: true }));

// PROJECT

let projects = []
let projectId = 1

app.get('/form-projects', async (req, res) => getProjects(req, res, db))
app.post('/form-projects', isAuthenticated, handleUploadError(upload.single('image')), (req, res) => creatProjects(req, res, db))
app.get('/show/:id', async (req, res) => showProject(req, res, db))
app.get('/edit/:id', async (req, res) => getEdit(req, res, db))
app.post('/edit/:id', isAuthenticated, handleUploadError(upload.single('image')), (req, res) => postEdit(req, res, db))
app.post('/delet/:id', async (req, res) => projectDelet(req, res, db))


// massage
app.post('/massage', (req, res) => {
  const { nama, gmail, phone, massage } = req.body
  console.log('Received: ');

  console.log('Name :', nama);
  console.log('gmail:', gmail);
  console.log('NoHp: ', phone);
  console.log('massage:', massage);

  res.redirect('/about-me')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

