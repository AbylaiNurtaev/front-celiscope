import { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'
import {
	RegisterTitle,
	RegisterUserInfo,
	RegisterAgreements,
	RegisterUsername,
} from '../components/register'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router'
import { useInitData } from '../hooks/useInitData'
import { userService } from '../services/user.service'
import { LoaderIcon } from 'lucide-react'

export function RegisterPage() {
	const navigate = useNavigate()
	const initData = useInitData()

	const [isLoading, setIsLoading] = useState<boolean>(false)

	useEffect(() => {
		const checkUserExists = async () => {
			setIsLoading(true)
			const user = await userService.getUser(
				initData?.user?.id.toString() || ''
			)
			if (user.data) {
				// Пользователь уже существует, перенаправляем на логин
				navigate('/login')
			}
			setIsLoading(false)
		}

		checkUserExists()
	}, [initData, navigate])

	const [personalDataAgreement, setPersonalDataAgreement] =
		useState<boolean>(true)

	const [privacyPolicyAgreement, setPrivacyPolicyAgreement] =
		useState<boolean>(true)

	const { mutate, isPending } = useAuth(() =>
		setTimeout(() => {
			navigate('/')
		}, 1000)
	)

	const auth = () => {
		window.scrollTo(0, 0)
		if (initData) {
			// Отправляем пустой PIN или заглушку для совместимости с бэкендом
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

			<div className='flex w-full justify-center'>
				<Button
					onClick={auth}
					className='mt-10'
					disabled={
						!privacyPolicyAgreement ||
						!personalDataAgreement ||
						isPending
					}
				>
					{isPending ? (
						<div className='flex items-center gap-2'>
							<LoaderIcon className='animate-spin' />
							<span>Регистрация...</span>
						</div>
					) : (
						'Далее'
					)}
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
