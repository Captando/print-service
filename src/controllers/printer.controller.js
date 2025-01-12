const express = require('express');
const router = express.Router();
const printerService = require('../services/printer.service');

router.get('/printers', async (req, res) => {
    try {
        const printers = await printerService.getWindowsPrinters();
        res.json(printers);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao listar impressoras',
            details: error.message
        });
    }
});

router.post('/print', async (req, res) => {
    const { 
        printerName, 
        content, 
        format = {},
        filename = 'documento.pdf'
    } = req.body;

    if (!printerName || !content) {
        return res.status(400).json({
            error: 'Dados incompletos. Necessário printerName e content'
        });
    }

    try {
        const result = await printerService.print(printerName, content, format, filename);
        res.status(201).json({
            jobId: result.jobId,
            message: 'Trabalho de impressão enviado',
            outputPath: result.outputPath
        });
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao enviar impressão',
            details: error.message
        });
    }
});

module.exports = router;