<template>
  <div class="wallet-connect">
    <div v-if="walletAddress">
      <div>Кошелёк: {{ walletAddress }}</div>
    </div>
    <div v-else>
      <div v-if="wallets.length">
        <div>Выберите кошелёк для подключения:</div>
        <ul>
          <li v-for="wallet in wallets" :key="wallet.appName">
            <button class="ton-btn" @click="connectWallet(wallet)">
              <img :src="wallet.imageUrl" :alt="wallet.name" width="24" style="vertical-align:middle;margin-right:8px;">
              {{ wallet.name }}
            </button>
          </li>
        </ul>
      </div>
      <div v-else>
        <button :disabled="loading" @click="loadWallets" class="ton-btn">
          <span v-if="loading">⏳ Загрузка кошельков...</span>
          <span v-else>Показать кошельки</span>
        </button>
      </div>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { TonConnect, WalletInfoRemote } from '@tonconnect/sdk'

console.log('[WalletConnect] component mounted')

const connector = new TonConnect({
  manifestUrl: 'https://your-app.vercel.app/tonconnect-manifest.json'
})
console.log('[WalletConnect] TonConnect instance created', connector)

const walletAddress = ref<string>('')
const loading = ref(false)
const error = ref<string>('')
const wallets = ref<WalletInfoRemote[]>([])

const loadWallets = async () => {
  loading.value = true
  error.value = ''
  try {
    const allWallets = await connector.getWallets()
    // Фильтруем только те, у которых есть bridgeUrl (WebView support)
    wallets.value = allWallets.filter((w: any) => w.bridgeUrl)
    console.log('[WalletConnect] Supported wallets:', wallets.value)
    if (!wallets.value.length) {
      error.value = 'Нет кошельков, поддерживающих WebView.'
    }
  } catch (e: any) {
    error.value = 'Ошибка загрузки кошельков: ' + (e?.message || e)
    console.error('[WalletConnect] Error loading wallets:', e)
  } finally {
    loading.value = false
  }
}

const connectWallet = async (wallet: WalletInfoRemote) => {
  loading.value = true
  error.value = ''
  console.log('[WalletConnect] connectWallet called for', wallet)
  try {
    await connector.connect(wallet)
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
  padding: 10px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin: 6px 0;
  transition: background 0.2s;
  box-shadow: 0 2px 8px #0098ea33;
  display: flex;
  align-items: center;
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