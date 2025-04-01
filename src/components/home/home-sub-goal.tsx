import clsx from 'clsx'
import { SubGoal } from '../../types/goal'
import { useCompleteSubGoal } from '../../hooks/useGoal'
import { useState } from 'react'

interface Props {
	subGoal: SubGoal
	index: number
}

export function HomeSubGoal({ subGoal, index }: Props) {
	const { mutate: complete } = useCompleteSubGoal(subGoal.id)

	const [isExpired] = useState(
		new Date(subGoal.deadline) <
			(subGoal.completedAt ? new Date(subGoal.completedAt) : new Date())
	)
	const [isCompleted, setIsCompleted] = useState(subGoal.isCompleted)

	return (
		<tr
			className={clsx('border-b border-[#2F51A8]', {
				'border-t': index == 1,
				'bg-[#65CF2966]': subGoal.isCompleted,
				'bg-[#C6151585]': isExpired && !subGoal.isCompleted,
			})}
		>
			<td className='font-light text-sm px-2 py-2 border border-[#2F51A8] w-10 h-10 text-center'>
				{index}
			</td>
			<td
				className='font-light text-sm px-2 py-2 border border-[#2F51A8]'
				style={{ wordBreak: 'break-word' }}
			>
				{subGoal.description}
			</td>
			<td className='font-light text-sm px-2 py-2 border border-[#2F51A8]'>
				до {Intl.DateTimeFormat().format(new Date(subGoal.deadline))}
			</td>
			<td className='font-light text-sm px-2 py-2 border border-[#2F51A8]'>
				<input
					onChange={() => {
						complete()
						setIsCompleted(true)
					}}
					disabled={isCompleted}
					defaultChecked={subGoal.isCompleted}
					type='checkbox'
					className='ml-auto checkbox'
				/>
			</td>
		</tr>
	)
}
