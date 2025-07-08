import { computed } from 'vue'
import { useMiniApp } from 'vue-tg/latest'

export function useTelegram() {
  const miniApp = useMiniApp()
  const tg = computed(() => miniApp)
  const user = computed(() => miniApp.initDataUnsafe?.user)
  return { tg, user }
} 