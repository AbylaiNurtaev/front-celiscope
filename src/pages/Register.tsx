import { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'
import {
	RegisterTitle,
	RegisterUserInfo,
	RegisterAgreements,
	RegisterPin,
	RegisterUsername,
} from '../components/register'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router'
import { useInitData } from '../hooks/useInitData'
import { userService } from '../services/user.service'
import { LoaderIcon } from 'lucide-react'
import { useAuthStore } from '../store/auth.store'

export function RegisterPage() {
	const navigate = useNavigate()
	const initData = useInitData()
	const { setIsAuth, setUser } = useAuthStore()

	const [isLoading, setIsLoading] = useState<boolean>(false)

	useEffect(() => {
		const checkUserExists = async () => {
			setIsLoading(true)
			const user = await userService.getUser(
				initData?.user?.id.toString() || ''
			)
			if (user.data) {
				// Пользователь уже существует, авторизуем его
				setUser(user.data)
				setIsAuth(true)
				navigate('/')
			}
			setIsLoading(false)
		}

		checkUserExists()
	}, [initData, navigate, setUser, setIsAuth])

	const [personalDataAgreement, setPersonalDataAgreement] =
		useState<boolean>(true)

	// const [pin, setPin] = useState<string>('')

	const [privacyPolicyAgreement, setPrivacyPolicyAgreement] =
		useState<boolean>(true)

	const { mutate, isPending } = useAuth(() =>
		setTimeout(() => {
			navigate('/')
		}, 1000)
	)

	const auth = () => {
		window.scrollTo(0, 0)
		// Автоматически авторизуем пользователя без PIN-кода
		if (initData) {
			// Создаем заглушку пользователя
			const mockUser = {
				id: initData.user?.id.toString() || '',
				firstName: initData.user?.first_name || '',
				lastName: initData.user?.last_name || '',
				username: initData.user?.username || '',
				photoUrl: initData.user?.photo_url || '',
				inviteCode: 'default', // Добавляем обязательное поле
				// pin: pin, // Убираем PIN
			}
			
			// Устанавливаем пользователя как авторизованного
			setUser(mockUser)
			setIsAuth(true)
			
			// Вызываем мутацию для совместимости
			mutate({ initData, pin: '0000' })
		}
	}

	return !isLoading ? (
		<section className='pt-6 overflow-y-hidden'>
			<RegisterTitle />
			<RegisterUserInfo user={initData?.user} />
			<RegisterUsername user={initData?.user} />
			<RegisterAgreements
				personalDataAgreement={personalDataAgreement}
				setPersonalDataAgreement={setPersonalDataAgreement}
				privacyPolicyAgreement={privacyPolicyAgreement}
				setPrivacyPolicyAgreement={setPrivacyPolicyAgreement}
			/>
			<RegisterPin />

			<div className='flex w-full justify-center'>
				<Button
					onClick={auth}
					className='mt-10'
					disabled={
						// pin.trim().length !== 4 ||
						!privacyPolicyAgreement ||
						!personalDataAgreement ||
						isPending
					}
				>
					Далее
				</Button>
			</div>
		</section>
	) : (
		<section className='overflow-y-hidden fixed flex items-center gap-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
			<LoaderIcon className='animate-spin' />
			<span>Загрузка...</span>
		</section>
	)
}
