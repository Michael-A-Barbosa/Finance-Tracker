<template>
  <div class="home">
    <h1>Dashboard Financeiro</h1>
    <div class="row">
      <div class="col-md-6">
        <h3>Receitas: R$ {{ totalReceitas.toFixed(2) }}</h3>
      </div>
      <div class="col-md-6">
        <h3>Despesas: R$ {{ totalDespesas.toFixed(2) }}</h3>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  computed: {
    ...mapGetters(['totalReceitas', 'totalDespesas'])
  }
}
</script>