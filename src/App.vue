<script setup lang="ts">
import { ref } from 'vue'
import { useTelegram } from './composables/useTelegram'
import WalletConnect from './components/WalletConnect.vue'
import GiftForm from './components/GiftForm.vue'
import TonConnectButton from "@/components/TonConnectButton.vue";

const { user } = useTelegram()
const isWalletConnected = ref<boolean>(false)
</script>

<template>
  <div class="app">
    <h1>🎁 GiftInCase</h1>
    <TonConnectButton v-if="!isWalletConnected" @connect="isWalletConnected = true" />
    <GiftForm v-else />
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
