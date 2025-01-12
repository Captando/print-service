const { exec } = require('child_process');
const util = require('util');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { processFormatting } = require('../utils/format.utils');
const { PAPER_FORMATS } = require('../config/printer.config');

const execAsync = util.promisify(exec);

class PrinterService {
    constructor() {
        this.jobs = new Map();
        this.jobCounter = 0;
    }

    // Lista todas as impressoras do sistema
    async getWindowsPrinters() {
        try {
            const { stdout } = await execAsync('wmic printer get name,default,status /format:csv');
            
            const lines = stdout.split('\r\r\n').filter(line => line.trim());
            const headers = lines[0].split(',');
            const printers = [];

            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',');
                if (values.length === headers.length) {
                    printers.push({
                        name: values[headers.indexOf('Name')],
                        isDefault: values[headers.indexOf('Default')] === 'TRUE',
                        status: values[headers.indexOf('Status')]
                    });
                }
            }

            return printers;
        } catch (error) {
            throw new Error(`Erro ao listar impressoras: ${error.message}`);
        }
    }

    // Verifica se uma impressora existe
    async printerExists(printerName) {
        try {
            const printers = await this.getWindowsPrinters();
            return printers.some(printer => printer.name === printerName);
        } catch (error) {
            return false;
        }
    }

    // Método principal de impressão
    async print(printerName, content, format = {}, filename) {
        let tempFile = null;

        try {
            // Verifica se a impressora existe
            const exists = await this.printerExists(printerName);
            if (!exists) {
                throw new Error(`Impressora '${printerName}' não encontrada no sistema.`);
            }

            const jobId = ++this.jobCounter;
            const paperFormat = PAPER_FORMATS[format.paperType || 'THERMAL'];
            
            // Processa o conteúdo com as formatações
            const processedContent = processFormatting(content, {
                ...format,
                paperFormat
            });

            // Cria arquivo temporário
            tempFile = await this.createTempFile(processedContent);

            // Define caminho de saída para PDFs
            const outputPath = format.paperType === 'A4' 
                ? path.join(os.homedir(), 'Desktop', filename || 'documento.pdf')
                : null;

            // Registra o trabalho
            const job = {
                id: jobId,
                printerName,
                outputPath,
                paperType: format.paperType || 'THERMAL',
                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            this.jobs.set(jobId, job);

            try {
                // Executa impressão
                if (format.paperType === 'A4') {
                    await this.printA4(printerName, tempFile, outputPath);
                } else {
                    await this.printThermal(printerName, tempFile);
                }

                job.status = 'completed';
            } catch (printError) {
                job.status = 'failed';
                job.error = printError.message;
                throw printError;
            } finally {
                job.updatedAt = new Date();
            }

            return { 
                jobId, 
                outputPath,
                status: job.status
            };

        } catch (error) {
            throw new Error(error.message);
        } finally {
            // Limpa arquivo temporário se existir
            if (tempFile) {
                try {
                    await fs.unlink(tempFile);
                } catch (unlinkError) {
                    console.error('Erro ao remover arquivo temporário:', unlinkError);
                }
            }
        }
    }

    // Impressão específica para A4
    async printA4(printerName, inputFile, outputPath) {
        try {
            const command = `powershell -Command "$content = Get-Content -Path '${inputFile}' -Encoding UTF8; $content | Out-Printer '${printerName}'"`;
            await execAsync(command);
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            throw new Error(`Erro ao imprimir em '${printerName}'. Verifique se a impressora está conectada e configurada corretamente.`);
        }
    }

    // Impressão específica para térmica
    async printThermal(printerName, inputFile) {
        try {
            const command = `powershell -Command "Get-Content '${inputFile}' | Out-Printer '${printerName}'"`;
            await execAsync(command);
        } catch (error) {
            throw new Error(`Erro ao imprimir em '${printerName}'. Verifique se a impressora está conectada e configurada corretamente.`);
        }
    }

    // Cria arquivo temporário
    async createTempFile(content) {
        const tempPath = path.join(os.tmpdir(), `print_${Date.now()}.txt`);
        await fs.writeFile(tempPath, content, 'utf8');
        return tempPath;
    }

    // Lista todos os trabalhos de impressão
    getJobs(printerName = null) {
        const jobsList = Array.from(this.jobs.values());
        return printerName
            ? jobsList.filter(job => job.printerName === printerName)
            : jobsList;
    }

    // Obtém um trabalho específico
    getJob(jobId) {
        return this.jobs.get(jobId);
    }

    // Cancela um trabalho de impressão (se possível)
    async cancelJob(jobId) {
        const job = this.jobs.get(jobId);
        if (!job) {
            throw new Error('Trabalho não encontrado');
        }

        if (job.status === 'pending') {
            job.status = 'cancelled';
            job.updatedAt = new Date();
            return true;
        }

        return false;
    }

    // Limpa trabalhos antigos
    cleanOldJobs(maxAge = 24 * 60 * 60 * 1000) { // 24 horas por padrão
        const now = new Date();
        for (const [jobId, job] of this.jobs.entries()) {
            if (now - job.createdAt > maxAge) {
                this.jobs.delete(jobId);
            }
        }
    }

    // Retorna estatísticas de impressão
    getPrintStats() {
        const stats = {
            total: 0,
            completed: 0,
            failed: 0,
            pending: 0,
            cancelled: 0,
            byPrinter: {},
            byPaperType: {
                A4: 0,
                THERMAL: 0
            }
        };

        for (const job of this.jobs.values()) {
            stats.total++;
            stats[job.status]++;
            
            stats.byPrinter[job.printerName] = (stats.byPrinter[job.printerName] || 0) + 1;
            stats.byPaperType[job.paperType]++;
        }

        return stats;
    }
}

module.exports = new PrinterService();