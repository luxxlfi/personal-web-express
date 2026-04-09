const express = require('express');

const hbs = require('hbs');
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'hbs');
app.set('views', './src/views')

// partials

hbs.registerPartials("./src/views/partials")

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


app.get('/form-projects', async (req, res) => {
  try {
    res.render('form', {
      projects: projects
    });
  } catch (error) {
    console.log('error', error);
    res.status(500).send('erorr loading projects');
  }
});

app.post('/form-projects', (req, res) => {
  const { title, description, select } = req.body;

  if (!title || !description) {
    return res.status(400).send('form blum di isi')
  }
  const newProject = {
    id: projectId++,
    title,
    description,
    select
  };

  projects.push(newProject)
  console.log('project di tambahkan', newProject);


  console.log(title, description);
  res.redirect('/form-projects')

})

app.get('/show/:id', (req, res) => {
  try {
    const { id } = req.params
    const projectId = parseInt(id)
    const project = projects.find(p => p.id === projectId)

    if (!project) {
      return res.send('project tidak di temukan')
    }
    res.render('show', { project })

  } catch (erorr) {
  }
})

app.get('/edit/:id', (req, res) => {
  try {
    const { id } = req.params
    const projectId = parseInt(id)
    const project = projects.find(p => p.id === projectId)

    if (!project) {
      return res.send('project tidak di temukan')
    }
    res.render('edit', { project })

  } catch (erorr) {
  }
})

app.post('/edit/:id', (req, res) => {
  try {
    const { id } = req.params;
    const projectId = parseInt(id);

    const { title, description, select } = req.body;

    const index = projects.findIndex(p => p.id === projectId);

    if (index == -1) {
      return res.send('projects tidak di temukan');
    }

    projects[index] = {
      id: projectId,
      title,
      description,
      select
    };

    res.redirect('/form-projects')

  } catch (erorr) {
  }

})

app.post('/delet/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const projectId = parseInt(id);

    const project = projects.find(p => p.id === projectId);

    if (!project) {
      return res.status(400).send('project tidak di temukan');
    }

    projects = projects.filter(p => p.id !== projectId);

    res.redirect('/form-projects')
  }catch (error) {
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



