import { createStore } from 'vuex'
import axios           from 'axios'

export default createStore({
    state: {
        transactions: []
    },
    getters: {
        totalReceitas(state) {
            return state.transactions
                .filter(t => t.tipo === 'Receita')
                .reduce((acc, t) => acc + t.valor, 0)
        },
        totalDespesas(state) {
            return state.transactions
                .filter(t => t.tipo === 'Despesa')
                .reduce((acc, t) => acc + t.valor, 0)
        }
    },
    mutations: {
        setTransactions(state, transactions) {
            state.transactions = transactions
        },

    },

    actions: {        
        async fetchTransactions({ commit }) {
            try {
                const response = await axios.get('http://127.0.0.1:5000/api/get_transacoes');
                if (response.status === 200) {
                    // Mapeando os dados para um formato de objeto
                    console.log(response.data);
                    const formattedTransactions = response.data.map(item => ({
                        codigo         : item['ID_TRANSACOES'],
                        tipo           : item['TIPO'],
                        categoria      : item['CATEGORIA'],
                        formaPagamento : item['FORMA_PAGAMENTO'],
                        valor          : parseFloat(item['VALOR']),                        
                        dataVencimento : item['DATA_VENCIMENTO'],
                        dataPagamento  : item['DATA_PAGAMENTO'], 
                    }));
                    commit('setTransactions', formattedTransactions);                    
                } else {
                    console.error('Erro ao buscar transações');
                }
            } catch (error) {
                console.error('Erro ao buscar transações:', error);
            }
        },
        
    }
})
