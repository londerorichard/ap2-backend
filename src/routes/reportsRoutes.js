const express = require("express");
const router = express.Router();

const relatoriosController = require("../controllers/relatoriosController");

// GET /api/relatorios/vendas-por-categoria
router.get("/vendas-por-categoria", relatoriosController.vendasPorCategoria);

// GET /api/relatorios/top-produtos
router.get("/top-produtos", relatoriosController.topProdutos);

// GET /api/relatorios/faturamento
router.get("/faturamento", relatoriosController.faturamento);

module.exports = router;