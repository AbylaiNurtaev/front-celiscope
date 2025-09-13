import { UseFormRegister } from 'react-hook-form'
import { Block } from '../ui/block'

export function CreateGoalDescription({
	register,
}: {
	register: UseFormRegister<any>
}) {
	return (
		<Block title='Полное описание цели:'>
			<div className='w-full px-4'>
				<textarea
					{...register('description')}
					required
					className='border-b-1 border-[#2F51A8] w-full h-40 outline-none resize-none'
				/>
			</div>
		</Block>
	)
}
