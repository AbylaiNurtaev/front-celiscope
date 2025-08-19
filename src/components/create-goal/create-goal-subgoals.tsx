import { CheckIcon, EditIcon, XIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
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
	const [subGoalDateTemp, setSubGoalDateTemp] = useState<Date | null>(null)
	const [subGoalCreateOpen, setSubGoalCreateOpen] = useState<boolean>(false)
	const [editingIndex, setEditingIndex] = useState<number | null>(null)
	const [subGoalDateInput, setSubGoalDateInput] = useState<string>('')
	const hiddenDateRef = useRef<HTMLInputElement | null>(null)
	const dateTextRef = useRef<HTMLInputElement | null>(null)

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
		// Обновляем текстовое поле только если есть дата
		if (subGoalDateTemp instanceof Date) {
			setSubGoalDateInput(formatDateToInputString(subGoalDateTemp))
		}
	}, [subGoalDateTemp])

	function buildFormattedFromDigits(digits: string) {
		let formatted = ''
		const len = digits.length
		if (len >= 1) {
			formatted += digits.slice(0, Math.min(2, len))
		}
		if (len >= 3) {
			formatted += '.' + digits.slice(2, Math.min(4, len))
		} else if (len > 2) {
			formatted += '.' + digits.slice(2)
		}
		if (len >= 5) {
			formatted += '.' + digits.slice(4, Math.min(8, len))
		} else if (len > 4) {
			formatted += '.' + digits.slice(4)
		}
		if (len >= 9) {
			formatted += ' ' + digits.slice(8, Math.min(10, len))
		} else if (len > 8) {
			formatted += ' ' + digits.slice(8)
		}
		if (len >= 11) {
			formatted += ':' + digits.slice(10, Math.min(12, len))
		} else if (len > 10) {
			formatted += ':' + digits.slice(10)
		}
		return formatted
	}

	function formattedIndexFromDigitsCount(dCount: number) {
		let idx = dCount
		if (dCount >= 3) idx++ // после дд -> '.'
		if (dCount >= 5) idx++ // после мм -> '.'
		if (dCount >= 9) idx++ // после гггг -> ' '
		if (dCount >= 11) idx++ // после чч -> ':'
		return idx
	}

	function handleDateTextChange(e: React.ChangeEvent<HTMLInputElement>) {
		const raw = e.target.value
		const caret = e.target.selectionStart ?? raw.length
		const digitsUpToCaret = raw.slice(0, caret).replace(/\D/g, '').length
		const digits = raw.replace(/\D/g, '').slice(0, 12)

		const formatted = buildFormattedFromDigits(digits)
		setSubGoalDateInput(formatted)

		const parsed = parseInputToDate(formatted)
		if (parsed) setSubGoalDateTemp(parsed)
		if (digits.length === 0) setSubGoalDateTemp(null)

		const mapped = Math.min(formattedIndexFromDigitsCount(Math.min(digitsUpToCaret, digits.length)), formatted.length)
		requestAnimationFrame(() => {
			const node = dateTextRef.current
			if (node) node.setSelectionRange(mapped, mapped)
		})
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
		setSubGoalTemp('')
		// Сбрасываем дату и инпут
		setSubGoalDateTemp(null)
		setSubGoalDateInput('')
		setSubGoalCreateOpen(false)
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
		setSubGoalDateInput(nextDate ? formatDateToInputString(nextDate) : '')
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
		setSubGoalTemp('')
		// Сбрасываем дату и инпут
		setSubGoalDateTemp(null)
		setSubGoalDateInput('')
		setSubGoalCreateOpen(false)
		setEditingIndex(null)
	}

	function openNativePicker(e?: React.MouseEvent) {
		e?.preventDefault()
		e?.stopPropagation()
		const input = hiddenDateRef.current
		if (!input) return
		// Показываем нативный пикер, не прокручивая страницу
		// showPicker поддерживается не везде
		// @ts-ignore
		if (typeof input.showPicker === 'function') {
			// @ts-ignore
			input.showPicker()
		} else {
			input.click()
		}
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
								до {goal.deadline instanceof Date ? Intl.DateTimeFormat().format(goal.deadline) : goal.deadline ? Intl.DateTimeFormat().format(new Date(goal.deadline)) : 'Не указана'}
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
											ref={dateTextRef}
											type='text'
											placeholder='дд.мм.гггг чч:мм'
											value={subGoalDateInput}
											onChange={handleDateTextChange}
											onBlur={() => {
												const d = parseInputToDate(subGoalDateInput)
												if (d) setSubGoalDateTemp(d)
											}}
											className='w-full outline-none resize-none border p-2 rounded-md border-gray-100'
										/>
										<Button
											type='button'
											onMouseDown={e => {
												e.preventDefault()
												e.stopPropagation()
											}}
											onClick={openNativePicker}
											className='aspect-square !p-2 rounded-md'
										>
											<CalendarIcon />
										</Button>
										<input
											ref={hiddenDateRef}
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
											className='absolute opacity-0 w-0 h-0 p-0 m-0 pointer-events-none'
										/>
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
