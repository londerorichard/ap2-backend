const express = require("express");
const router = express.Router();

const productsController = require("../controllers/productsController");

// GET /api/produtos
router.get("/", productsController.listarProdutos);

// GET /api/produtos/:id
router.get("/:id", productsController.buscarProdutoPorId);

// POST /api/produtos
router.post("/", productsController.criarProduto);

// PUT /api/produtos/:id
router.put("/:id", productsController.atualizarProduto);

// DELETE /api/produtos/:id
router.delete("/:id", productsController.deletarProduto);

module.exports = router;