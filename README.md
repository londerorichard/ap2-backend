# Sistema de Gerenciamento de Produtos e Pedidos

## 1. Integrantes

- Integrante 1: Richard Londero

## 2. Descrição do projeto

Este projeto consiste em uma API REST desenvolvida para gerenciar produtos e pedidos de uma aplicação de vendas.

A API permite cadastrar, consultar, atualizar e remover produtos, além de registrar pedidos, controlar o estoque automaticamente e gerar relatórios de vendas e faturamento.

O sistema implementa regras de negócio para garantir a integridade dos dados, incluindo validação de estoque, bloqueio da venda de produtos inativos e restrições para exclusão de produtos que possuem histórico de pedidos.

## 3. Tecnologias utilizadas

- **Node.js:** ambiente de execução JavaScript.
- **Express:** framework utilizado para criação da API REST e gerenciamento das rotas.
- **Knex.js:** query builder utilizado para executar consultas SQL, gerenciar migrations, seeds e transações.
- **SQLite:** banco de dados relacional utilizado para armazenar produtos e pedidos.
- **JavaScript:** linguagem utilizada no desenvolvimento do projeto.

## 4. Instalação e configuração

### Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

- Node.js
- npm

### Clonar o repositório

```bash
git clone https://github.com/londerorichard/ap2-backend.git
```

Acesse a pasta do projeto:

```bash
cd ap2backend
```

### Instalar as dependências

```bash
npm install
```

As principais dependências utilizadas são:

```bash
npm install express knex sqlite3
```

## 5. Configuração do banco de dados

O projeto utiliza SQLite como banco de dados e Knex.js para gerenciamento da estrutura e dos registros.

### 5.1. Criar o banco de dados

Para executar as migrations e criar as tabelas necessárias, utilize:

```bash
npx knex migrate:latest
```

Esse comando cria as tabelas `produtos` e `pedidos`, além de registrar a execução das migrations.

### 5.2. Popular o banco de dados

Para inserir os dados iniciais de teste, execute:

```bash
npx knex seed:run
```

O seeder cadastra produtos de diferentes categorias e pedidos de exemplo, permitindo testar as funcionalidades e os relatórios da API.

**Observação:** o seeder limpa os dados existentes antes de inserir os registros iniciais.

## 6. Iniciar o servidor

Para iniciar a aplicação, execute:

```bash
npm start
```

O servidor será iniciado na porta 3000.

Endereço base da API:

```text
http://localhost:3000
```

## 7. Endpoints disponíveis

Todos os endpoints utilizam o prefixo `/api`.

### 7.1. Produtos

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/produtos` | Lista todos os produtos. |
| GET | `/api/produtos?categoria=Eletrônicos` | Filtra produtos por categoria. |
| GET | `/api/produtos?ativo=true` | Filtra produtos pelo status de atividade. |
| GET | `/api/produtos/:id` | Busca um produto específico pelo ID. |
| POST | `/api/produtos` | Cadastra um novo produto. |
| PUT | `/api/produtos/:id` | Atualiza os dados de um produto. |
| DELETE | `/api/produtos/:id` | Remove um produto, desde que não possua histórico de pedidos. |

#### Exemplo — Cadastrar produto

**Requisição:**

```http
POST /api/produtos
Content-Type: application/json
```

```json
{
  "nome": "Monitor",
  "categoria": "Eletrônicos",
  "preco": 899.90,
  "estoque": 10,
  "ativo": true
}
```

**Resposta esperada — 201 Created:**

```json
{
  "id": 1,
  "nome": "Monitor",
  "categoria": "Eletrônicos",
  "preco": 899.90,
  "estoque": 10,
  "ativo": true
}
```

#### Exemplo — Consultar produto

**Requisição:**

```http
GET /api/produtos/1
```

**Resposta esperada — 200 OK:**

```json
{
  "id": 1,
  "nome": "Monitor",
  "categoria": "Eletrônicos",
  "preco": 899.90,
  "estoque": 10,
  "ativo": true
}
```

#### Exemplo — Atualizar produto

**Requisição:**

```http
PUT /api/produtos/1
Content-Type: application/json
```

```json
{
  "nome": "Monitor Full HD",
  "categoria": "Eletrônicos",
  "preco": 999.90,
  "estoque": 15,
  "ativo": true
}
```

**Resposta esperada — 200 OK:**

Retorna os dados atualizados do produto.

#### Exemplo — Listar produtos

**Requisição:**

```http
GET /api/produtos
```

**Resposta esperada — 200 OK:**

```json
[
  {
    "id": 1,
    "nome": "Monitor",
    "categoria": "Eletrônicos",
    "preco": 899.90,
    "estoque": 10,
    "ativo": true
  }
]
```

Quando não existem produtos cadastrados, a API retorna uma lista vazia (`[]`).

#### Exemplo — Excluir produto

**Requisição:**

```http
DELETE /api/produtos/1
```

**Resposta esperada — 204 No Content:**

A exclusão é realizada somente quando o produto não possui pedidos associados.

Caso exista histórico de pedidos, a API retorna `409 Conflict`.

### 7.2. Pedidos

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/pedidos?limit=10&offset=0` | Lista pedidos utilizando paginação. |
| GET | `/api/pedidos?aluno_nome=Richard&limit=10&offset=0` | Filtra pedidos pelo nome do aluno. |
| GET | `/api/pedidos/:id` | Busca um pedido específico, incluindo o nome do produto. |
| POST | `/api/pedidos` | Registra um novo pedido e atualiza o estoque. |
| DELETE | `/api/pedidos/:id` | Exclui um pedido e restaura o estoque do produto. |

#### Exemplo — Criar pedido

**Requisição:**

```http
POST /api/pedidos
Content-Type: application/json
```

```json
{
  "aluno_nome": "Richard",
  "produto_id": 1,
  "quantidade": 2
}
```

**Resposta esperada — 201 Created:**

```json
{
  "id": 1,
  "aluno_nome": "Richard",
  "produto_id": 1,
  "quantidade": 2,
  "valor_total": 1799.80
}
```

O valor total é calculado automaticamente pela API utilizando o preço cadastrado no banco de dados e a quantidade solicitada.

O cliente não precisa enviar o campo `valor_total`.

#### Exemplo — Consultar pedido

**Requisição:**

```http
GET /api/pedidos/1
```

**Resposta esperada — 200 OK:**

```json
{
  "id": 1,
  "aluno_nome": "Richard",
  "produto_id": 1,
  "produto_nome": "Monitor",
  "quantidade": 2,
  "valor_total": 1799.80
}
```

O nome do produto é obtido por meio de uma operação JOIN entre as tabelas `pedidos` e `produtos`.

#### Exemplo — Listar pedidos com paginação

**Requisição:**

```http
GET /api/pedidos?limit=10&offset=0
```

**Resposta esperada — 200 OK:**

```json
[
  {
    "id": 1,
    "aluno_nome": "Richard",
    "produto_id": 1,
    "quantidade": 2,
    "valor_total": 1799.80
  }
]
```

#### Exemplo — Excluir pedido

**Requisição:**

```http
DELETE /api/pedidos/1
```

**Resposta esperada — 204 No Content:**

O pedido é removido e a quantidade correspondente é devolvida ao estoque do produto.

### 7.3. Relatórios

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/relatorios/vendas-por-categoria` | Apresenta o total vendido em reais, a quantidade de itens vendidos e o número de pedidos, agrupados por categoria. |
| GET | `/api/relatorios/top-produtos` | Apresenta os cinco produtos mais vendidos e suas respectivas quantidades vendidas. |
| GET | `/api/relatorios/faturamento?data_inicio=2026-11-01&data_fim=2026-11-30` | Calcula o faturamento total dentro de um período informado. |

#### Exemplo — Vendas por categoria

**Requisição:**

```http
GET /api/relatorios/vendas-por-categoria
```

**Resposta esperada — 200 OK:**

```json
[
  {
    "categoria": "Eletrônicos",
    "valor_total_vendido": 2500,
    "quantidade_vendida": 5,
    "total_pedidos": 3
  },
  {
    "categoria": "Papelaria",
    "valor_total_vendido": 500,
    "quantidade_vendida": 10,
    "total_pedidos": 4
  }
]
```

#### Exemplo — Top 5 produtos

**Requisição:**

```http
GET /api/relatorios/top-produtos
```

**Resposta esperada — 200 OK:**

```json
[
  {
    "id": 1,
    "nome": "Monitor",
    "total_vendido": 15
  },
  {
    "id": 2,
    "nome": "Teclado",
    "total_vendido": 12
  }
]
```

#### Exemplo — Faturamento por período

**Requisição:**

```http
GET /api/relatorios/faturamento?data_inicio=2026-11-01&data_fim=2026-11-30
```

**Resposta esperada — 200 OK:**

```json
{
  "faturamento": 3000
}
```

As respostas apresentadas são exemplos ilustrativos. Os valores reais dependem dos registros existentes no banco de dados.

## 8. Utilização de transações do Knex

As transações do Knex foram utilizadas nas operações de criação e exclusão de pedidos, pois essas operações envolvem múltiplas alterações no banco de dados que precisam ser executadas de maneira consistente.

Uma transação garante que todas as operações sejam concluídas com sucesso ou que nenhuma alteração seja efetivada caso ocorra algum erro durante o processo.

### 8.1. Criação de pedidos

Na criação de um pedido, a transação é utilizada para executar as seguintes operações:

1. Consultar o produto no banco de dados.
2. Verificar se o produto existe.
3. Verificar se o produto está ativo.
4. Verificar se existe estoque suficiente.
5. Calcular o valor total utilizando o preço armazenado no banco de dados.
6. Diminuir a quantidade disponível no estoque.
7. Registrar o pedido.

Caso alguma operação falhe, a transação é revertida (*rollback*), impedindo que o estoque seja alterado sem que o pedido seja registrado ou que um pedido seja criado sem a atualização correspondente do estoque.

### 8.2. Exclusão de pedidos

Na exclusão de um pedido, a transação garante que:

1. O pedido seja localizado no banco de dados.
2. A quantidade correspondente seja devolvida ao estoque do produto.
3. O pedido seja removido do banco de dados.

Caso ocorra algum erro durante essas operações, a transação é revertida, garantindo que o estoque e os registros de pedidos permaneçam consistentes.

### 8.3. Importância das transações

A utilização de transações garante a integridade e a consistência dos dados, evitando alterações incompletas no banco de dados.

Dessa forma, as operações que envolvem simultaneamente pedidos e estoque são executadas de maneira segura, respeitando as regras de negócio estabelecidas para o sistema.