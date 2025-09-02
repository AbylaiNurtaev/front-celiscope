import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router'
import {
	LoginTitle,
	LoginUserInfo,
	LoginUsername,
} from '../components/login'
import { useInitData } from '../hooks/useInitData'
import { userService } from '../services/user.service'
import { IUser } from '../types/user'
import { LoaderIcon } from 'lucide-react'

export function LoginPage() {
	const navigate = useNavigate()
	const initData = useInitData()

	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [user, setUser] = useState<IUser | null>(null)

	useEffect(() => {
		const checkUserExists = async () => {
			setIsLoading(true)
			const user = await userService.getUser(
				initData?.user?.id.toString() || ''
			)
			if (!user.data) {
				navigate('/register')
			} else {
				setUser(user.data)
				// Автоматически авторизуем пользователя без PIN-кода
				auth()
			}
			setIsLoading(false)
		}

		checkUserExists()
	}, [initData])

	const { mutate, isPending } = useAuth(() =>
		setTimeout(() => {
			navigate('/')
		}, 1000)
	)

	const auth = () => {
		if (initData) {
			// Отправляем пустой PIN или заглушку для совместимости с бэкендом
			mutate({ initData, pin: '0000' })
		}
	}

	return !isLoading ? (
		<section className='pt-6 overflow-y-hidden'>
			<LoginTitle />
			<LoginUserInfo
				photoUrl={user?.photoUrl ?? initData?.user?.photo_url}
				firstName={user?.firstName ?? initData?.user?.first_name}
				lastName={user?.lastName ?? initData?.user?.last_name}
			/>
			<LoginUsername userName={user?.username ?? initData?.user?.username} />

			<div className='flex w-full justify-center mt-10'>
				{isPending ? (
					<div className='flex items-center gap-2'>
						<LoaderIcon className='animate-spin' />
						<span>Авторизация...</span>
					</div>
				) : (
					<div className='text-center'>
						<p className='text-gray-600'>Автоматическая авторизация...</p>
					</div>
				)}
			</div>
		</section>
	) : (
		<section className='overflow-y-hidden fixed top-1/2 gap-2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center'>
			<LoaderIcon className='animate-spin' />
			<span>Загрузка...</span>
		</section>
	)
}
