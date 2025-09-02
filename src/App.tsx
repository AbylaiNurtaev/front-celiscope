import { Route, Routes, useLocation, useNavigate } from 'react-router'
import { useEffect } from 'react'
import { useAuthStore } from './store/auth.store'

import { SettingsPage } from './pages/SettingsPage'
import { PrivacyPolicyPage } from './pages/PrivacyPolicy'
import { HomePage } from './pages/Home'
import { RegisterPage } from './pages/Register'
import { PersonalDataAgreementPage } from './pages/PersonalDataAgreement'
import { HelloPage } from './pages/HelloPage'
import { LoginPage } from './pages/Login'
import { CreateGoal } from './pages/CreateGoal'
import { EditGoal } from './pages/EditGoal'
import { friendshipService } from './services/friendship.service'
// import { useInitData } from './hooks/useInitData'
import { getAccessToken } from './services/auth/auth.helper'
import { useRefresh } from './hooks/useAuth'

const PAGES_WITHOUT_AUTH = [
	'/register',
	'/hello',
	'/login',
	'/privacy-policy',
	'/personal-data-agreement',
]

function App() {
	const { isAuth } = useAuthStore()
	const location = useLocation()
	const navigate = useNavigate()
	const { mutate: refreshToken } = useRefresh()

	// Проверяем токен при загрузке приложения
	useEffect(() => {
		const token = getAccessToken()
		if (token && !isAuth) {
			// Пытаемся обновить токен для проверки его валидности
			refreshToken()
		}
	}, [isAuth, refreshToken])

	useEffect(() => {
		const inviteCode = window?.Telegram?.WebApp?.initDataUnsafe?.start_param
		if (!inviteCode?.includes('invite')) return

		const inviteId = inviteCode.split('_')[1]

		async function createFriendship() {
			if (isAuth && inviteId.length) {
				await friendshipService.createFriendship(inviteId)
			}
		}

		createFriendship()
	}, [isAuth])

	useEffect(() => {
		if (!isAuth && !PAGES_WITHOUT_AUTH.includes(location.pathname))
			navigate('/login')
	}, [isAuth, location.pathname, navigate])

	useEffect(() => {
		if (sessionStorage.getItem('helloShown') !== 'true') navigate('/hello')
	}, [navigate])

	return (
		<Routes>
			<Route path='/' element={<HomePage />} />
			<Route path='/hello' element={<HelloPage />} />
			<Route path='/register' element={<RegisterPage />} />
			<Route path='/login' element={<LoginPage />} />
			<Route path='/settings' element={<SettingsPage />} />
			<Route path='/privacy-policy' element={<PrivacyPolicyPage />} />
			<Route path='/create-goal' element={<CreateGoal />} />
			<Route path='/edit-goal/:id' element={<EditGoal />} />
			<Route
				path='/personal-data-agreement'
				element={<PersonalDataAgreementPage />}
			/>
		</Routes>
	)
}

export default App
