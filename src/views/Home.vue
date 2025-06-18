<template>
  <div class="home container mt-4">
    <h1 class="mb-5 text-center">Dashboard Financeiro</h1>
    <div class="row justify-content-center text-center">
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="card h-100 shadow-sm">
          <div class="card-header bg-success text-white">
            <i class="fas fa-arrow-up me-2"></i>Receitas
          </div>
          <div class="card-body d-flex flex-column justify-content-center">
            <h2 class="card-title display-5 fw-bold">R$ {{ totalReceitas.toFixed(2) }}</h2>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="card h-100 shadow-sm">
          <div class="card-header bg-danger text-white">
            <i class="fas fa-arrow-down me-2"></i>Despesas
          </div>
          <div class="card-body d-flex flex-column justify-content-center">
            <h2 class="card-title display-5 fw-bold">R$ {{ totalDespesas.toFixed(2) }}</h2>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="card h-100 shadow-sm">
          <div class="card-header bg-info text-white">
            <i class="fas fa-balance-scale me-2"></i>Saldo
          </div>
          <div class="card-body d-flex flex-column justify-content-center">
            <h2 class="card-title display-5 fw-bold" :class="saldo >= 0 ? 'text-success' : 'text-danger'">
              R$ {{ saldo.toFixed(2) }}
            </h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  computed: {
    ...mapGetters(['totalReceitas', 'totalDespesas']),
    saldo() {
      return this.totalReceitas - this.totalDespesas;
    }
  }
}
</script>

<style scoped>
.card {
  border: none; /* Remove default card border if shadow is used */
}
.card-header {
  font-size: 1.3rem; /* Slightly larger header font */
  font-weight: 500;
}

.card-body .card-title {
  margin-bottom: 0; /* Remove default margin if card-body is centered */
}

.me-2 {
  margin-right: 0.5rem !important;
}

.fw-bold {
  font-weight: 700 !important;
}

/* Ensure Font Awesome is loaded (e.g., in public/index.html or main.js) */
/* @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css'); */
</style>