/**
 * Core simulator logic for Imóveis Taboão.
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initial State and Data Loading
    await UniData.load();

    const form = document.getElementById('simulator-form');
    const resultsSection = document.getElementById('results-section');
    const resultsList = document.getElementById('results-list');

    // Inputs
    const inputFin = document.getElementById('financiamento');
    const inputFgts = document.getElementById('fgts');
    const inputMensal = document.getElementById('mensal_max');
    const inputAnual = document.getElementById('anual_max');

    // Filters
    const searchInput = document.getElementById('search-input');
    const filterVaga = document.getElementById('filter-vaga');
    const filterGarden = document.getElementById('filter-garden');
    const filterPne = document.getElementById('filter-pne');

    let currentResults = [];

    // 2. Formatting Currency Inputs
    [inputFin, inputFgts, inputMensal, inputAnual].forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = (value / 100).toLocaleString('pt-BR', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            e.target.value = value;
        });
    });

    // 3. Calculation Functions
    function parseValue(str) {
        return parseFloat(str.replace(/\./g, '').replace(',', '.')) || 0;
    }

    function calcularParcelas(dataEntrega) {
        const hj = new Date();
        // Start is next month
        const start = new Date(hj.getFullYear(), hj.getMonth() + 1, 1);

        let [anoE, mesE] = dataEntrega.split('-').map(Number);
        if (!mesE) mesE = 1; // Fallback
        const end = new Date(anoE, mesE - 1, 1);

        if (end <= start) {
            // Already delivered or delivery is very soon
            return { mensais: 0, anuais: 0 };
        }

        // Total months between start and end (inclusive of end month)
        // Using month difference + 1 to include the delivery month
        const mensais = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;

        // Count decembers between start and end (inclusive)
        let anuais = 0;
        let check = new Date(start);
        while (check <= end) {
            if (check.getMonth() === 11) anuais++;
            check.setMonth(check.getMonth() + 1);
        }

        return { mensais, anuais };
    }

    function formatDate(iso) {
        if (!iso || !iso.includes('-')) return iso;
        const [ano, mes] = iso.split('-');
        return `${mes}/${ano}`;
    }

    function formatBRL(val) {
        if (isNaN(val)) return 'R$ 0,00';
        return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // 4. Main Simulator Flow
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const financialProfile = {
            financiamento: parseValue(inputFin.value),
            fgts: parseValue(inputFgts.value),
            mensalMax: parseValue(inputMensal.value),
            anualMax: parseValue(inputAnual.value)
        };

        const unidades = UniData.getAll();

        currentResults = unidades.map(u => {
            const { mensais, anuais } = calcularParcelas(u.entrega);

            const saldo = u.valor - financialProfile.financiamento - financialProfile.fgts;
            const capacidade = (mensais * financialProfile.mensalMax) + (anuais * financialProfile.anualMax);

            let entrada = saldo - capacidade;
            if (entrada < 0) entrada = 0;

            // Status Indicator
            let status = 'bg-green'; // Cabe no perfil
            if (entrada > 0) {
                const percent = (entrada / u.valor);
                status = percent > 0.15 ? 'bg-red' : 'bg-yellow';
            }

            return { ...u, entrada, mensais, anuais, status };
        });

        // Initial Sort: Min Entry First
        currentResults.sort((a, b) => a.entrada - b.entrada);

        resultsSection.classList.remove('hidden');
        renderResults();
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    });

    // 5. Filtering and Rendering
    function filterResults() {
        const search = searchInput.value.toLowerCase();
        const hasVaga = filterVaga.checked;
        const isGarden = filterGarden.checked;
        const isPne = filterPne.checked;

        return currentResults.filter(u => {
            const matchesSearch = u.empreendimento.toLowerCase().includes(search);
            const matchesVaga = !hasVaga || u.descricao.toLowerCase().includes('vaga');
            const matchesGarden = !isGarden || u.descricao.toLowerCase().includes('garden');
            const matchesPne = !isPne || u.descricao.toLowerCase().includes('pne');
            return matchesSearch && matchesVaga && matchesGarden && matchesPne;
        });
    }

    function renderResults() {
        const filtered = filterResults();
        resultsList.innerHTML = '';

        if (filtered.length === 0) {
            resultsList.innerHTML = '<p class="no-results">Nenhuma unidade encontrada para esses filtros.</p>';
            return;
        }

        filtered.slice(0, 50).forEach((u, idx) => { // Render top 50 for performance
            const card = document.createElement('div');
            card.className = 'unit-card';
            card.style.animationDelay = `${idx * 0.05}s`;

            card.innerHTML = `
                <div class="status-indicator ${u.status}"></div>
                <div class="project-name">${u.empreendimento}</div>
                <h4>Uni ${u.unidade} ${u.torre ? '- Torre ' + u.torre : ''}</h4>
                
                <div class="unit-info">
                    <div class="info-item">
                        <span>Área</span>
                        <strong>${u.area} m²</strong>
                    </div>
                    <div class="info-item">
                        <span>Tipo</span>
                        <strong>${u.descricao}</strong>
                    </div>
                    <div class="info-item">
                        <span>Mensais</span>
                        <strong>${u.mensais}x</strong>
                    </div>
                    <div class="info-item">
                        <span>Anuais</span>
                        <strong>${u.anuais}x</strong>
                    </div>
                </div>

                <div class="price-section">
                    <div class="total-price">
                        <span>Valor Total</span>
                        <strong>${formatBRL(u.valor)}</strong>
                    </div>
                    <div class="down-payment">
                        <span>Entrada Necessária</span>
                        <strong>${u.entrada === 0 ? 'R$ 0,00' : formatBRL(u.entrada)}</strong>
                    </div>
                </div>

                <div class="delivery-badge">Entrega: ${formatDate(u.entrega)}</div>
            `;
            resultsList.appendChild(card);
        });
    }

    // Filter Listeners
    [searchInput, filterVaga, filterGarden, filterPne].forEach(el => {
        el.addEventListener('input', renderResults);
    });
});
