<template>
  <div class="wallet-connect">
    <button
        :disabled="loading"
        @click="connectWallet"
        class="ton-btn"
    >
      <span v-if="loading">⏳ Подключение...</span>
      <span v-else>
        {{ walletAddress ? `Кошелёк: ${walletAddress}` : 'Подключить TON' }}
      </span>
    </button>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { TonConnect, WalletInfo } from '@tonconnect/sdk'

console.log('[WalletConnect] component mounted')

const connector = new TonConnect({
  manifestUrl: 'https://your-app.vercel.app/tonconnect-manifest.json'
})
console.log('[WalletConnect] TonConnect instance created', connector)

const walletAddress = ref<string>('')
const loading = ref(false)
const error = ref<string>('')

const connectWallet = async () => {
  loading.value = true
  error.value = ''
  console.log('[WalletConnect] connectWallet called')
  try {
    const wallets: WalletInfo[] = await connector.getWallets()
    console.log('[WalletConnect] getWallets result:', wallets)
    if (!wallets.length) {
      error.value = 'Кошельки не найдены. Проверьте manifestUrl.'
      loading.value = false
      console.error('[WalletConnect] No wallets found')
      return
    }
    const walletConnectionSource = wallets[0]
    console.log('[WalletConnect] Connecting to wallet:', walletConnectionSource)
    await connector.connect(walletConnectionSource)
    console.log('[WalletConnect] connector.account:', connector.account)
    walletAddress.value = connector.account?.address || ''
    if (!walletAddress.value) {
      error.value = 'Не удалось получить адрес кошелька.'
      console.error('[WalletConnect] Failed to get wallet address')
    } else {
      console.log('[WalletConnect] Wallet address:', walletAddress.value)
    }
  } catch (e: any) {
    error.value = 'Ошибка подключения: ' + (e?.message || e)
    console.error('[WalletConnect] Error:', e)
  } finally {
    loading.value = false
    console.log('[WalletConnect] connectWallet finished')
  }
}
</script>

<style scoped>
.wallet-connect {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 32px 0;
}
.ton-btn {
  background: linear-gradient(90deg, #0098ea 0%, #00e1ff 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 14px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 2px 8px #0098ea33;
}
.ton-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.error {
  color: #e74c3c;
  margin-top: 12px;
  font-size: 0.95rem;
}
</style>