// Function	Responsibility
// listarProdutos	Return all registered products.
// buscarProdutoPorId	Find a product by its ID.
// criarProduto	Register a new product.
// atualizarProduto	Update product information.
// deletarProduto	Delete a product, checking R5 first.

// Business rules:
// - Product name must be unique.
// - Required fields must be validated.
// - Stock cannot be negative.
// - A product with associated orders cannot be deleted (R5).
// - Product creation and updates should respect the ativo field.