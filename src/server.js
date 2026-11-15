const express = require("express");

const app = express();

// Import route files
const productsRoutes = require("./routes/productsRoutes");
const ordersRoutes = require("./routes/ordersRoutes");
const reportsRoutes = require("./routes/reportsRoutes");

// Middleware
app.use(express.json());

// Register routes
app.use("/api/produtos", productsRoutes);
app.use("/api/pedidos", ordersRoutes);
app.use("/api/relatorios", reportsRoutes);

// Start server
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});