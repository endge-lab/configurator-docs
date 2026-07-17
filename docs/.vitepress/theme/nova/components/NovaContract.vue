<script setup lang="ts">
import { computed, ref } from 'vue'
import { DOCS_CONTRACTS } from '../nova-contracts'

const props = defineProps<{ id: string }>()
const contract = computed(() => DOCS_CONTRACTS[props.id])
const expanded = ref(false)
</script>

<template>
  <section v-if="contract" class="nova-contract">
    <header>
      <div>
        <span>{{ contract.kind }} · {{ contract.packageName }}</span>
        <h3>{{ contract.title }}</h3>
        <p>{{ contract.summary }}</p>
      </div>
      <code>{{ contract.signature }}</code>
    </header>

    <details v-for="group in contract.groups" :key="group.id">
      <summary>
        {{ group.title }}
        <small v-if="group.caption">{{ group.caption }}</small>
      </summary>
      <div class="nova-contract__table-wrap">
        <table>
          <thead>
            <tr><th>Поле</th><th>Тип</th><th>Описание</th></tr>
          </thead>
          <tbody>
            <tr v-for="field in group.items" :key="field.name">
              <td><code>{{ field.name }}</code><b v-if="field.required">required</b></td>
              <td><code>{{ field.type ?? '—' }}</code><small v-if="field.defaultValue">{{ field.defaultValue }}</small></td>
              <td>{{ field.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>

    <ul v-if="contract.notes?.length">
      <li v-for="note in contract.notes" :key="note">{{ note }}</li>
    </ul>

    <button v-if="contract.rawTs" type="button" class="nova-contract__raw-button" @click="expanded = !expanded">
      {{ expanded ? 'Скрыть исходный TypeScript' : 'Показать исходный TypeScript' }}
    </button>
    <pre v-if="expanded && contract.rawTs"><code>{{ contract.rawTs }}</code></pre>
  </section>
  <aside v-else class="nova-contract nova-contract--missing">
    Контракт <code>{{ id }}</code> не найден в импортированном registry.
  </aside>
</template>
