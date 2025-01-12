const path = require('path');
const os = require('os');

module.exports = {
    // Configurações do servidor
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost'
    },

    // Configurações de arquivos
    files: {
        tempDir: os.tmpdir(),
        outputDir: path.join(os.homedir(), 'Desktop'),
        defaultFilename: 'documento.pdf'
    },

    // Configurações de impressão
    printing: {
        defaultPaperType: 'THERMAL',
        waitTime: 1000, // Tempo de espera após impressão (ms)
        defaultMargins: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        }
    },

    // Configurações de desenvolvimento
    development: {
        debug: process.env.DEBUG === 'true',
        showErrors: process.env.NODE_ENV === 'development'
    }
};