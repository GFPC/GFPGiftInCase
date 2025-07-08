<template>
  <button @click="connectWallet">
    {{ walletAddress ? `Кошелёк: ${walletAddress}` : 'Подключить TON' }}
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { TonConnect, WalletInfo } from '@tonconnect/sdk'

const connector = new TonConnect({
  manifestUrl: 'https://your-app.vercel.app/tonconnect-manifest.json'
})
const walletAddress = ref<string>('')

const connectWallet = async () => {
  const wallets: WalletInfo[] = await connector.getWallets()
  const walletConnectionSource = wallets[0]
  await connector.connect(walletConnectionSource)
  walletAddress.value = connector.account?.address || ''
}
</script> 