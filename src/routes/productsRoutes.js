const express = require("express");
const router = express.Router();

const produtosController = require("../controllers/produtosController");

// GET /api/produtos
router.get("/", produtosController.listarProdutos);

// GET /api/produtos/:id
router.get("/:id", produtosController.buscarProdutoPorId);

// POST /api/produtos
router.post("/", produtosController.criarProduto);

// PUT /api/produtos/:id
router.put("/:id", produtosController.atualizarProduto);

// DELETE /api/produtos/:id
router.delete("/:id", produtosController.deletarProduto);

module.exports = router;