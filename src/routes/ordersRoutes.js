const express = require("express");
const router = express.Router();

const pedidosController = require("../controllers/pedidosController");

// GET /api/pedidos
router.get("/", pedidosController.listarPedidos);

// GET /api/pedidos/:id
router.get("/:id", pedidosController.buscarPedidoPorId);

// POST /api/pedidos
router.post("/", pedidosController.criarPedido);

// DELETE /api/pedidos/:id
router.delete("/:id", pedidosController.deletarPedido);

module.exports = router;