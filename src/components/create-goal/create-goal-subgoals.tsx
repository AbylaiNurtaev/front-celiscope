import { CheckIcon, EditIcon, XIcon, Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'
import { UseFormSetValue, UseFormWatch } from 'react-hook-form'

import Popup from 'reactjs-popup'
import { Block } from '../ui/block'
import { Button } from '../ui/button'

export function CreateGoalSubGoal({
	watch,
	setValue,
}: {
	watch: UseFormWatch<any>
	setValue: UseFormSetValue<any>
}) {
	const [subGoalTemp, setSubGoalTemp] = useState<string>('')
	const [subGoalDateTemp, setSubGoalDateTemp] = useState<Date | null>(new Date())
	const [subGoalCreateOpen, setSubGoalCreateOpen] = useState<boolean>(false)
	const [editingIndex, setEditingIndex] = useState<number | null>(null)
	const [manualDateText, setManualDateText] = useState<string>('')

	const formatDateToManual = (date: Date): string => {
		const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)
		const dd = pad(date.getDate())
		const mm = pad(date.getMonth() + 1)
		const yyyy = date.getFullYear()
		const hh = pad(date.getHours())
		const min = pad(date.getMinutes())
		return `${dd}:${mm}:${yyyy} ${hh}:${min}`
	}

	const formatDigitsToManual = (digits: string): string => {
		let out = ''
		for (let i = 0; i < digits.length && i < 12; i++) {
			out += digits[i]
			if (i === 1 || i === 3) out += ':'
			if (i === 7) out += ' '
			if (i === 9) out += ':'
		}
		return out
	}

	const formatManualInput = (raw: string): string => {
		const digits = raw.replace(/\D/g, '')
		return formatDigitsToManual(digits)
	}

	const tryParseManual = (text: string): Date | null => {
		const m = text.match(/^(\d{2}):(\d{2}):(\d{4}) (\d{2}):(\d{2})$/)
		if (!m) return null
		const [, ddStr, mmStr, yyyyStr, hhStr, minStr] = m
		const dd = Number(ddStr)
		const mm = Number(mmStr)
		const yyyy = Number(yyyyStr)
		const hh = Number(hhStr)
		const min = Number(minStr)
		if (mm < 1 || mm > 12 || dd < 1 || dd > 31 || hh > 23 || min > 59) return null
		const d = new Date(yyyy, mm - 1, dd, hh, min)
		return isNaN(d.getTime()) ? null : d
	}

	useEffect(() => {
		setSubGoalCreateOpen(false)
	}, [watch('subGoals')])

	const handleAddSubGoal = () => {
		const subGoals = watch('subGoals') || []
		setValue('subGoals', [
			...subGoals,
			{
				description: subGoalTemp,
				deadline: subGoalDateTemp || new Date()
			},
		])
		setSubGoalTemp('')
		setSubGoalDateTemp(new Date())
		setSubGoalCreateOpen(false)
	}

	const handleRemoveSubGoal = (index: number) => {
		const value = watch('subGoals')?.filter((_: any, i: number) => i !== index)
		setValue('subGoals', value)
	}

	const handleEditSubGoal = (index: number) => {
		const subGoal = watch('subGoals')[index]
		setSubGoalTemp(subGoal.description)
		const d = subGoal.deadline ? new Date(subGoal.deadline) : new Date()
		setSubGoalDateTemp(d)
		setManualDateText(formatDateToManual(d))
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
		setSubGoalDateTemp(new Date())
		setSubGoalCreateOpen(false)
		setEditingIndex(null)
	}

	const handleCloseSubGoal = () => {
		setSubGoalTemp('')
		setSubGoalDateTemp(new Date())
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
								onOpen={() => setSubGoalCreateOpen(true)}
								onClose={handleCloseSubGoal}
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
										value={subGoalTemp}
										onChange={e => setSubGoalTemp(e.target.value)}
										placeholder='Введите задачу'
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
											placeholder='ДД:ММ:ГГГГ ЧЧ:ММ'
											value={manualDateText}
											onChange={e => {
												const formatted = formatManualInput(e.target.value)
												setManualDateText(formatted)
												const parsed = tryParseManual(formatted)
												if (parsed) setSubGoalDateTemp(parsed)
											}}
											onKeyDown={e => {
												if (e.key === 'Backspace' && manualDateText) {
													e.preventDefault()
													const digits = manualDateText.replace(/\D/g, '')
													const nextDigits = digits.slice(0, -1)
													const nextFormatted = formatDigitsToManual(nextDigits)
													setManualDateText(nextFormatted)
													const parsed = tryParseManual(nextFormatted)
													if (parsed) setSubGoalDateTemp(parsed)
												}
											}}
											className='w-4/5 outline-none resize-none border p-2 rounded-md border-gray-100'
										/>
										<div className='relative w-1/5'>
											<input
												type='datetime-local'
												className='absolute inset-0 opacity-0 cursor-pointer z-10'
												onChange={e => {
													if (e.target.value) {
														const d = new Date(e.target.value)
														setSubGoalDateTemp(d)
														setManualDateText(formatDateToManual(d))
													}
												}}
											/>
											<Button type='button' className='!p-2 w-full rounded-md flex items-center justify-center pointer-events-none'>
												<Calendar size={18} />
											</Button>
										</div>
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
