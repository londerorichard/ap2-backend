exports.seed = async function (knex) {
  // Clear tables before inserting
  await knex("pedidos").del();
  await knex("produtos").del();

  // Insert products
  const produtos = await knex("produtos").insert([
    {
      nome: "Notebook",
      categoria: "Eletrônicos",
      preco: 3500.00,
      estoque: 10,
      ativo: true,
    },
    {
      nome: "Mouse",
      categoria: "Eletrônicos",
      preco: 80.00,
      estoque: 25,
      ativo: true,
    },
    {
      nome: "Teclado",
      categoria: "Eletrônicos",
      preco: 150.00,
      estoque: 15,
      ativo: true,
    },
    {
      nome: "Cadeira",
      categoria: "Móveis",
      preco: 750.00,
      estoque: 8,
      ativo: true,
    },
    {
      nome: "Mesa",
      categoria: "Móveis",
      preco: 500.00,
      estoque: 5,
      ativo: true,
    },
    {
      nome: "Caderno",
      categoria: "Papelaria",
      preco: 25.00,
      estoque: 50,
      ativo: true,
    },
  ]);

  // Retrieve inserted products
  const produtosInseridos = await knex("produtos").select("id", "preco");

  // Insert test orders with different dates
  await knex("pedidos").insert([
    {
      aluno_nome: "João",
      produto_id: produtosInseridos[0].id,
      quantidade: 1,
      valor_total: produtosInseridos[0].preco * 1,
      created_at: "2026-11-01 10:00:00",
      updated_at: "2026-11-01 10:00:00",
    },
    {
      aluno_nome: "Maria",
      produto_id: produtosInseridos[1].id,
      quantidade: 2,
      valor_total: produtosInseridos[1].preco * 2,
      created_at: "2026-11-02 11:00:00",
      updated_at: "2026-11-02 11:00:00",
    },
    {
      aluno_nome: "Pedro",
      produto_id: produtosInseridos[2].id,
      quantidade: 1,
      valor_total: produtosInseridos[2].preco * 1,
      created_at: "2026-11-03 12:00:00",
      updated_at: "2026-11-03 12:00:00",
    },
    {
      aluno_nome: "Ana",
      produto_id: produtosInseridos[3].id,
      quantidade: 1,
      valor_total: produtosInseridos[3].preco * 1,
      created_at: "2026-11-04 13:00:00",
      updated_at: "2026-11-04 13:00:00",
    },
    {
      aluno_nome: "Lucas",
      produto_id: produtosInseridos[4].id,
      quantidade: 2,
      valor_total: produtosInseridos[4].preco * 2,
      created_at: "2026-11-05 14:00:00",
      updated_at: "2026-11-05 14:00:00",
    },
  ]);
};