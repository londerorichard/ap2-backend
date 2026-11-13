/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};

exports.up = function (knex) {
  return knex.schema.createTable("pedidos", function (table) {
    table.increments("id");

    table.string("aluno_nome", 100).notNullable();

    table
      .integer("produto_id")
      .notNullable()
      .references("id")
      .inTable("produtos");

    table.integer("quantidade").notNullable();
    table.decimal("valor_total", 8, 2).notNullable();

    table.timestamps(true, true);

    table.check("quantidade >= 1");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("pedidos");
};
