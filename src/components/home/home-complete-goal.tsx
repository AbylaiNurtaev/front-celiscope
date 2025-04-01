import { useContext, useEffect } from 'react'
import { Button } from '../ui/button'
import { DialogContext } from '../ui/dialog'
import { useCompleteGoal } from '../../hooks/useGoal'

export function HomeCompleteGoal({ goalId }: { goalId: number }) {
	const dialogContextValues = useContext(DialogContext)
	const closeDialog = dialogContextValues?.closeDialog
	const { mutate: completeGoal, isPending, isSuccess } = useCompleteGoal(goalId)

	useEffect(() => {
		if (isSuccess) closeDialog?.()
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
		</>
	)
}
