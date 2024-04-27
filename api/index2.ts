
const { Pool } = require('pg');
module.exports = async (req, res) => {
    const pool = new Pool({
            //connectionString: process.env.DATABASE_URL,
            //connectionString: 'postgresql://default:@ep-blue-violet.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require',
        //connectionString: 'postgresql://default:@ep-blue-violet.us-east-1.aws.neon.tech:5432/verceldb?sslmode=prefer',
        ssl: {
            rejectUnauthorized: false
        }
    });

    pool.query('SELECT NOW()')
        .then(result => {
            res.json(result.rows[0]);
        })
        .catch(error => {
            console.error('Database connection error:', error);
            res.status(500).json({ error: error.message });
        })
        .finally(() => {
            pool.end();
        });
};

