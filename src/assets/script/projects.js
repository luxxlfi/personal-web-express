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
        const { title, description, image, tech } = req.body;

        const author_id = req.session.user.id;

        const query = "INSERT INTO projects (title, description, image, tech, author_id ) VALUES ($1, $2, $3, $4, $5) RETURNING *";
        const values = [title, description, image, tech, author_id];
        const result = await db.query(query, values);

     

        req.flash('success', 'project di tambah')

        console.log("project created", result.rows[0]);
        res.redirect("/form-projects");

    } catch (erorr) {
        console.log("erorr");

    }
}

