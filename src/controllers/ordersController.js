const db = require("../database/connection");

// GET /api/pedidos
async function listarPedidos(req, res) {
  try {
    const { aluno_nome } = req.query;

    const limit = Number(req.query.limit ?? 10);
    const offset = Number(req.query.offset ?? 0);

    if (
      !Number.isInteger(limit) ||
      limit < 1 ||
      !Number.isInteger(offset) ||
      offset < 0
    ) {
      return res.status(400).json({
        message: "Parâmetros de paginação inválidos",
      });
    }

    const query = db("pedidos")
      .select(
        "id",
        "aluno_nome",
        "produto_id",
        "quantidade",
        "valor_total",
        "created_at",
        "updated_at"
      );

    if (aluno_nome !== undefined) {
      query.where("aluno_nome", "like", `%${aluno_nome}%`);
    }

    const pedidos = await query
      .limit(limit)
      .offset(offset);

    return res.status(200).json(pedidos);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao listar pedidos",
    });
  }
}


// GET /api/pedidos/:id
async function buscarPedidoPorId(req, res) {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        message: "ID inválido",
      });
    }

    const pedido = await db("pedidos")
      .join("produtos", "pedidos.produto_id", "produtos.id")
      .select(
        "pedidos.id",
        "pedidos.aluno_nome",
        "pedidos.produto_id",
        "produtos.nome as produto_nome",
        "pedidos.quantidade",
        "pedidos.valor_total",
        "pedidos.created_at",
        "pedidos.updated_at"
      )
      .where("pedidos.id", id)
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


// POST /api/pedidos
async function criarPedido(req, res) {
  try {
    const { aluno_nome, produto_id, quantidade } = req.body;

    if (
      typeof aluno_nome !== "string" ||
      !aluno_nome.trim() ||
      !Number.isInteger(Number(produto_id)) ||
      Number(produto_id) <= 0 ||
      !Number.isInteger(quantidade) ||
      quantidade < 1
    ) {
      return res.status(400).json({
        message: "Dados inválidos para criar o pedido",
      });
    }

    const idProduto = Number(produto_id);

    const pedidoCriado = await db.transaction(async (trx) => {

      const produto = await trx("produtos")
        .where({ id: idProduto })
        .first();

      if (!produto) {
        throw Object.assign(new Error("Produto não encontrado"), {
          statusCode: 404,
        });
      }

      // R4: Inactive products cannot be sold
      if (!produto.ativo) {
        throw Object.assign(new Error("Produto inativo"), {
          statusCode: 400,
        });
      }

      // R2: Verify available stock
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
        const produtoAtualizado = await trx("produtos")
          .where({ id: idProduto })
          .first();

        if (!produtoAtualizado.ativo) {
          throw Object.assign(new Error("Produto inativo"), {
            statusCode: 400,
          });
        }

        throw Object.assign(new Error("Estoque insuficiente"), {
          statusCode: 409,
        });
      }

      const [pedidoId] = await trx("pedidos").insert({
        aluno_nome: aluno_nome.trim(),
        produto_id: idProduto,
        quantidade,
        valor_total,
      });

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


// DELETE /api/pedidos/:id
async function deletarPedido(req, res) {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        message: "ID inválido",
      });
    }

    await db.transaction(async (trx) => {

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