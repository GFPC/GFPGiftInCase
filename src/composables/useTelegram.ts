import { ref, onMounted, Ref } from 'vue'

interface TelegramUser {
  id: number
  is_bot: boolean
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}

interface TelegramWebApp {
  expand: () => void
  initData: string
  initDataUnsafe: { user?: TelegramUser }
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp
    }
  }
}

export function useTelegram() {
  const tg = window.Telegram?.WebApp
  const user: Ref<TelegramUser | null> = ref(null)

  onMounted(() => {
    if (tg) {
      tg.expand()
      user.value = tg.initDataUnsafe?.user || null
    }
  })

  return { tg, user }
} 