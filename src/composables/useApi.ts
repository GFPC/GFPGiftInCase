import axios from 'axios'

const API_URL = 'https://your-fastapi-backend.vercel.app'  // Замените на ваш URL

export function useApi() {
  const authHeaders = (): Record<string, string> => {
    const tg = window.Telegram?.WebApp
    return {
      'Authorization': `Bearer ${tg?.initData}`,
      'Content-Type': 'application/json'
    }
  }

  const createGift = async (receiver: string, amount: number): Promise<any> => {
    const response = await axios.post(`${API_URL}/gifts/create`, {
      receiver,
      amount
    }, { headers: authHeaders() })
    return response.data
  }

  return { createGift }
} 