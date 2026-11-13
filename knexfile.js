const path = require("node:path");

module.exports = {
    development: {
        client: "sqlite3",

        connection: {
            filename: path.resolve(__dirname, "src/database/database.sqlite")
        },

        useNullAsDefault: true,

        migrations: {
            directory: path.resolve(__dirname, "src/database/migrations"),
            tableName: "knex_migrations"
        },

        seeds: {
            directory: path.resolve(__dirname, "src/database/seeds")
        }
    }
};