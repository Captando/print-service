const express = require('express');
const cors = require('cors');
const printerController = require('./src/controllers/printer.controller');
const jobController = require('./src/controllers/job.controller');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/', printerController);
app.use('/', jobController);

// Erro 404
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Erro interno do servidor',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});