const db = require("../database/connection");

// GET /api/relatorios/vendas-por-categoria
async function vendasPorCategoria(req, res) {
  try {
    const vendas = await db("pedidos")
      .join("produtos", "pedidos.produto_id", "produtos.id")
      .select("produtos.categoria")
      .sum({ valor_total_vendido: "pedidos.valor_total" })
      .sum({ quantidade_vendida: "pedidos.quantidade" })
      .count({ total_pedidos: "pedidos.id" })
      .groupBy("produtos.categoria");

    return res.status(200).json(vendas);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao gerar relatório de vendas por categoria",
    });
  }
}

// GET /api/relatorios/top-produtos
async function topProdutos(req, res) {
  try {
    const produtos = await db("pedidos")
      .join("produtos", "pedidos.produto_id", "produtos.id")
      .select(
        "produtos.id",
        "produtos.nome"
      )
      .sum({ total_vendido: "pedidos.quantidade" })
      .groupBy("produtos.id", "produtos.nome")
      .orderBy("total_vendido", "desc")
      .limit(5);

    return res.status(200).json(produtos);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao gerar relatório dos produtos mais vendidos",
    });
  }
}

// GET /api/relatorios/faturamento
async function faturamento(req, res) {
  try {
    const { data_inicio, data_fim } = req.query;

    if (!data_inicio || !data_fim) {
      return res.status(400).json({
        message: "Informe data_inicio e data_fim",
      });
    }

    const inicio = new Date(data_inicio);
    const fim = new Date(data_fim);

    if (
      Number.isNaN(inicio.getTime()) ||
      Number.isNaN(fim.getTime()) ||
      inicio > fim
    ) {
      return res.status(400).json({
        message: "Período informado inválido",
      });
    }

    const dataFim = /^\d{4}-\d{2}-\d{2}$/.test(data_fim)
      ? `${data_fim} 23:59:59`
      : data_fim;

    const resultado = await db("pedidos")
      .whereBetween("created_at", [data_inicio, dataFim])
      .sum({ faturamento: "valor_total" })
      .first();

    return res.status(200).json({
      faturamento: resultado.faturamento ?? 0,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao gerar relatório de faturamento",
    });
  }
}

module.exports = {
  vendasPorCategoria,
  topProdutos,
  faturamento,
};