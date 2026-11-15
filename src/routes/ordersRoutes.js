const express = require("express");
const router = express.Router();

const ordersController = require("../controllers/ordersController");

// GET /api/pedidos
router.get("/", ordersController.listarPedidos);

// GET /api/pedidos/:id
router.get("/:id", ordersController.buscarPedidoPorId);

// POST /api/pedidos
router.post("/", ordersController.criarPedido);

// DELETE /api/pedidos/:id
router.delete("/:id", ordersController.deletarPedido);

module.exports = router;