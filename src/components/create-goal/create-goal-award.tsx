import { UseFormRegister } from 'react-hook-form'
import { Block } from '../ui/block'

export function CreateGoalAward({
	register,
}: {
	register: UseFormRegister<any>
}) {
	return (
		<Block title='Награда за выполнение цели'>
			<div className='w-full px-4'>
				<textarea
					{...register('award')}
					required
					className='border-b-1 border-[#2F51A8] w-full h-20 outline-none resize-none'
				/>
			</div>
		</Block>
	)
}
