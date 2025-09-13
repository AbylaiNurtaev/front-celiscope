import {
	Bar,
	BarChart,
	Line,
	LineChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from 'recharts'
import { useGetGoals } from '../../hooks/useGoal'
import { Goal } from '../../types/goal'
import { useMemo } from 'react'

export function HomeStatistics() {
	const { data: goalsData } = useGetGoals()
	
	// Подготавливаем данные для графика прогресса целей
	const barChartData = useMemo(() => {
		if (!goalsData?.data) return []
		
		// Фильтруем незавершенные цели и сортируем по дате создания (новые сверху)
		return goalsData.data
			.filter((goal: Goal) => !goal.isCompleted)
			.sort((a: Goal, b: Goal) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
			.slice(0, 10)
			.map((goal: Goal, index: number) => {
				// Вычисляем процент выполнения на основе подцелей
				const totalSubGoals = goal.subGoals?.length || 0
				const completedSubGoals = goal.subGoals?.filter(sub => sub.isCompleted).length || 0
				const percent = totalSubGoals > 0 
					? Math.round((completedSubGoals / totalSubGoals) * 100) 
					: 0
					
				return {
					name: `№${index + 1}`,
					percent
				}
			})
	}, [goalsData])
	
	// Подготавливаем данные для графика выполненных задач по месяцам
	const lineChartData = useMemo(() => {
		if (!goalsData?.data) return []
		
		// Создаем массив для всех месяцев
		const months = [
			'Янв.', 'Фев.', 'Март', 'Апр.', 'Май', 'Июнь',
			'Июль', 'Авг.', 'Сент.', 'Окт.', 'Нояб.', 'Дек.'
		]
		
		// Инициализируем данные для каждого месяца
		const monthlyData = months.map(name => ({ name, goals: 0 }))
		
		// Подсчитываем выполненные цели по месяцам
		goalsData.data.forEach((goal: Goal) => {
			if (goal.isCompleted && goal.completedAt) {
				const completedDate = new Date(goal.completedAt)
				const monthIndex = completedDate.getMonth()
				monthlyData[monthIndex].goals++
			}
		})
		
		return monthlyData
	}, [goalsData])
	
	// Подсчитываем общее количество целей
	const totalGoals = goalsData?.data?.length || 0
	
	// Подсчитываем количество выполненных целей
	const completedGoals = goalsData?.data?.filter((goal: Goal) => goal.isCompleted).length || 0

	return (
		<section className='font-bold text-lg w-full pt-2 px-4'>
			<div className='relative p-[3px] rounded-xl'>
				<div
					className='absolute inset-0 rounded-lg'
					style={{
						background: 'linear-gradient(90deg, #2F51A8 0%, #122042 100%)',
					}}
				/>
				<div className='relative bg-white grid grid-cols-1 grid-rows-2 rounded-md'>
					<div className='border-b-2 border-[#2F51A8] flex flex-col pt-2 px-2'>
						<div className='w-full flex items-center justify-between max-[380px]:flex-col mb-5'>
							<span className='text-lg font-normal text-nowrap max-[520px]:text-sm max-[440px]:text-xs'>
								Всего целей: <span className='font-bold'>{totalGoals}</span>
							</span>
							<span className='text-lg font-normal text-nowrap max-[520px]:text-sm max-[440px]:text-xs'>
								Прогресс целей | <span className='font-bold'>ТОП {Math.min(10, goalsData?.data?.filter((goal: Goal) => !goal.isCompleted).length || 0)}</span>
							</span>
						</div>
						<ResponsiveContainer height={120} className='-ml-5'>
							<BarChart height={120} data={barChartData}>
								<defs>
									<linearGradient
										id='gradient1'
										x1='0%'
										y1='0%'
										x2='0%'
										y2='100%'
									>
										<stop offset='0%' stopColor='#2F51A8' stopOpacity={1} />
										<stop offset='100%' stopColor='#122042' stopOpacity={1} />
									</linearGradient>
								</defs>

								<XAxis dataKey='name' fontSize={12} />
								<YAxis dataKey='percent' fontSize={12} max={100} min={0} tickFormatter={(value) => `${value}%`} />
								<Bar dataKey='percent' fill='url(#gradient1)' />
							</BarChart>
						</ResponsiveContainer>
					</div>
					<div className='relative flex flex-col p-2'>
						<span className='font-normal text-sm text-nowrap'>
							Выполненные задачи: <span className='font-bold'>{completedGoals}</span>
						</span>
						<div className='w-full'>
							<ResponsiveContainer height={120} className='mt-4 -ml-6'>
								<LineChart height={120} data={lineChartData}>
									<XAxis dataKey='name' fontSize={10} />
									<YAxis dataKey='goals' fontSize={12} />
									<Line dataKey='goals' dot={false} />
								</LineChart>
							</ResponsiveContainer>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
