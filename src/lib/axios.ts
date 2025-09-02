import axios from 'axios'
import { toast } from 'react-hot-toast'
import { getAccessToken } from '../services/auth/auth.helper'
import { authService } from '../services/auth/auth.service'

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
})

// Добавляем токен в заголовок Authorization для каждого запроса
api.interceptors.request.use(config => {
	const accessToken = getAccessToken()
	if (accessToken && config) {
		config.headers['Authorization'] = `Bearer ${accessToken}`
	}
	return config
})

// Обрабатываем ошибки авторизации и автоматически обновляем токен
api.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config

		// Если получили 401 и это не запрос на обновление токена
		if (error?.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true

			try {
				// Пытаемся обновить токен
				await authService.refresh()
				
				// Повторяем оригинальный запрос с новым токеном
				const newToken = getAccessToken()
				if (newToken) {
					originalRequest.headers['Authorization'] = `Bearer ${newToken}`
					return api(originalRequest)
				}
			} catch (refreshError) {
				// Если не удалось обновить токен, перенаправляем на страницу входа
				toast.error('Сессия истекла. Пожалуйста, войдите заново.')
				// Можно добавить редирект на страницу входа
				// window.location.href = '/login'
			}
		}

		// Обрабатываем другие ошибки
		if (error?.response?.status && error.response.status >= 500) {
			toast.error('Случилась ошибка сервера. Пожалуйста, попробуйте позже.')
		} else if (error?.response?.data?.message) {
			toast.error(error.response.data.message)
		} else if (error.message) {
			toast.error(error.message)
		}
		
		return Promise.reject(error)
	}
)
