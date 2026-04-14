import fs from 'fs';

export async function getProjects(req, res, db) {
    const query = "SELECT * FROM projects"
    const result = await db.query(query)

    console.log(result.rows);

    const flash = req.session.flash
    delete req.session.flash

    res.render("form", {
        projects: result.rows,
        title: "",
        flash,
        user: req.session.user
    })
    console.log("SET FLASH:", req.session.flash);
}

export async function creatProjects(req, res, db) {
    try {
        const { title, description, tech } = req.body;

        const author_id = req.session.user.id;
        const image = req.file ? req.file.filename : null;

        const query = "INSERT INTO projects (title, description, image, tech, author_id ) VALUES ($1, $2, $3, $4, $5) RETURNING *";
        const values = [title, description, image, tech, author_id];
        const result = await db.query(query, values);



        req.flash('success', 'project di tambah')

        console.log("project created", result.rows[0]);
        res.redirect("/form-projects");

    } catch (error) {
        console.log("erorr");

    }
}

export async function showProject(req, res, db) {
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
        console.log('error cuy')
    }
}

// EDIT
export async function getEdit(req, res, db) {
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
}

export async function postEdit(req, res, db) {
    try {
        const { id } = req.params;

        const { title, description } = req.body;

        let image;
        if (req.file) {
            image = req.file.filename;
        }else {
            const result = await db.query('SELECT image FROM projects WHERE id =$1', [id]);
            image = result.rows[0].image;
        }



        const query = `
            UPDATE projects
            SET title = $1, description = $2, image = $3
            WHERE id = $4 AND author_id = $5
            RETURNING *
          `;

        const values = [title, description, image, id, req.session.user.id];
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
}

// delet

export async function projectDelet(req, res, db) {
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

        const project = result.rows[0];

        if (project.image) {
            const imagePath = `./public/upload/${project.image}`;
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
                console.log('image di hapus:', project.image);

            }
        }
    

        req.flash('success', 'projects di hapus')

        res.redirect('/form-projects')
    } catch (error) {
        res.send('error')
    }
}

