import { useContext, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { DialogContext } from '../ui/dialog'
import { useCompleteGoal, useGetGoal } from '../../hooks/useGoal'
import { AchievementPopup } from '../AchievementPopup'

export function HomeCompleteGoal({ goalId }: { goalId: number }) {
	const dialogContextValues = useContext(DialogContext)
	const closeDialog = dialogContextValues?.closeDialog
	const [showAchievement, setShowAchievement] = useState(false)
	const { mutate: completeGoal, isPending, isSuccess } = useCompleteGoal(goalId)
	const { data: goal } = useGetGoal(goalId)

	useEffect(() => {
		if (isSuccess) {
			setShowAchievement(true)
			setTimeout(() => {
				setShowAchievement(false)
				closeDialog?.()
			}, 2000)
		}
	}, [isSuccess])

	return (
		<>
			<Button
				disabled={isPending}
				onClick={() => document.getElementById('confirm-image')?.click()}
			>
				{isPending ? 'Обработка...' : 'Загрузить фото'}
			</Button>
			<input
				type='file'
				name='confirm-image'
				id='confirm-image'
				className='hidden'
				onChange={e => completeGoal(e.target.files?.[0])}
			/>
			<AchievementPopup 
				isOpen={showAchievement} 
				onClose={() => setShowAchievement(false)}
				award={goal?.award}
			/>
		</>
	)
}
