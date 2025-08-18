import axios from 'axios'
import { toast } from 'react-hot-toast'
// import { getAccessToken } from '../services/auth/auth.helper'
// import { authService } from '../services/auth/auth.service'

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
})

// Убираем интерцептор запросов, так как токены больше не используются
// api.interceptors.request.use(config => {
// 	const accessToken = getAccessToken()
// 	if (accessToken && config) {
// 		config.headers['Authorization'] = `Bearer ${accessToken}`
// 	}
// 	return config
// })

// Упрощаем интерцептор ответов, убирая обработку ошибок авторизации
api.interceptors.response.use(
	response => response,
	async error => {
		// Обрабатываем только общие ошибки, не связанные с авторизацией
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
