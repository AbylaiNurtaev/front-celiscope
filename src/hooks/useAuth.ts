import { authService } from '../services/auth/auth.service'
import { useMutation } from '@tanstack/react-query'
import { InitData } from '@telegram-apps/sdk'
import { toast } from 'react-hot-toast'

export function useAuth(successCallback?: () => void) {
	return useMutation({
		mutationFn: async (data: { initData: InitData }) => {
			return await authService.auth(data)
		},
		onSuccess: () => {
			toast.success('Успешно!')
			successCallback?.()
		},
	})
}

export function useRefresh() {
	return useMutation({
		mutationFn: async () => {
			return await authService.refresh()
		},
	})
}
