<template>
  <div class="wallet-connect">
    <div v-if="walletAddress">
      <div>Кошелёк: {{ walletAddress }}</div>
    </div>
    <div v-else>
      <div v-if="wallets.length">
        <div>Доступен только TON Кошелёк (Telegram Wallet):</div>
        <ul>
          <li v-for="wallet in wallets" :key="wallet.appName">
            <button class="ton-btn" @click="showTonWalletInfo">
              <img :src="wallet.imageUrl" :alt="wallet.name" width="24" style="vertical-align:middle;margin-right:8px;">
              {{ wallet.name }}
            </button>
          </li>
        </ul>
        <div class="info">
          Подключение TON Кошелька через Mini App невозможно.<br>
          Откройте <b>https://wallet.tg</b> напрямую или используйте официальный бот <a href="https://t.me/wallet" target="_blank">@wallet</a>.
        </div>
      </div>
      <div v-else>
        <button :disabled="loading" @click="loadWallets" class="ton-btn">
          <span v-if="loading">⏳ Загрузка кошельков...</span>
          <span v-else>Показать TON Кошелёк</span>
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
    // Оставляем только telegram-wallet
    wallets.value = allWallets.filter((w: any) => w.appName === 'telegram-wallet')
    console.log('[WalletConnect] Only telegram-wallet:', wallets.value)
    if (!wallets.value.length) {
      error.value = 'TON Кошелёк (Telegram Wallet) не найден.'
    }
  } catch (e: any) {
    error.value = 'Ошибка загрузки кошельков: ' + (e?.message || e)
    console.error('[WalletConnect] Error loading wallets:', e)
  } finally {
    loading.value = false
  }
}

const showTonWalletInfo = () => {
  alert('Подключение TON Кошелька через Mini App невозможно. Откройте https://wallet.tg или используйте бота @wallet.')
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
.info {
  margin-top: 16px;
  color: #555;
  font-size: 0.98rem;
  background: #f7f7f7;
  border-radius: 8px;
  padding: 12px 18px;
  max-width: 350px;
  text-align: center;
}
</style>