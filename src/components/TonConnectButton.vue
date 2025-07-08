<template>
  <button @click="handleConnect" :disabled="isLoading">
    {{ buttonText }}
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { TonConnect } from '@tonconnect/sdk';

declare global {
  interface Window {
    Telegram?: any;
  }
}

const connector = new TonConnect({
  manifestUrl: 'https://your-frontend.vercel.app/tonconnect-manifest.json'
});

const walletAddress = ref('');
const isLoading = ref(false);
const buttonText = ref('🔗 Подключить TON кошелёк');

onMounted(async () => {
  if (connector.connected) {
    walletAddress.value = connector.account?.address || '';
    buttonText.value = `✅ ${shortAddress(walletAddress.value)}`;
    if (walletAddress.value) {
      console.log('[TonConnectButton] Успешно подключён TON-кошелёк:', walletAddress.value);
    }
  }
});

const handleConnect = async () => {
  isLoading.value = true;
  try {
    const wallets = await connector.getWallets();
    const walletConnectionSource = wallets[0];
    await connector.connect(walletConnectionSource);
    walletAddress.value = connector.account?.address || '';
    buttonText.value = `✅ ${shortAddress(walletAddress.value)}`;
    if (walletAddress.value) {
      console.log('[TonConnectButton] Успешно подключён TON-кошелёк:', walletAddress.value);
    }
    await sendWalletToBackend(walletAddress.value);
  } catch (error) {
    console.error('Ошибка подключения:', error);
    buttonText.value = '❌ Ошибка, попробуйте снова';
  } finally {
    isLoading.value = false;
  }
};

const shortAddress = (addr: string) => {
  return addr ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : '';
};

const sendWalletToBackend = async (address: string) => {
  const tg = window.Telegram?.WebApp;
  if (!tg) return;
  try {
    const response = await fetch('https://your-backend.vercel.app/users/wallet', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tg.initData}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ wallet_address: address })
    });
    if (!response.ok) throw new Error('Ошибка сохранения кошелька');
    console.log('Кошелёк сохранён!');
  } catch (error) {
    console.error('Ошибка:', error);
  }
};
</script>

<style scoped>
button {
  padding: 10px 15px;
  background: #0088cc;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
}
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style> 