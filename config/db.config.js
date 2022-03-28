const dotenv = require('dotenv');
dotenv.config();
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.USER,
    process.env.PASSWORD,
    {
        dialect: "mysql",
        host: process.env.HOST,
        define: {
            timestamps: false
        },
    }
)

module.exports = sequelize;