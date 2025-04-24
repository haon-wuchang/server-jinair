import mysql from 'mysql2';

const pool = mysql.createPool({
    host: 'localhost', 
    port: 3306,
    user: 'root',
    password: 'mysql1234',
    database: 'jinairdb',
});

const getConnection = () => pool.promise().getConnection();

export { getConnection };

export const db = pool.promise();
