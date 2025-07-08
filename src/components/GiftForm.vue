<template>
  <form @submit.prevent="onSubmit">
    <input v-model="receiver" placeholder="Получатель" required />
    <input v-model.number="amount" type="number" placeholder="Сумма" required min="1" />
    <button type="submit">Создать подарок</button>
    <div v-if="result">{{ result }}</div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useApi } from '../composables/useApi'

const receiver = ref<string>('')
const amount = ref<number>(1)
const result = ref<string>('')
const { createGift } = useApi()

const onSubmit = async (): Promise<void> => {
  try {
    const res = await createGift(receiver.value, amount.value)
    result.value = `Подарок создан: ${JSON.stringify(res)}`
  } catch (e) {
    result.value = 'Ошибка при создании подарка'
  }
}
</script> 