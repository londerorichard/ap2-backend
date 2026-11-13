// Function	Responsibility
// listarPedidos	Return all orders.
// buscarPedidoPorId	Find an order by its ID.
// criarPedido	Create an order and update product stock.
// deletarPedido	Delete an order and return its quantity to stock.


// Business rules:
// - R1: Calculate valor_total using the product price from the database.
// - R2: Verify sufficient stock before creating an order.
// - R3: Decrease stock when creating an order and restore it when deleting one.
// - R4: Prevent orders for inactive products.
// - Use transactions when creating or deleting orders.