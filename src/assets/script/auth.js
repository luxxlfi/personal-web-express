import bcrypt from 'bcrypt';
// import flash from "express-flash";

export async function createUser(req, res, db) {
    try {
        const { name, email, password } = req.body;

        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const query = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *";
        const values = [name, email, hashedPassword];
        const result = await db.query(query, values);

      
        req.flash('success', 'success')

        console.log("user di buat: ", result.rows[0]);
        res.redirect("/login");
    } catch (error) {
        req.flash('error', 'gmail salah, tau sudah di gunakan')
        console.log("error bro", error);
        res.redirect('/register')
    }
}

export async function login(req, res, db) {
    try {
        const { email, password } = req.body

        const query = "SELECT * FROM users WHERE email = $1"
        const result = await db.query(query, [email]);

        if (result.rows.length === 0) {
            req.flash('error', 'password atau email salah')
            return res.redirect("/login")
        }

        const user = result.rows[0]
        const isPaswwordValid = await bcrypt.compare(password, user.password);
        if (!isPaswwordValid) {
            req.flash('error', 'password atau email salah')
            return res.redirect("/login")
        }

        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email
        }

        req.flash('success', 'login berhasil');

        console.log("user login", result.rows[0]);

        return res.redirect("/myHome");


    } catch (error) {
        req.flash('error', 'login gagal');
        return res.redirect('/login')
    }

}