const db = require("../database/connection");

// GET /relatorios/produtos
async function relatorioProdutos(req, res) {
  try {
    const produtos = await db("produtos")
      .select(
        "id",
        "nome",
        "categoria",
        "preco",
        "estoque",
        "ativo"
      )
      .orderBy("categoria")
      .orderBy("nome");

    return res.status(200).json(produtos);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao gerar relatório de produtos",
    });
  }
}


// GET /relatorios/pedidos
async function relatorioPedidos(req, res) {
  try {
    const pedidos = await db("pedidos")
      .join("produtos", "pedidos.produto_id", "produtos.id")
      .select(
        "pedidos.id",
        "pedidos.aluno_nome",
        "produtos.nome as produto_nome",
        "pedidos.quantidade",
        "pedidos.valor_total",
        "pedidos.created_at"
      )
      .orderBy("pedidos.created_at", "desc");

    return res.status(200).json(pedidos);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao gerar relatório de pedidos",
    });
  }
}


// GET /relatorios/vendas
async function relatorioVendas(req, res) {
  try {
    const vendas = await db("pedidos")
      .select(
        db.raw("COUNT(*) as total_pedidos"),
        db.raw("SUM(quantidade) as quantidade_vendida"),
        db.raw("SUM(valor_total) as valor_total_vendas")
      )
      .first();

    return res.status(200).json({
      total_pedidos: vendas.total_pedidos,
      quantidade_vendida: vendas.quantidade_vendida,
      valor_total_vendas: vendas.valor_total_vendas,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao gerar relatório de vendas",
    });
  }
}


// GET /relatorios/estoque
async function relatorioEstoque(req, res) {
  try {
    const estoque = await db("produtos")
      .select(
        "id",
        "nome",
        "categoria",
        "estoque",
        "ativo"
      )
      .orderBy("estoque", "asc");

    return res.status(200).json(estoque);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao gerar relatório de estoque",
    });
  }
}


module.exports = {
  relatorioProdutos,
  relatorioPedidos,
  relatorioVendas,
  relatorioEstoque,
};