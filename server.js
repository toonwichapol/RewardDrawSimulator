// server.js
const express = require('express');
const app = express();
const port = 3001;
const mysql = require("mysql2/promise");
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const dbConn = mysql.createConnection({
  host: 'localhost',
  user: 'root', // <== ระบุให้ถูกต้อง
  password: '',  // <== ระบุให้ถูกต้อง
  database: 'student_database',
  port: 3306  // <== ใส่ port ให้ถูกต้อง (default 3306, MAMP ใช้ 8889)
});

app.get('/api/students', async (req, res) => {
  try {
    const connection = await dbConn
    const [users] = await connection.query('SELECT * from students')
    res.json({ users });
  }
  catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const { name, age, tel, email } = req.body;
    if (!name || !age || !tel || !email) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const connection = await dbConn
    await connection.query("insert into students (name,age,phone,email) values('" + name + "','" + age + "','" + tel + "','" + email + "')")
    const [users] = await connection.query('SELECT * from students')
    res.status(201).json({ message: 'User added successfully', users });
  }
  catch (error) {
    console.error('Error posting students:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const connection = await dbConn
    await connection.query('Delete from students where id = ' + req.params.id)
    const [users] = await connection.query('SELECT * from students')
    res.status(201).json({ message: 'Deleted successfully', users });
  }
  catch (error) {
    console.error('Error delete students:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/rewards', async (req, res) => {
  try {
    const connection = await dbConn
    const [reward] = await connection.query('SELECT * from reward')
    res.json({ reward });
  }
  catch (error) {
    console.error('Error fetching reward:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/randomWinner', async (req, res) => {
  try {
    const connection = await dbConn
    const [winner] = await connection.query('SELECT * FROM students ORDER BY RAND() LIMIT 1')
    res.json({ winner });
  }
  catch (error) {
    console.error('Error fetching random:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
