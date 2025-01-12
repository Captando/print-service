const express = require('express');
const router = express.Router();
const printerService = require('../services/printer.service');

router.get('/jobs', (req, res) => {
    try {
        const { printerName } = req.query;
        const jobs = printerService.getJobs(printerName);
        res.json(jobs);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao listar trabalhos',
            details: error.message
        });
    }
});

router.get('/jobs/:id', (req, res) => {
    try {
        const { id } = req.params;
        const job = printerService.getJob(Number(id));
        
        if (job) {
            res.json(job);
        } else {
            res.status(404).json({ error: 'Trabalho não encontrado' });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao buscar trabalho',
            details: error.message
        });
    }
});

module.exports = router;