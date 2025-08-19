import { CheckIcon, EditIcon, XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { UseFormSetValue, UseFormWatch } from 'react-hook-form'

import Popup from 'reactjs-popup'
import { Block } from '../ui/block'
import { Button } from '../ui/button'
import { CalendarIcon } from 'lucide-react'

export function CreateGoalSubGoal({
	watch,
	setValue,
}: {
	watch: UseFormWatch<any>
	setValue: UseFormSetValue<any>
}) {
	const [subGoalTemp, setSubGoalTemp] = useState<string>('')
	const [subGoalDateTemp, setSubGoalDateTemp] = useState<Date | null>()
	const [subGoalCreateOpen, setSubGoalCreateOpen] = useState<boolean>(false)
	const [editingIndex, setEditingIndex] = useState<number | null>(null)
	const [subGoalDateInput, setSubGoalDateInput] = useState<string>('')

	useEffect(() => {
		setSubGoalCreateOpen(false)
	}, [watch('subGoals')])

	function formatDateToInputString(date: Date) {
		const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)
		const dd = pad(date.getDate())
		const mm = pad(date.getMonth() + 1)
		const yyyy = date.getFullYear()
		const hh = pad(date.getHours())
		const min = pad(date.getMinutes())
		return `${dd}.${mm}.${yyyy} ${hh}:${min}`
	}

	function parseInputToDate(value: string): Date | null {
		// Форматы: dd.MM.yyyy HH:mm или dd.MM.yyyy
		const trimmed = value.trim()
		if (!trimmed) return null
		const dateTimeMatch = trimmed.match(/^([0-3]\d)\.([0-1]\d)\.(\d{4})(?:\s+([0-2]\d):([0-5]\d))?$/)
		if (!dateTimeMatch) return null
		const [, ddStr, mmStr, yyyyStr, hhStr, minStr] = dateTimeMatch
		const dd = Number(ddStr)
		const mm = Number(mmStr) - 1
		const yyyy = Number(yyyyStr)
		const hh = hhStr ? Number(hhStr) : 0
		const min = minStr ? Number(minStr) : 0
		const d = new Date(yyyy, mm, dd, hh, min, 0, 0)
		return isNaN(d.getTime()) ? null : d
	}

	useEffect(() => {
		if (subGoalDateTemp instanceof Date) {
			setSubGoalDateInput(formatDateToInputString(subGoalDateTemp))
		}
	}, [subGoalDateTemp])

	const handleAddSubGoal = () => {
		const subGoals = watch('subGoals') || []
		setValue('subGoals', [
			...subGoals,
			{
				description: subGoalTemp,
				deadline: subGoalDateTemp
			},
		])
		setSubGoalTemp('')
		const now = new Date()
		setSubGoalDateTemp(now)
		setSubGoalDateInput(formatDateToInputString(now))
		setSubGoalCreateOpen(false)
	}

	const handleRemoveSubGoal = (index: number) => {
		const value = watch('subGoals')?.filter((_: any, i: number) => i !== index)
		setValue('subGoals', value)
	}

	const handleEditSubGoal = (index: number) => {
		const subGoal = watch('subGoals')[index]
		setSubGoalTemp(subGoal.description)
		const nextDate = subGoal.deadline ? new Date(subGoal.deadline) : new Date()
		setSubGoalDateTemp(nextDate)
		setSubGoalDateInput(formatDateToInputString(nextDate))
		setEditingIndex(index)
		setSubGoalCreateOpen(true)
	}

	const handleUpdateSubGoal = () => {
		const subGoals = watch('subGoals') || []
		const updatedSubGoals = subGoals.map((subGoal: any, i: number) => {
			if (i === editingIndex) {
				return {
					...subGoal,
					description: subGoalTemp,
					deadline: subGoalDateTemp || new Date()
				}
			}
			return subGoal
		})
		setValue('subGoals', updatedSubGoals)
		setSubGoalTemp('')
		const now = new Date()
		setSubGoalDateTemp(now)
		setSubGoalDateInput(formatDateToInputString(now))
		setSubGoalCreateOpen(false)
		setEditingIndex(null)
	}

	return (
		<Block title='Перечень задач:'>
			<table className='w-full border-collapse border-t scale-95 border-[#2F51A8]'>
				<tbody className='w-full'>
					{watch('subGoals')?.map((goal: any, index: number) => (
						<tr key={index} className='border border-[#2F51A8] flex w-full'>
							<td className='border-r aspect-square border-[#2F51A8] py-2 px-4 text-center flex items-center justify-center'>
								{index + 1}
							</td>
							<td className='border-r border-[#2F51A8] px-4 w-full py-2 line-clamp-1 flex items-center'>
								{goal.description.length > 25
									? goal.description.slice(0, 25) + '...'
									: goal.description}
							</td>
							<td className='px-2 flex items-center w-full'>
								до {goal.deadline instanceof Date ? Intl.DateTimeFormat().format(goal.deadline) : 'Не указана'}
							</td>
							<td className='border-l border-[#2F51A8] px-2 py-2 flex flex-col items-center gap-4'>
								<button
									type='button'
									onClick={() => handleRemoveSubGoal(index)}
								>
									<XIcon size={24} />
								</button>
								<button type='button' onClick={() => handleEditSubGoal(index)}>
									<EditIcon size={24} />
								</button>
							</td>
						</tr>
					))}
					<tr>
						<td colSpan={3}>
							<Popup
								open={subGoalCreateOpen}
								contentStyle={{
									width: '80%',
								}}
								onOpen={() => {
									setSubGoalCreateOpen(true)
									if (!subGoalDateTemp) {
										const now = new Date()
										setSubGoalDateTemp(now)
										setSubGoalDateInput(formatDateToInputString(now))
									}
								}}
								onClose={() => setSubGoalCreateOpen(false)}
								position='top left'
								arrow={false}
								trigger={
									<button
										type='button'
										className='bg-[#2F51A8] aspect-square px-2 text-white text-xl flex items-center justify-center'
									>
										+
									</button>
								}
							>
								<div className='w-full flex items-center gap-2'>
									<textarea
										onChange={e => setSubGoalTemp(e.target.value)}
										placeholder='Введите описание'
										required
										className='w-full outline-none resize-none'
									/>
									<Button
										type='button'
										onClick={
											editingIndex !== null
												? handleUpdateSubGoal
												: handleAddSubGoal
											}
										className='aspect-square !p-2 rounded-sm'
									>
										<CheckIcon />
									</Button>
								</div>
								<div className='mt-3'>
									Крайний срок
									<div className='flex items-center gap-2 mt-2'>
										<input
											type='text'
											placeholder='дд.мм.гггг чч:мм'
											value={subGoalDateInput}
											onChange={e => setSubGoalDateInput(e.target.value)}
											onBlur={() => {
												const d = parseInputToDate(subGoalDateInput)
												if (d) setSubGoalDateTemp(d)
											}}
											className='w-full outline-none resize-none border p-2 rounded-md border-gray-100'
										/>
										<Popup
											trigger={
												<Button type='button' className='aspect-square !p-2 rounded-md'>
													<CalendarIcon />
												</Button>
											}
											position='bottom left'
											arrow={false}
										>
											<input
												type='datetime-local'
												onChange={e => {
													const d = new Date(e.target.value)
													if (!isNaN(d.getTime())) {
														setSubGoalDateTemp(d)
														setSubGoalDateInput(formatDateToInputString(d))
													}
												}}
												value={
													subGoalDateTemp
														? new Date(
																subGoalDateTemp.getTime() -
																	new Date().getTimezoneOffset() * 60000
															  )
																.toISOString()
																.slice(0, 16)
														: ''
												}
												className='w-full outline-none resize-none border p-2 rounded-md border-gray-100'
											/>
										</Popup>
									</div>
								</div>
							</Popup>
						</td>
					</tr>
				</tbody>
			</table>
		</Block>
	)
}
