const express = require('express');
const pool = require('./db');
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    let sql = "Select * from userdetail where username=? and password=?";
    try {
        const [data] = await pool.query(sql, [username, password]);
        if (data.length > 0) {
            res.status(200).json({ msg: "validuser" });
        } else {
            res.status(404).json({ msg: "invaliduser" });
        }
    } catch (error) {
        console.log(error);
    }
})

app.post('/addstaff', async (req, res) => {
    const { name, department, date, address, hobbies, rb } = req.body;
    let sql = "INSERT INTO employees (ename,edpartment,edoj,eaddress,egender) values (?,?,?,?,?);"
    const [data] = await pool.query(sql, [name, department, date, address, rb])
    console.log(data);
    try {
        if (data.affectedRows > 0) {
            let sql2 = "insert into hobbies (eid,hobbyname) values ?;"
            const values = hobbies.map(hobby => [data.insertId, hobby]);
            const [data2] = await pool.query(sql2, [values]);
            if (data2.affectedRows > 0) {
                res.json({ msg: "usercreated" }).status(201);
            }
        }
    } catch (error) {
        res.json({ msg: "servererror" }).status(500);
    }
})

app.get('/tabledata', async (req, res) => {
    let sql = "SELECT * FROM employees";

    let [data] = await pool.query(sql);

    if (data.length > 0) {
        res.json({ data, msg: "datafetched" })
    } else if (data.length === 0) {
        res.json({ data, msg: "nodata" })
    }
})

app.get('/tabledata/:search', async (req, res) => {
    let sql = "SELECT * FROM employees where ename LIKE ?";
    let searchparam = `%${req.params.search}%`
    let [data] = await pool.query(sql, [searchparam]);

    if (data.length > 0) {
        res.json({ data, msg: "datafetched" })
    }
})

app.get('/getemployee/:eid', async (req, res) => {
    let sql = "SELECT * FROM employees where eid=?";
    let sql2 = "SELECT hobbyname FROM hobbies where eid=?";

    let [data] = await pool.query(sql, [req.params.eid]);
    let [data2] = await pool.query(sql2, [req.params.eid]);

    if (data.length > 0) {
        res.json({ data: data[0], hobbies: data2, msg: "datafetched" })
    }
})

app.post('/updatestaff', async (req, res) => {
    const { name, department, date, address, hobbies, rb, id } = req.body;
    let sql = "update employees set ename=?,edpartment=?,edoj=?,eaddress=?,egender=? where eid=?"
    let sql2 = "delete from hobbies where eid=?"
    let sql3 = "insert into hobbies (eid,hobbyname) values ?"

    let [data1] = await pool.query(sql, [name, department, date, address, rb, id])
    if (data1.affectedRows > 0) {
        let [data2] = await pool.query(sql2, [id])
        if (data2.affectedRows > 0) {
            const values = hobbies.map(hobby => [id, hobby]);
            let [data3] = await pool.query(sql3, [values]);
            if (data3.affectedRows > 0) {
                res.json({ msg: "userupdated" }).status(201);
            }
        }
    }
})

app.delete('/removestaff/:id', async (req, res) => {
    let sql = "DELETE FROM hobbies where eid=?"
    let sql2 = "DELETE FROM employees where eid=?"

    let [data] = await pool.query(sql, [req.params.id])
    if (data.affectedRows >= 0) {
        let [data2] = await pool.query(sql2, [req.params.id])
        if (data2.affectedRows > 0) {
            res.json({ msg: "userdeleted" });
        }
    }

})

app.listen(PORT, () => {
    console.log("Server Started at PORT", PORT);
})