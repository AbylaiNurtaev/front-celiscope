import { Link, useNavigate } from 'react-router'
import { HomeCreateGoal } from '../components/home/home-create-goal'
import { HomeList } from '../components/home/home-list'
import { HomeStatistics } from '../components/home/home-statistics'
import { SettingsIcon } from 'lucide-react'
import { useAuthStore } from '../store/auth.store'
import { useEffect } from 'react'
import { useInitData } from '../hooks/useInitData'
import { userService } from '../services/user.service'
import { useAuth } from '../hooks/useAuth'

export function HomePage() {
	const { isAuth } = useAuthStore()
	const initData = useInitData()
	const navigate = useNavigate()
	const { mutate: auth } = useAuth(undefined, false)

	useEffect(() => {
		// Авто-логин через Telegram initData, если пользователь уже есть
		async function tryAutoAuth() {
			if (isAuth) return
			const tgId = initData?.user?.id?.toString()
			if (!tgId) return
			try {
				const res = await userService.getUser(tgId)
				if (res?.data) {
					if (!initData) return
					auth({ initData: initData })
				} else {
					navigate('/register')
				}
			} catch {
				// В случае ошибки просто остаёмся на странице; /register покроет неавторизованных
			}
		}
		tryAutoAuth()
	}, [isAuth, initData])
	return (
		<section>
			<div className='px-4 flex items-end justify-between gap-1 w-full'>
				<h2 className='font-bold text-lg'>Статистика</h2>
				<Link to='/settings' className='flex flex-col gap-1 items-center mt-5'>
					<SettingsIcon color='#27448D' size={36} />
					<span className='text-xs'>Настройки</span>
				</Link>
			</div>
			<HomeStatistics />
			{isAuth && <HomeList />}
			<HomeCreateGoal className='fixed bottom-5 right-5 [&_button]:aspect-square [&_button]:px-3 [&_button]:py-1 text-4xl [&_button]:flex [&_button]:items-center [&_button]:justify-center' />
		</section>
	)
}
