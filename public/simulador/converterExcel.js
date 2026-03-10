const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', '..', 'tabela.csv');
const jsonPath = path.join(__dirname, 'dados', 'unidades.json');

function splitCSVLine(line) {
    const result = [];
    let cur = "";
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
            result.push(cur.trim());
            cur = "";
        } else {
            cur += char;
        }
    }
    result.push(cur.trim());
    return result;
}

function parseCSV(csv) {
    const lines = csv.split('\n');
    const results = [];

    // Header is on line 2 (index 1) according to preview
    // Skip empty line 1
    // The header line is not processed into results, so it's fine to keep this comment
    // and implicitly skip the header by starting the loop at i = 2.

    for (let i = 2; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = splitCSVLine(line);

        const item = {
            empreendimento: values[0],
            unidade: values[1],
            torre: values[2] || '',
            area: parseArea(values[3]),
            descricao: values[4],
            valor: parseValor(values[5]),
            entrega: parseData(values[6])
        };

        if (item.empreendimento && item.valor) {
            results.push(item);
        }
    }

    return results;
}

function parseArea(text) {
    if (!text) return 0;
    // "45 m²" -> 45
    // "42,45 m²" -> 42.45
    const num = text.replace(' m²', '').replace(',', '.');
    return parseFloat(num);
}

function parseValor(text) {
    if (!text) return 0;
    // "R$ 354.350,00" -> 354350
    const num = text.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
    return parseFloat(num);
}

function parseData(text) {
    if (!text) return '';
    // "outubro 2026" -> "2026-10"
    const months = {
        'janeiro': '01', 'fevereiro': '02', 'março': '03', 'abril': '04',
        'maio': '05', 'junho': '06', 'julho': '07', 'agosto': '08',
        'setembro': '09', 'outubro': '10', 'novembro': '11', 'dezembro': '12'
    };

    const parts = text.split(' ');
    if (parts.length === 2) {
        const mes = months[parts[0].toLowerCase()];
        const ano = parts[1];
        return `${ano}-${mes}`;
    }
    return text;
}

try {
    const csvData = fs.readFileSync(csvPath, 'utf8');
    const units = parseCSV(csvData);
    fs.writeFileSync(jsonPath, JSON.stringify(units, null, 2));
    console.log(`Sucesso! ${units.length} unidades processadas.`);
} catch (err) {
    console.error('Erro ao converter arquivo:', err);
}
