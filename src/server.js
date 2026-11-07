import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.use(express.json());

const port = 3000;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'usuarios',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0

});

app.get('/users', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users;');

        return res.status(200).json({
            msg: "Sucesso ao retornar usuários",
            data: rows
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Erro no servidor, tente novamente!"
        })
    }
});

app.post('/users', async (req, res) => {
    try {
        const { name, email } = req.body;

        const [result] = await pool.query(`INSERT INTO users (id, name, email)
            VALUES (null, ?, ?)`,
            [name, email]
        );

        return res.status(201).json({
            message: "Usuário criado com sucesso!"
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Erro no servidor, tente novamente!"
        })
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            `DELETE FROM users WHERE id = ?`,
            [id]
        );

        return res.status(201).json({
            message: "Usuário deletado com sucesso!"
        });

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Erro no servidor, tente novamente!"
        })
    }
});

app.put("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        const [result] = await pool.query(
            `UPDATE users SET name = ?, email = ? WHERE id = ?`,
            [name, email, id]

        )

        return res.status(200).json({
            message: "Usuário atualizado com sucesso"
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Erro no servidor, tente novamente!"
        })
    }


});


app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
})