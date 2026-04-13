import express from 'express'
import { engine } from 'express-handlebars';
import { db } from "./config/database.js";


import { getProjects, creatProjects } from './src/assets/script/projects.js';
import hbs from 'hbs'

import session from 'express-session';
import { createUser, login } from './src/assets/script/auth.js';

import flash from 'connect-flash';

import { isAuthenticated } from './middleware/auth.js';



const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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

  // const flash = req.session.flash
  // delete req.session.flash

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

app.use(express.urlencoded({ extended: true }));

// PROJECT

let projects = []
let projectId = 1

app.get('/form-projects', async (req, res) => getProjects(req, res, db))
app.post('/form-projects', isAuthenticated, (req, res) => creatProjects(req, res, db))

app.get('/show/:id', async (req, res) => {
  console.log('nah ada nih');

  try {
    const { id } = req.params
    const query = "SELECT * FROM projects WHERE id = $1";
    const result = await db.query(query, [id]);

    const project = result.rows[0];

    if (!project) {
      return res.send('project tidak di temukan')
    }
    res.render('show', { project })

  } catch (erorr) {

  }
})

app.get('/edit/:id', async (req, res) => {
  try {
    const { id } = req.params
    const user = req.session.user.id

    const query = `
      SELECT * FROM projects
      WHERE id = $1 AND author_id = $2
    `
    const result = await db.query(query, [id, user]);
    const project = result.rows[0];

    if (!project) {
      return res.send('project tidak di temukan')
    }
    res.render('edit', { project })

  } catch (erorr) {
    res.send("eror cuy")
  }

})

app.post('/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { title, description } = req.body;

    const query = `
        UPDATE projects
        SET title = $1, description = $2
        WHERE id = $3 AND author_id = $4
        RETURNING *
      `;

    const values = [title, description, id, req.session.user.id];
    const result = await db.query(query, values);


    if (result.rows.length == 0) {


      req.flash('error', 'tidak d temukan')
      // return res.send('projects tidak di temukan');
    }


    req.flash('success', 'projects di edit')

    res.redirect('/form-projects')
  } catch (error) {
    res.send("eror cuy")
  }
});

app.post('/delet/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      DELETE FROM projects
      WHERE id = $1 AND author_id = $2
      RETURNING *
    `
    const result = await db.query(query, [id, req.session.user.id]);

    if (result.rows.length === 0) {
      
      req.flash('error', 'project tidak di temukan')

      return res.send('project tidak di temukan');
    }

  
    req.flash('success', 'projects di hapus')

    res.redirect('/form-projects')
  } catch (error) {
    res.send('error')
  }

});


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