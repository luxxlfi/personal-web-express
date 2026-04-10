export async function getProjects(req, res, db) {
    const query = "SELECT * FROM projects"
    const result = await db.query(query)

    console.log(result.rows);

    const flash = req.session.flash
    delete req.session.flash

    res.render("form", {
        projects: result.rows,
        title: "",
        flash
    })
    console.log("SET FLASH:", req.session.flash);

}
export async function creatProjects(req, res, db) {
    try {
        const { title, description, image, tech } = req.body;

        const query = "INSERT INTO projects (title, description, image, tech) VALUES ($1, $2, $3, $4) RETURNING *";
        const values = [title, description, image, tech];
        const result = await db.query(query, values);

        req.session.flash = {
            type: "success",
            message: "Project di tambahkan"
        };

        console.log("project created", result.rows[0]);
        res.redirect("/form-projects");

    } catch (erorr) {
        console.log("erorr");

    }
}

