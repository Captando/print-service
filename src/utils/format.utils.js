const { FORMAT_COMMANDS, PAPER_FORMATS, DEFAULT_CONFIG } = require('../config/printer.config');

function processFormatting(text, format = {}) {
    // Merge com configurações padrão
    const config = { ...DEFAULT_CONFIG, ...format };
    const paperFormat = PAPER_FORMATS[config.paperType || 'THERMAL'];
    
    // Se for A4, usamos formatação simples sem comandos ESC/POS
    if (config.paperType === 'A4') {
        return processA4Format(text, config);
    }

    // Para impressora térmica, usa comandos ESC/POS
    return processThermalFormat(text, config);
}

function processA4Format(text, config) {
    let processedText = '';
    
    // Adiciona cabeçalho
    if (config.header) {
        processedText += config.header + '\n\n';
    }

    // Processa o texto removendo as tags mas mantendo a formatação
    text.split('\n').forEach(line => {
        line = line
            .replace(/\[b\](.*?)\[\/b\]/g, '$1')
            .replace(/\[u\](.*?)\[\/u\]/g, '$1')
            .replace(/\[center\](.*?)\[\/center\]/g, '$1')
            .replace(/\[right\](.*?)\[\/right\]/g, '$1')
            .replace(/\[large\](.*?)\[\/large\]/g, '$1')
            .replace(/\[double\](.*?)\[\/double\]/g, '$1')
            .replace(/\[cut\]/g, '')
            .replace(/\[pcut\]/g, '')
            .replace(/\[drawer\]/g, '')
            .replace(/\[feed=(\d+)\]/g, '\n'.repeat(parseInt('$1')));

        processedText += line + '\n';
    });

    // Adiciona rodapé
    if (config.footer) {
        processedText += '\n' + config.footer;
    }

    return processedText;
}

function processThermalFormat(text, config) {
    let processedText = FORMAT_COMMANDS.RESET;
    
    if (config.header) {
        processedText += FORMAT_COMMANDS.ALIGN_CENTER;
        processedText += FORMAT_COMMANDS.FONT_LARGE;
        processedText += config.header + FORMAT_COMMANDS.FEED_LINE;
        processedText += FORMAT_COMMANDS.FONT_NORMAL;
        processedText += FORMAT_COMMANDS.ALIGN_LEFT;
    }

    text.split('\n').forEach(line => {
        line = line
            .replace(/\[b\](.*?)\[\/b\]/g, FORMAT_COMMANDS.BOLD_ON + '$1' + FORMAT_COMMANDS.BOLD_OFF)
            .replace(/\[u\](.*?)\[\/u\]/g, FORMAT_COMMANDS.UNDERLINE_ON + '$1' + FORMAT_COMMANDS.UNDERLINE_OFF)
            .replace(/\[center\](.*?)\[\/center\]/g, FORMAT_COMMANDS.ALIGN_CENTER + '$1' + FORMAT_COMMANDS.ALIGN_LEFT)
            .replace(/\[right\](.*?)\[\/right\]/g, FORMAT_COMMANDS.ALIGN_RIGHT + '$1' + FORMAT_COMMANDS.ALIGN_LEFT)
            .replace(/\[large\](.*?)\[\/large\]/g, FORMAT_COMMANDS.FONT_LARGE + '$1' + FORMAT_COMMANDS.FONT_NORMAL)
            .replace(/\[double\](.*?)\[\/double\]/g, FORMAT_COMMANDS.DOUBLE_WIDTH + '$1' + FORMAT_COMMANDS.DOUBLE_OFF)
            .replace(/\[cut\]/g, FORMAT_COMMANDS.CUT_PAPER)
            .replace(/\[pcut\]/g, FORMAT_COMMANDS.PARTIAL_CUT)
            .replace(/\[drawer\]/g, FORMAT_COMMANDS.OPEN_DRAWER)
            .replace(/\[feed=(\d+)\]/g, (_, n) => FORMAT_COMMANDS.FEED_LINES(parseInt(n)));

        processedText += line + FORMAT_COMMANDS.FEED_LINE;
    });

    if (config.footer) {
        processedText += FORMAT_COMMANDS.FEED_LINE;
        processedText += FORMAT_COMMANDS.ALIGN_CENTER;
        processedText += config.footer;
        processedText += FORMAT_COMMANDS.ALIGN_LEFT;
    }

    if (config.cutAtEnd) {
        processedText += FORMAT_COMMANDS.FEED_LINES(3);
        processedText += config.partialCut ? FORMAT_COMMANDS.PARTIAL_CUT : FORMAT_COMMANDS.CUT_PAPER;
    }

    return processedText;
}

module.exports = {
    processFormatting
};