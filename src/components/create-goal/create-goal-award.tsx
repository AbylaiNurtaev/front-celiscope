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
				<input
					type='text'
					{...register('award')}
					required
					className='border-b-1 border-[#2F51A8] w-full outline-none'
				/>
			</div>
		</Block>
	)
}
