const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', '..', 'tabela.csv');
const jsonPath = path.join(__dirname, 'dados', 'unidades.json');

function parseCSV(csv) {
    const lines = csv.split('\n');
    const results = [];

    // Header is on line 2 (index 1) according to preview
    // Skip empty line 1
    const headers = lines[1].split(',').map(h => h.trim());

    for (let i = 2; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Simple CSV parser for quoted fields
        const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (!matches) continue;

        const values = matches.map(v => v.replace(/^"|"$/g, '').trim());

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
