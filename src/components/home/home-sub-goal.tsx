import clsx from 'clsx'
import { SubGoal } from '../../types/goal'
import { useCompleteSubGoal, useUncompleteSubGoal } from '../../hooks/useGoal'
import { useState, useEffect } from 'react'

interface Props {
	subGoal: SubGoal
	index: number
}

export function HomeSubGoal({ subGoal, index }: Props) {
	const { mutate: complete } = useCompleteSubGoal(subGoal.id)
	const { mutate: uncomplete } = useUncompleteSubGoal(subGoal.id)

	const [isExpired, setIsExpired] = useState(false)
	const [isCompleted, setIsCompleted] = useState(false)

	useEffect(() => {
		setIsCompleted(subGoal.isCompleted)
		setIsExpired(!subGoal.isCompleted && new Date(subGoal.deadline) < new Date())
	}, [subGoal.isCompleted, subGoal.deadline])

	const handleCheckboxChange = () => {
		if (isCompleted) {
			uncomplete()
			setIsCompleted(false)
		} else {
			complete()
			setIsCompleted(true)
		}
	}

	return (
		<tr
			className={clsx('border-b border-[#2F51A8]', {
				'border-t': index == 1,
				'bg-[#65CF2966]': isCompleted,
				'bg-[#C6151585]': isExpired,
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
					onChange={handleCheckboxChange}
					checked={isCompleted}
					type='checkbox'
					className='ml-auto checkbox'
				/>
			</td>
		</tr>
	)
}
