const db = require("../database/connection");

// GET /produtos
async function listarProdutos(req, res) {
  try {
    const produtos = await db("produtos").select();

    return res.status(200).json(produtos);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao listar produtos",
    });
  }
}


// GET /produtos/:id
async function buscarProdutoPorId(req, res) {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        message: "ID inválido",
      });
    }

    const produto = await db("produtos")
      .where({ id })
      .first();

    if (!produto) {
      return res.status(404).json({
        message: "Produto não encontrado",
      });
    }

    return res.status(200).json(produto);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao buscar produto",
    });
  }
}


// POST /produtos
async function criarProduto(req, res) {
  try {
    const { nome, categoria, preco, estoque, ativo = true } = req.body;

    // Validate required fields
    if (
      typeof nome !== "string" || !nome.trim() ||
      nome.length > 80 ||
      typeof categoria !== "string" || !categoria.trim() ||
      categoria.length > 30 ||
      preco === undefined || preco === null ||
      !Number.isFinite(Number(preco)) || Number(preco) <= 0 ||
      !Number.isInteger(estoque) || estoque < 0 ||
      typeof ativo !== "boolean"
    ) {
      return res.status(400).json({
        message: "Dados inválidos para cadastrar produto",
      });
    }

    // Check if product name already exists
    const produtoExistente = await db("produtos")
      .where({ nome: nome.trim() })
      .first();

    if (produtoExistente) {
      return res.status(409).json({
        message: "Já existe um produto com esse nome",
      });
    }

    // Insert product
    const [produtoId] = await db("produtos").insert({
      nome: nome.trim(),
      categoria: categoria.trim(),
      preco: Number(preco),
      estoque,
      ativo,
    });

    const produtoCriado = await db("produtos")
      .where({ id: produtoId })
      .first();

    return res.status(201).json(produtoCriado);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao cadastrar produto",
    });
  }
}


// PUT /produtos/:id
async function atualizarProduto(req, res) {
  try {
    const { id } = req.params;
    const { nome, categoria, preco, estoque, ativo } = req.body;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        message: "ID inválido",
      });
    }

    const produto = await db("produtos")
      .where({ id })
      .first();

    if (!produto) {
      return res.status(404).json({
        message: "Produto não encontrado",
      });
    }

    // Build update object using only provided fields
    const dadosAtualizados = {};

    if (nome !== undefined) {
      if (
        typeof nome !== "string" ||
        !nome.trim() ||
        nome.length > 80
      ) {
        return res.status(400).json({
          message: "Nome inválido",
        });
      }

      dadosAtualizados.nome = nome.trim();
    }

    if (categoria !== undefined) {
      if (
        typeof categoria !== "string" ||
        !categoria.trim() ||
        categoria.length > 30
      ) {
        return res.status(400).json({
          message: "Categoria inválida",
        });
      }

      dadosAtualizados.categoria = categoria.trim();
    }

    if (preco !== undefined) {
      if (!Number.isFinite(Number(preco)) || Number(preco) <= 0) {
        return res.status(400).json({
          message: "Preço inválido",
        });
      }

      dadosAtualizados.preco = Number(preco);
    }

    if (estoque !== undefined) {
      if (!Number.isInteger(estoque) || estoque < 0) {
        return res.status(400).json({
          message: "Estoque inválido",
        });
      }

      dadosAtualizados.estoque = estoque;
    }

    if (ativo !== undefined) {
      if (typeof ativo !== "boolean") {
        return res.status(400).json({
          message: "O campo ativo deve ser booleano",
        });
      }

      dadosAtualizados.ativo = ativo;
    }

    if (Object.keys(dadosAtualizados).length === 0) {
      return res.status(400).json({
        message: "Nenhum dado enviado para atualização",
      });
    }

    // Check name uniqueness if name is being updated
    if (dadosAtualizados.nome) {
      const produtoExistente = await db("produtos")
        .where({ nome: dadosAtualizados.nome })
        .whereNot({ id })
        .first();

      if (produtoExistente) {
        return res.status(409).json({
          message: "Já existe um produto com esse nome",
        });
      }
    }

    await db("produtos")
      .where({ id })
      .update(dadosAtualizados);

    const produtoAtualizado = await db("produtos")
      .where({ id })
      .first();

    return res.status(200).json(produtoAtualizado);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao atualizar produto",
    });
  }
}


// DELETE /produtos/:id
async function deletarProduto(req, res) {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        message: "ID inválido",
      });
    }

    const resultado = await db.transaction(async (trx) => {

      const produto = await trx("produtos")
        .where({ id })
        .first();

      if (!produto) {
        return "NOT_FOUND";
      }

      // R5: Check if product has associated orders
      const pedidoExistente = await trx("pedidos")
        .where({ produto_id: id })
        .first();

      if (pedidoExistente) {
        return "HAS_ORDERS";
      }

      await trx("produtos")
        .where({ id })
        .del();

      return "DELETED";
    });

    if (resultado === "NOT_FOUND") {
      return res.status(404).json({
        message: "Produto não encontrado",
      });
    }

    if (resultado === "HAS_ORDERS") {
      return res.status(409).json({
        message: "Não é possível deletar um produto que possui pedidos associados",
      });
    }

    return res.status(204).send();

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao deletar produto",
    });
  }
}


module.exports = {
  listarProdutos,
  buscarProdutoPorId,
  criarProduto,
  atualizarProduto,
  deletarProduto,
};