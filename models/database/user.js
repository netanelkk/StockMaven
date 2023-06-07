const sql = require("..");
const bcrypt = require('bcryptjs');

const User = {};

User.register = async (data) => {
    const password = await bcrypt.hash(data.password, 10);
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO user (name,email,password) VALUES (?,?,?)",
            [data.name, data.email, password], (err, res) => {
                if (err) { return reject(err); } 
                return resolve(res.insertId);
        });
    });
};

User.details = (id) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT id,name,email,registerdate FROM user WHERE id=?", [id], (err, res) => {
            if (err) { return reject(err); }
            return resolve(res);
        });
    });
};

User.auth = (email, password) => {
    const global_error = "Email or password is incorrect";
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM user WHERE email = ?`, [email], (err, res) => {
            if (err) { return reject(err); }
            if (res.length == 0) { return reject(global_error); }
            if (!bcrypt.compareSync(password, res[0].password)) { return reject(global_error); }
            return resolve(res);
        });
    });
};

User.authToken = (id, email) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM user WHERE id = ? AND email = ?`, [id, email], (err, res) => {
            if (err) { return reject(err); }
            if (res.length == 0) { return reject(); }
            return resolve(res);
        });
    });
};

User.deleteAccount = (userid) => {
    return new Promise((resolve, reject) => {
        sql.query("DELETE FROM user WHERE id=?", [userid], (err, res) => {
            if (err) { return reject(err); }
            return resolve();
        });
    });
}

module.exports = User;

