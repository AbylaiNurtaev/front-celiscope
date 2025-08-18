// import { authService } from '../services/auth/auth.service'
// import { useMutation } from '@tanstack/react-query'
// import { InitData } from '@telegram-apps/sdk'
// import { toast } from 'react-hot-toast'

// export function useAuth(successCallback?: () => void) {
// 	return useMutation({
// 		mutationFn: async (data: { initData: InitData; pin: string }) => {
// 			return await authService.auth(data)
// 		},
// 		onSuccess: () => {
// 			toast.success('Успешно!')
// 			successCallback?.()
// 		},
// 	})
// }

// export function useRefresh() {
// 	return useMutation({
// 		mutationFn: async () => {
// 			return await authService.refresh()
// 		},
// 	})
// }

// Файл закомментирован - аутентификация по паролю больше не используется
export function useAuth(successCallback?: () => void) {
	return { 
		mutate: (_data: any) => {
			// Заглушка для совместимости
			if (successCallback) {
				setTimeout(successCallback, 100)
			}
		}, 
		isPending: false 
	}
}

export function useRefresh() {
	return { mutate: () => {} }
}
