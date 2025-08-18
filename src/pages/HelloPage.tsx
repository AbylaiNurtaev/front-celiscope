import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuthStore } from '../store/auth.store'

export function HelloPage() {
	const navigate = useNavigate()
	const { isAuth } = useAuthStore()

	useEffect(() => {
		setTimeout(() => {
			sessionStorage.setItem('helloShown', 'true')
			// Если пользователь уже авторизован, идем на главную
			// Иначе на регистрацию
			navigate(isAuth ? '/' : '/register')
		}, 2000)
	}, [navigate, isAuth])

	return (
		<section className='overflow-y-auto fixed top-1/2 -translate-y-1/2 flex items-center'>
			<div>
				<img src='/logo.png' alt='Целескоп' className='w-1/2 mx-auto' />
				<h1 className='font-bold text-3xl text-center mt-5'>Целескоп</h1>
			</div>
		</section>
	)
}
