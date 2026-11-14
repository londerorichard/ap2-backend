const db = require("../database/connection");

// GET /pedidos
async function listarPedidos(req, res) {
  try {
    const pedidos = await db("pedidos").select();

    return res.status(200).json(pedidos);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao listar pedidos",
    });
  }
}


// GET /pedidos/:id
async function buscarPedidoPorId(req, res) {
  try {
    const { id } = req.params;

    const pedido = await db("pedidos")
      .where({ id })
      .first();

    if (!pedido) {
      return res.status(404).json({
        message: "Pedido não encontrado",
      });
    }

    return res.status(200).json(pedido);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao buscar pedido",
    });
  }
}


// POST /pedidos
async function criarPedido(req, res) {
  try {
    const { aluno_nome, produto_id, quantidade } = req.body;

    // Validate required fields
    if (
      !aluno_nome ||
      !Number.isInteger(Number(produto_id)) ||
      !Number.isInteger(quantidade) ||
      quantidade < 1
    ) {
      return res.status(400).json({
        message: "Dados inválidos para criar o pedido",
      });
    }

    const idProduto = Number(produto_id);

    // Start transaction
    const pedidoCriado = await db.transaction(async (trx) => {

      // Find product
      const produto = await trx("produtos")
        .where({ id: idProduto })
        .first();

      if (!produto) {
        throw Object.assign(new Error("Produto não encontrado"), {
          statusCode: 404,
        });
      }

      // R4: Check if product is active
      if (!produto.ativo) {
        throw Object.assign(new Error("Produto inativo"), {
          statusCode: 400,
        });
      }

      // R2: Check available stock
      if (produto.estoque < quantidade) {
        throw Object.assign(new Error("Estoque insuficiente"), {
          statusCode: 409,
        });
      }

      // R1: Calculate total using database price
      const valor_total = produto.preco * quantidade;

      // R3: Decrease stock
      const estoqueAtualizado = await trx("produtos")
        .where({ id: idProduto })
        .where("estoque", ">=", quantidade)
        .andWhere("ativo", true)
        .decrement("estoque", quantidade);

      if (estoqueAtualizado === 0) {
        throw Object.assign(new Error("Estoque insuficiente ou produto inativo"), {
          statusCode: 409,
        });
      }

      // Insert order
      const [pedidoId] = await trx("pedidos").insert({
        aluno_nome,
        produto_id: idProduto,
        quantidade,
        valor_total,
      });

      // Retrieve created order
      return await trx("pedidos")
        .where({ id: pedidoId })
        .first();
    });

    return res.status(201).json(pedidoCriado);

  } catch (error) {
    console.error(error);

    return res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : "Erro ao criar pedido",
    });
  }
}


// DELETE /pedidos/:id
async function deletarPedido(req, res) {
  try {
    const { id } = req.params;

    await db.transaction(async (trx) => {

      // Find order
      const pedido = await trx("pedidos")
        .where({ id })
        .first();

      if (!pedido) {
        throw Object.assign(new Error("Pedido não encontrado"), {
          statusCode: 404,
        });
      }

      // R3: Restore product stock
      await trx("produtos")
        .where({ id: pedido.produto_id })
        .increment("estoque", pedido.quantidade);

      // Delete order
      await trx("pedidos")
        .where({ id })
        .del();
    });

    return res.status(204).send();

  } catch (error) {
    console.error(error);

    return res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : "Erro ao deletar pedido",
    });
  }
}


module.exports = {
  listarPedidos,
  buscarPedidoPorId,
  criarPedido,
  deletarPedido,
};