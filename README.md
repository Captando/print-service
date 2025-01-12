# Print Service

<div align="center">

![Print Service](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)
![License](https://img.shields.io/badge/License-MIT-green)
![Node](https://img.shields.io/badge/Node-v18+-blue)
![Express](https://img.shields.io/badge/Express-v4.18-blue)
![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen)

</div>

Serviço de impressão em Node.js que suporta impressão para PDF (A4), impressoras térmicas e fiscais, com formatação completa e comandos ESC/POS.

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [API](#-api)
- [Formatação](#-formatação)
- [Exemplos](#-exemplos)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

## 🚀 Funcionalidades

- ✨ Detecção automática de impressoras do sistema
- 📝 Suporte a múltiplos formatos de papel (A4 e Térmico)
- 🖨️ Compatível com impressoras térmicas e fiscais
- 📄 Geração automática de PDFs
- 🎯 Gerenciamento de fila de impressão
- 🔄 Monitoramento em tempo real
- 🛠️ API REST completa
- 💫 Suporte a caracteres especiais e acentuação
- 🎨 Formatação rica de texto
- 📊 Estatísticas de impressão

## 📋 Pré-requisitos

- Node.js 18.x ou superior
- NPM 9.x ou superior
- Windows (para suporte completo a impressoras locais)
- Microsoft Print to PDF (para geração de PDFs)

## 🔧 Instalação

```bash
# Clonar o repositório
git clone https://github.com/Captando/print-service.git

# Entrar no diretório
cd print-service

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Iniciar o servidor
npm start
```

## ⚙️ Configuração

1. Configure o arquivo `.env`:
```env
PORT=3000
NODE_ENV=development
OUTPUT_DIR=C:/Users/seu-usuario/Desktop
```

2. Estrutura de diretórios:
```
print-service/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── services/
│   └── utils/
├── logs/
└── outputs/
```

## 🎯 Uso

### Impressão em A4
```javascript
POST http://localhost:3000/print
{
    "printerName": "Microsoft Print to PDF",
    "content": "Conteúdo do documento",
    "format": {
        "paperType": "A4",
        "header": "Cabeçalho",
        "footer": "Rodapé"
    },
    "filename": "documento.pdf"
}
```

### Impressão Térmica
```javascript
POST http://localhost:3000/print
{
    "printerName": "EPSON TM-T20",
    "content": "[center]CUPOM FISCAL[/center]",
    "format": {
        "paperType": "THERMAL",
        "cutAtEnd": true
    }
}
```

## 📦 API

### GET /printers
Lista todas as impressoras disponíveis.

**Resposta:**
```json
[
    {
        "name": "Microsoft Print to PDF",
        "isDefault": true,
        "status": "Ready"
    }
]
```

### POST /print
Envia um trabalho para impressão.

**Corpo da requisição:**
```json
{
    "printerName": "string",
    "content": "string",
    "format": {
        "paperType": "A4|THERMAL",
        "header": "string?",
        "footer": "string?",
        "cutAtEnd": "boolean?"
    },
    "filename": "string?"
}
```

### GET /jobs
Lista todos os trabalhos de impressão.

### GET /jobs/:id
Obtém status de um trabalho específico.

## 🎨 Formatação

### Comandos de Texto
| Comando | Descrição | Exemplo |
|---------|-----------|---------|
| [b]...[/b] | Negrito | [b]Texto em negrito[/b] |
| [u]...[/u] | Sublinhado | [u]Texto sublinhado[/u] |
| [center]...[/center] | Centralizado | [center]Texto centralizado[/center] |
| [right]...[/right] | Alinhado à direita | [right]Texto à direita[/right] |
| [large]...[/large] | Fonte grande | [large]Texto grande[/large] |
| [double]...[/double] | Largura dupla | [double]Texto duplo[/double] |
| [cut] | Corte de papel | [cut] |
| [drawer] | Abre gaveta | [drawer] |
| [feed=n] | Avança n linhas | [feed=3] |

### Formatos de Papel
- A4 (210x297mm)
- Térmico (80mm)

## 📚 Exemplos

### Documento A4
```json
{
    "printerName": "Microsoft Print to PDF",
    "content": "[center][large]RELATÓRIO[/large][/center]\nConteúdo...",
    "format": {
        "paperType": "A4",
        "header": "Empresa LTDA",
        "footer": "Página 1"
    },
    "filename": "relatorio.pdf"
}
```

### Cupom Térmico
```json
{
    "printerName": "EPSON TM-T20",
    "content": "[center]CUPOM FISCAL[/center]\n[b]Item:[/b] Produto",
    "format": {
        "paperType": "THERMAL",
        "cutAtEnd": true
    }
}
```

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie sua Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Requisitos para Pull Requests
- Código deve seguir o estilo existente
- Atualize a documentação conforme necessário
- Adicione testes para novas funcionalidades
- Certifique-se que todos os testes passam

## ⚠️ Tratamento de Erros

O serviço inclui tratamento abrangente de erros:
- Validação de impressora existente
- Verificação de conectividade
- Validação de parâmetros
- Limpeza de recursos temporários

## 🔒 Segurança

- Validação de entrada
- Sanitização de caminhos de arquivo
- Proteção contra injeção de comandos
- Limpeza automática de arquivos temporários

## 📄 Licença

Este projeto está sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## ✒️ Autor

* **Victor Silva** - *Desenvolvimento* - [Captando](https://github.com/Captando)

## 🎁 Agradecimentos

- À comunidade open source
- Aos desenvolvedores de bibliotecas utilizadas
- A todos que contribuem para o projeto

---
⌨️ com ❤️ por [Victor Silva](https://github.com/Captando) 😊
