const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const port = 9999;

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "operators_db"
});

con.connect(err => {
    if (err) throw err;
});


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', express.static('public'))

app.get("/operators", (req, res) => {
    con.query("SELECT * FROM operators", function(err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.get("/operator/:id", (req, res) => {
    con.query(`SELECT * FROM operators WHERE id = ${req.params.id}`, function(err, result) {
        if (err) throw err;
        res.json(result[0]);
    });
});

app.get("/top", (req, res) => {
    con.query(`SELECT * FROM operators WHERE meta = 1`, function(err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.get("/top/:role", (req, res) => {
    con.query(`SELECT * FROM operators WHERE role = '${req.params.role}' LIMIT 5`, function(err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.get("/ban", (req, res) => {
    con.query(`SELECT * FROM operators WHERE meta = 0`, function(err, result) {
        if (err) throw err;
        res.json(result.slice(13, 18));
    });
});

app.get("/attacker", (req, res) => {
    con.query(`SELECT * FROM operators WHERE role = 'ATK'`, function(err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.get("/defender", (req, res) => {
    con.query(`SELECT * FROM operators WHERE role = 'DEF'`, function(err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.get("/search", (req, res) => {
    con.query(`SELECT * FROM operators WHERE name LIKE '%${req.query.name.toLowerCase()}%'`, function(err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.put("/operator/:id", (req, res) => {
    req.body.name = req.body.name ? req.body.name : "Recruit";
    req.body.armor = req.body.armor ? req.body.armor : 0;
    req.body.speed = req.body.speed ? req.body.speed : 0;
    con.query(`UPDATE operators SET name = '${req.body.name}', armor = ${req.body.armor}, speed = ${req.body.speed} WHERE id = ${req.params.id}`, function(err, result) {
        if (err) throw err;
        res.send("updated");
    });
});

app.post("/operator", (req, res) => {
    req.body.name = req.body.name ? req.body.name : "Recruit";
    req.body.armor = req.body.armor ? req.body.armor : 0;
    req.body.speed = req.body.speed ? req.body.speed : 0;
    con.query(`INSERT INTO operators (name, armor, speed) VALUES ('${req.body.name}', '${req.body.armor}', '${req.body.speed}')`, function(err, result) {
        if (err) throw err;
        res.send("created");
    });
});

app.delete("/operator/:id", (req, res) => {
    con.query(`DELETE FROM operators WHERE id = ${req.params.id}`, function(err, result) {
        if (err) throw err;
        res.json("deleted");
    });
});

app.listen(port, () => {
    console.log("Server is running");
});
