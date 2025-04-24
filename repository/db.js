import mysql from 'mysql2';

const pool = mysql.createPool({
    host: 'shoppy-redux.ct6mky2ksrs7.ap-northeast-2.rds.amazonaws.com', 
    port: 3306,
    user: 'admin',
    password: 'swamp213!!',
    database: 'jinairdb',
});

const getConnection = () => pool.promise().getConnection();

export { getConnection };

export const db = pool.promise();
