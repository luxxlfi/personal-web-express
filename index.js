import express from 'express'
import { engine } from 'express-handlebars';
import { db } from "./config/database.js";

import { getProjects, creatProjects } from './src/assets/script/projects.js';
import hbs from 'hbs'

import session from 'express-session';




// const hbs = require('hbs');
// const { getProjects } = require('./src/assets/script/projects.js');
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'hbs');
app.set('views', './src/views');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}
));


// partials

hbs.registerPartials("./src/views/partials/")

// midleware
app.use('/assets', express.static('./src/assets'))


// navbar
app.get('/myHome', (req, res) => {
  res.render('home', {
    title: 'home page'
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



let projects = []
let projectId = 1

app.get('/form-projects', async (req, res) => getProjects(req, res, db))

// app.get('/form-projects', async (req, res) => {
//   try {
//     res.render('form', {
//       projects: projects
//     });
//   } catch (error) {
//     console.log('error', error);
//     res.status(500).send('erorr loading projects');
//   }
// });

// app.post('/form-projects', (req, res) => {
//   const { title, description, select } = req.body;

//   if (!title || !description) {
//     return res.status(400).send('form blum di isi')
//   }
//   const newProject = {
//     id: projectId++,
//     title,
//     description,
//     select
//   };

//   projects.push(newProject)
//   console.log('project di tambahkan', newProject);


//   console.log(title, description);
//   res.redirect('/form-projects')

// })

app.post('/form-projects', async (req, res) => creatProjects(req, res, db))

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

    const query = "SELECT * FROM projects WHERE id = $1";
    const result = await db.query(query, [id]);
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
        WHERE id = $3
        RETURNING *
      `;

    const values = [title, description, id];
    const result = await db.query(query, values);


    if (result.rows.length == 0) {
      req.session.flash = {
        type: "success",
        message: "Project tidak ada"
      };
      // return res.send('projects tidak di temukan');
    }

    req.session.flash = {
      type: "success",
      message: "Project berhasil di edit"
    };

    res.redirect('/form-projects')

  } catch (erorr) {
    res.send("eror cuy")
  }


});

app.post('/delet/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = "DELETE FROM projects WHERE id = $1 RETURNING*";
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      req.session.flash = {
        type: "unsuccess",
        message: "Project tidak di temukan"
      };
      return send('project tidak di temukan');
    }

    req.session.flash = {
      type: "success",
      message: "Project berhasil di hapus"
    };

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



