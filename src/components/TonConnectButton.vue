<template>
  <button @click="handleConnect" :disabled="isLoading" class="connect-button">
    {{ buttonText }}
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { TonConnect } from '@tonconnect/sdk';

const connector = new TonConnect({
  manifestUrl: 'https://your-app.vercel.app/tonconnect-manifest.json'
});

const walletAddress = ref('');
const isLoading = ref(false);
const buttonText = ref('🔗 Подключить TON кошелёк');

// Проверка подключенного кошелька
onMounted(async () => {
  if (connector.connected) {
    walletAddress.value = connector.account?.address;
    buttonText.value = `✅ ${shortAddress(walletAddress.value)}`;
  }
});

const handleConnect = async () => {
  isLoading.value = true;
  try {
    const wallets = await connector.getWallets();
    const wallet = wallets.find(w => w.name === 'Telegram Wallet') || wallets[0];
    await connector.connect(wallet);
    walletAddress.value = connector.account?.address;
    buttonText.value = `✅ ${shortAddress(walletAddress.value)}`;
    await sendToBackend(walletAddress.value);
  } catch (error) {
    buttonText.value = '❌ Ошибка подключения';
  } finally {
    isLoading.value = false;
  }
};

const shortAddress = (addr) => addr ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : '';

const sendToBackend = async (address) => {
  const tg = window.Telegram?.WebApp;
  if (!tg) return;

  await fetch('https://your-backend.vercel.app/users/wallet', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${tg.initData}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ wallet_address: address })
  });
};
</script>

<style scoped>
.connect-button {
  padding: 10px 16px;
  background: #0088cc;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
}
.connect-button:disabled {
  opacity: 0.7;
}
</style>