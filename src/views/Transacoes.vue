<template>
    <div class="px-3 transacoes">
        <h2 class="mb-4 text-center">Registro de Transações</h2>
        <form>
            <div class="form-group row align-items-center">
                <label for="tipo" class="col-md-1 col-form-label">Tipo</label>
                <div class="col-md-2">
                    <select @change="defautlByType" v-model="novaTransacao.tipo" class="form-control" id="tipo">
                        <option v-for="(tipoTransacao, index) in tipoTransacao" :key="index">{{ tipoTransacao }}</option>
                    </select>
                </div>

                <label for="dataVencimento" class="col-md-1 col-form-label">Data Vencimento</label>
                <div class="col-md-2">
                    <input type="date" v-model="novaTransacao.dataVencimento" class="form-control" id="dataVencimento">
                </div>

                <label for="dataPagamento" class="col-md-1 col-form-label">{{ novaTransacao.tipo === 'Receita' ? 'Data Recebimento' : 'Data Pagamento' }}</label>
                <div class="col-md-2">
                    <input type="date" v-model="novaTransacao.dataPagamento" class="form-control" id="dataPagamento">
                </div> 
                
            </div>

            <div class="form-group row align-items-center">
                <label for="valor" class="col-md-1 col-form-label">Valor</label>
                <div class="col-md-2">
                    <input type="number" v-model="novaTransacao.valor" class="form-control" id="valor">
                </div>

                <label for="categoria" class="col-md-1 col-form-label">Categoria</label>
                <div  v-if="novaTransacao.tipo === 'Receita'" class="col-md-2">
                    <select v-model="novaTransacao.categoria" class="form-control" id="categoria">
                        <option v-for="(categoriaReceita, index) in categoriaReceita" :key="index">{{ categoriaReceita }}</option>
                    </select>
                </div>
                <div v-else class="col-md-2">
                    <select v-model="novaTransacao.categoria" class="form-control" id="categoria">                        
                        <option v-for="(categoriaDespesa, index) in categoriaDespesa" :key="index">{{ categoriaDespesa }}</option>
                    </select>
                </div>

                <label for="formaPagamento" class="col-md-1 col-form-label">Forma Pagamento</label>
                <div v-if="novaTransacao.tipo === 'Receita'" class="col-md-2">
                    <select v-model="novaTransacao.formaPagamento" class="form-control" id="formaPagamento">
                        <option v-for="(formaPagReceita, index) in formaPagReceita" :key="index">{{ formaPagReceita }}</option>
                    </select>
                </div>
                <div v-else class="col-md-2">
                    <select v-model="novaTransacao.formaPagamento" class="form-control" id="formaPagamento">
                        <option v-for="(formaPagDespesa, index) in formaPagDespesa" :key="index">{{ formaPagDespesa }}</option>
                    </select>
                </div>
                
            </div>

            <button @click.prevent="adicionarTransacao" class="btnAddTransacao btn btn-primary">
                {{ editando ? 'Atualizar' : 'Adicionar' }}
            </button>

            <button v-if="editando" @click.prevent="resetForm" class="btnAddTransacao btn btn-danger mx-1">X</button>
            
        </form>

        <form class="mt-3">
            <div class="form-group row align-items-center">
                <label for="filtroSelecionado" class="col-md-1 col-form-label">Filtro</label>
                <div class="col-md-2">
                    <select v-model="filtroSelecionado" class="form-control" id="filtroSelecionado">                    
                        <option value="tipo">Tipo</option>
                    <option value="categoria">Categoria</option>
                    <option value="formaPagamento">Forma Pagamento</option>
                    <option value="data">Data de Pagamento</option>
                    </select>
                </div>

                <div v-if="filtroSelecionado === 'tipo'" class="col-md-4">
                    <select v-model="filtro.tipo" class="form-control">
                    <option value="">Todos</option>
                    <option v-for="(tipoTransacao, index) in tipoTransacao" :key="index">
                        {{ tipoTransacao }}
                    </option>
                    </select>
                </div>

                <div v-if="filtroSelecionado === 'categoria'" class="col-md-4">
                    <select v-model="filtro.categoria" class="form-control">
                        <option value="">Todas</option>
                        <option v-for="(categoria, index) in [...categoriaReceita, ...categoriaDespesa]" :key="index">
                        {{ categoria }}
                    </option>
                    </select>
                </div>

                <div v-if="filtroSelecionado === 'formaPagamento'" class="col-md-4">
                    <select v-model="filtro.formaPagamento" class="form-control">
                    <option value="">Todas</option>
                    <option v-for="(forma, index) in [...formaPagReceita, ...formaPagDespesa]" :key="index">
                        {{ forma }}
                    </option>
                    </select>
                </div>

                <div v-if="filtroSelecionado === 'data'" class="col-md-2">
                    <input type="date" v-model="filtro.dataInicio" class="form-control">
                </div>
                <div v-if="filtroSelecionado === 'data'" class="col-md-2">
                    <input type="date" v-model="filtro.dataFim" class="form-control">
                </div>
                <button class="btn btn-danger" @click="limparFiltros"> X </button>
            </div>

                <div class="mt-2 d-flex justify-content-between align-items-center">
                    <div class="d-inline">
                        <span v-if ="Object.keys(filtrosAtivos).length === 0" class="ml-2"></span>
                        <span v-else v-for="(valor, chave) in filtrosAtivos" :key="chave" class="ml-2">
                            {{ chave }}: {{ valor }} 
                        </span>
                    </div>                    
                </div>
        </form>


        <table class="table mt-4">
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Tipo</th>
                    <th>Categoria</th>
                    <th>Forma Pagamento</th>
                    <th>Valor</th>
                    <th>Data Vencimento</th>
                    <th>Data Pagamento</th>
                    <th class="text-center">-</th>
                    <th class="text-center">-</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="transactions.length === 0">
                    <td colspan="5" class="text-center">Nenhuma transação encontrada.</td>
                </tr>
                <tr v-else v-for="(transacao, index) in transacoesFiltradas" :key="index">
                    <td>{{ transacao.codigo }}</td>
                    <td>{{ transacao.tipo }}</td>
                    <td>{{ transacao.categoria }}</td>
                    <td>{{ transacao.formaPagamento }}</td>
                    <td>R$ {{ transacao.valor }}</td>
                    <td>{{ formatarData(transacao.dataVencimento) }}</td>                    
                    <td>{{ formatarData(transacao.dataPagamento) }}</td>
                    <td class="text-center">
                        <button @click="editarTransacao(index)" class="btn btn-primary btn-sm">Editar</button>
                    </td>
                    <td class="text-center">
                        <button @click="removerTransacao(index)" class="btn btn-danger btn-sm">Remover</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import axios from 'axios'

export default {
    name: 'Transacoes',
    data() {
        return {
            novaTransacao: {
                codigo         : 0,
                categoria      : 'Salário',
                tipo           : 'Receita',
                formaPagamento : 'Pix',
                valor          : 0,
                dataVencimento : new Date().toISOString().slice(0, 10),
                dataPagamento  : new Date().toISOString().slice(0, 10)
            },

            filtro: {
                tipo: "",
                categoria: "",
                formaPagamento: "",
                dataInicio: "",
                dataFim: ""
            },
            filtroSelecionado: "tipo",

            tipoTransacao      : [],
            categoriaReceita   : [],
            categoriaDespesa   : [],
            formaPagReceita    : [],
            formaPagDespesa    : [],
            editando           : false,
            transacaoIndex     : null
        }
    },

    computed: {
        ...mapState(['transactions']),

        transacoesFiltradas() {
            return this.transactions.filter(transacao => {
                return (
                    (this.filtro.tipo           === "" || transacao.tipo           === this.filtro.tipo)                         &&
                    (this.filtro.categoria      === "" || transacao.categoria      === this.filtro.categoria)                    &&
                    (this.filtro.formaPagamento === "" || transacao.formaPagamento === this.filtro.formaPagamento)               &&
                    (this.filtro.dataInicio     === "" || new Date(transacao.dataPagamento) >= new Date(this.filtro.dataInicio)) &&
                    (this.filtro.dataFim        === "" || new Date(transacao.dataPagamento) <= new Date(this.filtro.dataFim))
                );
            });
        },

        filtrosAtivos() {
            let ativos = {};
            if (this.filtro.tipo) ativos["Tipo"] = this.filtro.tipo;
            if (this.filtro.categoria) ativos["Categoria"] = this.filtro.categoria;
            if (this.filtro.formaPagamento) ativos["Forma Pagamento"] = this.filtro.formaPagamento;
            if (this.filtro.dataInicio && this.filtro.dataFim) {
                ativos["Data"] = `${this.filtro.dataInicio} até ${this.filtro.dataFim}`;
            } else if (this.filtro.dataInicio) {
                ativos["Data"] = `A partir de ${this.filtro.dataInicio}`;
            } else if (this.filtro.dataFim) {
                ativos["Data"] = `Até ${this.filtro.dataFim}`;
            }
            return ativos;
        }
    },

    methods: {
        ...mapActions([]),

        limparFiltros() {
            this.filtro = {
                tipo: "",
                categoria: "",
                formaPagamento: "",
                dataInicio: "",
                dataFim: "",
            };
            this.filtroSelecionado = "tipo";
        },
        
        async adicionarTransacao() {
            const { tipo, formaPagamento, valor, dataVencimento, dataPagamento } = this.novaTransacao;

            // Verificando se todos os campos estão preenchidos
            if (!this.checkAll([tipo, formaPagamento, dataVencimento, dataPagamento])) {
                alert('Todos os campos devem ser preenchidos corretamente.');
                return;
            }

            // Verificando se o valor é um número maior que zero
            if (isNaN(valor) || valor <= 0) {
                alert('O valor deve ser um número maior que zero.');
                return;
            }

            try {
                if (this.editando) {
                    // Atualizar transação existente
                    const response = await axios.put(`http://127.0.0.1:5000/api/edit_transacao/${this.transactions[this.transacaoIndex].codigo}`, this.novaTransacao);

                    if (response.status === 200) {
                        this.$store.dispatch('fetchTransactions');
                        alert('Transação atualizada com sucesso!');
                    }
                } else {
                    // Adicionar nova transação
                    const response = await axios.post('http://127.0.0.1:5000/api/set_transacao', this.novaTransacao);

                    if (response.status === 200) {
                        this.$store.dispatch('fetchTransactions');
                        alert('Transação salva com sucesso!');
                    }
                }
            } catch (error) {
                console.error('Erro ao salvar transação:', error);
                alert('Falha ao salvar a transação. Tente novamente.' + error);
            }

            this.resetForm();
        },

        editarTransacao(index) {
            this.novaTransacao = { ...this.transactions[index] };
            this.editando = true;
            this.transacaoIndex = index;
        },

        resetForm() {
            this.novaTransacao = {
                codigo         : 0,
                categoria      : 'Salário',
                tipo           : 'Receita',
                formaPagamento : 'Pix',
                valor          : 0,
                dataVencimento : new Date().toISOString().slice(0, 10),
                dataPagamento  : new Date().toISOString().slice(0, 10)
            };
            this.editando = false;
            this.transacaoIndex = null;
        },

        checkAll(fields) {
            return fields.every(field => field && field.trim() !== '');
        },

        formatarData(data) {
            if (!data) return '';
            
            const [ano, mes, dia] = data.split('-');
            return `${dia}/${mes}/${ano}`;
        },

        async removerTransacao(index) {
            if (confirm('Tem certeza que deseja remover esta transação?')) {
                try {
                    const response = await axios.post('http://127.0.0.1:5000/api/del_transacao', this.transactions[index]);

                    if (response.status === 200) {
                        this.$store.dispatch('fetchTransactions');
                        alert('Registro excluído com sucesso!');
                    }
                } catch (error) {
                    console.error('Erro ao excluir o registro:', error);
                    alert('Falha ao excluir o registro. Tente novamente.');
                }
            }
        },

        defautlByType() {            
            if (this.novaTransacao.tipo === 'Receita') {
                this.novaTransacao.categoria      = 'Salário';
                this.novaTransacao.formaPagamento = 'Pix';
            } else {
                this.novaTransacao.categoria      = 'Alimentação';
                this.novaTransacao.formaPagamento = 'Pix';
            }
        },
    },

    created() {
        this.$store.dispatch('fetchTransactions');
    },

    mounted() {
        this.tipoTransacao    = ['Receita', 'Despesa'];
        this.categoriaReceita = ['Salário', 'Investimentos', 'Freelance', 'Aluguel', 'Dividendos', 'Outros'];
        this.categoriaDespesa = ['Alimentação', 'Cartão Crédito', 'Dentista', 'Educação', 'Gás', 'Internet', 'Lazer', 'Luz', 'MEI', 'Saúde', 'Telefone', 'Transporte', 'Unimed', 'Outros'];
        this.formaPagDespesa  = ['Pix', 'Cartão Débito', 'Cartão Crédito', 'Dinheiro', 'Boleto'];
        this.formaPagReceita  = ['Pix', 'Dinheiro', 'Transferência' , 'Depósito', 'Cheque', 'Boleto'];
    }
}
</script>

<style scoped>
.form-group {
    margin-bottom: 15px;
}

.row {
    margin-bottom: 10px;
}

label {
    font-weight: bold;
    font-size: 0.7rem;
}

.btnAddTransacao {
    margin-top: 15px;
    transition: background-color 0.3s;
}

.btnAddTransacao:hover {
    background-color: #0056b3;
    color: white;
}

table {
    margin-top: 20px;
    border-collapse: collapse;
    width: 100%;
}

/* table th, table td {
    border: 1px solid #ddd;
    padding: 8px;
}*/

.table th, .table td {
    padding: 12px;
    font-size: 0.9rem;
}

table tr:nth-child(even) {
    background-color: #f9f9f9;
}

.table tr:hover {
    background-color: #f1f1f1;
}

table th {
    background-color: #4CAF50;
    color: white;
}

.filtro-container {
    background-color: #f8f9fa;
    padding: 15px;
    border-radius: 5px;
    margin-top: 20px;
}

</style>
