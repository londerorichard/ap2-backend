const express = require("express");

const app = express();

const produtosRoutes = require("./routes/produtosRoutes");
const pedidosRoutes = require("./routes/pedidosRoutes");
const relatoriosRoutes = require("./routes/relatoriosRoutes");

app.use(express.json());

app.use("/api/produtos", produtosRoutes);
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/relatorios", relatoriosRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});