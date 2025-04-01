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
			navigate('/register')
	}, [isAuth, location.pathname])

	useEffect(() => {
		if (sessionStorage.getItem('helloShown') !== 'true') navigate('/hello')
	}, [sessionStorage.getItem('helloShown')])

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
