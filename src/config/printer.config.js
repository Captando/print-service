// Configurações de formato de papel
const PAPER_FORMATS = {
    A4: {
        name: 'A4',
        width: 210,
        height: 297,
        margins: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        },
        unit: 'mm',
        command: '\x1B\x43\x00'
    },
    THERMAL: {
        name: 'Thermal',
        width: 80,
        height: 'continuous',
        margins: {
            left: 0,
            right: 0
        },
        unit: 'mm',
        command: '\x1B\x43\x01'
    }
};

// Comandos ESC/POS
const FORMAT_COMMANDS = {
    // Comandos básicos
    RESET: '\x1B\x40',           // Inicializa impressora
    FEED_LINE: '\x0A',           // Avança uma linha
    FEED_LINES: (n) => `\x1B\x64${String.fromCharCode(n)}`, // Avança n linhas
    
    // Formatação de texto
    BOLD_ON: '\x1B\x45\x01',     
    BOLD_OFF: '\x1B\x45\x00',    
    UNDERLINE_ON: '\x1B\x2D\x01',
    UNDERLINE_OFF: '\x1B\x2D\x00',
    DOUBLE_WIDTH: '\x1B\x0E',    
    DOUBLE_OFF: '\x14',          
    
    // Alinhamento
    ALIGN_LEFT: '\x1B\x61\x00',  
    ALIGN_CENTER: '\x1B\x61\x01',
    ALIGN_RIGHT: '\x1B\x61\x02', 
    
    // Tamanho da fonte
    FONT_NORMAL: '\x1B\x21\x00',
    FONT_LARGE: '\x1B\x21\x10',  
    
    // Controles de hardware
    CUT_PAPER: '\x1B\x69',       
    PARTIAL_CUT: '\x1B\x6D',     
    OPEN_DRAWER: '\x1B\x70\x00\x19\x19',
    
    // Configurações de página
    PAGE_MODE: '\x1B\x4C',       // Modo página (para A4)
    STANDARD_MODE: '\x1B\x53',   // Modo padrão (para térmico)
    
    // Configurações específicas para A4
    A4_MODE: {
        START: '\x1B\x43\x00',   // Inicia modo A4
        END: '\x1B\x43\x01',     // Finaliza modo A4
        MARGIN: (size) => `\x1B\x6C${String.fromCharCode(size)}` // Define margem
    }
};

// Configurações padrão
const DEFAULT_CONFIG = {
    encoding: 'utf8',
    paperType: 'THERMAL',
    fontSize: 'normal',
    characterSet: 'BRAZIL',
    codePage: 'CP850',
    margins: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    }
};

module.exports = {
    PAPER_FORMATS,
    FORMAT_COMMANDS,
    DEFAULT_CONFIG
};