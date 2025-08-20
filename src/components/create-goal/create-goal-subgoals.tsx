import { CheckIcon, EditIcon, XIcon, CalendarIcon, PencilIcon } from 'lucide-react'
import { useState } from 'react'
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
	const [subGoalDateTemp, setSubGoalDateTemp] = useState<Date | null>(null)
	const [subGoalCreateOpen, setSubGoalCreateOpen] = useState<boolean>(false)
	const [editingIndex, setEditingIndex] = useState<number | null>(null)
	const [manualInputVisible, setManualInputVisible] = useState<boolean>(false)
	const [manualInputValue, setManualInputValue] = useState<string>('')

	const formatDateReadable = (date: Date) => {
		const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)
		return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(
			date.getHours()
		)}:${pad(date.getMinutes())}`
	}

	function parseManualDate(value: string): Date | null {
		const match = value.match(/^(\d{2})\.(\d{2})\.(\d{4})\s(\d{2}):(\d{2})$/)
		if (!match) return null
		const [, ddStr, mmStr, yyyyStr, hhStr, minStr] = match
		const dd = Number(ddStr)
		const mm = Number(mmStr) - 1
		const yyyy = Number(yyyyStr)
		const hh = Number(hhStr)
		const min = Number(minStr)

		if (dd < 1 || dd > 31) return null
		if (mm < 0 || mm > 11) return null
		if (hh < 0 || hh > 23) return null
		if (min < 0 || min > 59) return null

		const d = new Date(yyyy, mm, dd, hh, min)
		return isNaN(d.getTime()) ? null : d
	}

	function formatWithMask(raw: string): string {
		const digits = raw.replace(/\D/g, '').slice(0, 12)
		let formatted = ''

		if (digits.length >= 2) {
			formatted += digits.slice(0, 2) + '.'
		} else {
			return digits
		}
		if (digits.length >= 4) {
			formatted += digits.slice(2, 4) + '.'
		} else {
			return formatted + digits.slice(2)
		}
		if (digits.length >= 8) {
			formatted += digits.slice(4, 8) + ' '
		} else {
			return formatted + digits.slice(4)
		}
		if (digits.length >= 10) {
			formatted += digits.slice(8, 10) + ':'
		} else {
			return formatted + digits.slice(8)
		}
		if (digits.length >= 12) {
			formatted += digits.slice(10, 12)
		} else {
			return formatted + digits.slice(10)
		}
		return formatted
	}

	const handleAddSubGoal = () => {
		const subGoals = watch('subGoals') || []
		setValue('subGoals', [
			...subGoals,
			{
				description: subGoalTemp,
				deadline: subGoalDateTemp || null,
			},
		])
		resetForm()
		setSubGoalCreateOpen(false) // ✅ Закрыть popup
	}

	const handleRemoveSubGoal = (index: number) => {
		const value = watch('subGoals')?.filter((_: any, i: number) => i !== index)
		setValue('subGoals', value)
	}

	const handleEditSubGoal = (index: number) => {
		const subGoal = watch('subGoals')[index]
		setSubGoalTemp(subGoal.description)
		const nextDate = subGoal.deadline ? new Date(subGoal.deadline) : null
		setSubGoalDateTemp(nextDate)
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
					deadline: subGoalDateTemp || null,
				}
			}
			return subGoal
		})
		setValue('subGoals', updatedSubGoals)
		resetForm()
		setSubGoalCreateOpen(false) // ✅ Закрыть popup
	}

	const resetForm = () => {
		setSubGoalTemp('')
		setSubGoalDateTemp(null)
		setManualInputVisible(false)
		setManualInputValue('')
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
								до{' '}
								{goal.deadline
									? formatDateReadable(new Date(goal.deadline))
									: 'Не указана'}
							</td>
							<td className='border-l border-[#2F51A8] px-2 py-2 flex flex-col items-center gap-4'>
								<button type='button' onClick={() => handleRemoveSubGoal(index)}>
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
							{/* Кнопка открытия */}
							<button
								type="button"
								className="bg-[#2F51A8] aspect-square px-2 text-white text-xl flex items-center justify-center"
								onClick={() => setSubGoalCreateOpen(true)}
							>
								+
							</button>

							<Popup
								open={subGoalCreateOpen}
								onClose={() => setSubGoalCreateOpen(false)}
								contentStyle={{ width: '80%' }}
								position="top left"
								arrow={false}
							>
								<div className="w-full flex items-center gap-2">
									<textarea
										onChange={e => setSubGoalTemp(e.target.value)}
										value={subGoalTemp}
										placeholder="Введите описание"
										required
										className="w-full outline-none resize-none"
									/>
									<Button
										type="button"
										onClick={
											editingIndex !== null ? handleUpdateSubGoal : handleAddSubGoal
										}
										className="aspect-square !p-2 rounded-sm"
									>
										<CheckIcon />
									</Button>
								</div>
								<div className="mt-3">
									Крайний срок
									<div className="flex items-center gap-2 mt-2">
										<CalendarIcon />
										<input
											type="datetime-local"
											onChange={e => {
												const d = new Date(e.target.value)
												if (!isNaN(d.getTime())) {
													setSubGoalDateTemp(d)
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
											className="w-full outline-none resize-none border p-2 rounded-md border-gray-100"
										/>
										<Button
											type="button"
											onClick={() => setManualInputVisible(v => !v)}
											className="aspect-square !p-2 rounded-md"
										>
											<PencilIcon />
										</Button>
									</div>
									{manualInputVisible && (
										<div className="mt-2">
											<input
												type="text"
												placeholder="дд.мм.гггг чч:мм"
												value={manualInputValue}
												onChange={e => {
													const masked = formatWithMask(e.target.value)
													setManualInputValue(masked)
													const d = parseManualDate(masked)
													if (d) setSubGoalDateTemp(d)
												}}
												className="w-full outline-none resize-none border p-2 rounded-md border-gray-100"
											/>
										</div>
									)}
								</div>
							</Popup>
						</td>
					</tr>
				</tbody>
			</table>
		</Block>
	)
}
