/**
 * Data management for the simulator.
 */
const UniData = {
    unidades: [],

    async load() {
        try {
            const response = await fetch('dados/unidades.json');
            this.unidades = await response.json();
            return this.unidades;
        } catch (error) {
            console.error("Erro ao carregar unidades:", error);
            return [];
        }
    },

    getAll() {
        return this.unidades;
    }
};
