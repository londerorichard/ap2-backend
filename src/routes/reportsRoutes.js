const express = require("express");
const router = express.Router();

const reportsController = require("../controllers/reportsController");

// GET /api/relatorios/vendas-por-categoria
router.get(
  "/vendas-por-categoria",
  reportsController.vendasPorCategoria
);

// GET /api/relatorios/top-produtos
router.get(
  "/top-produtos",
  reportsController.topProdutos
);

// GET /api/relatorios/faturamento
router.get(
  "/faturamento",
  reportsController.faturamento
);

module.exports = router;