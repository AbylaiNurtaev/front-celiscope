import {
	Bar,
	BarChart,
	Line,
	LineChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from 'recharts'

const barChartData = [
	{ name: '1 Цель', percent: 60 },
	{ name: '2 Цель', percent: 90 },
	{ name: '3 Цель', percent: 40 },
]

const lineChartData = [
	{ name: 'Янв.', goals: 3 },
	{ name: 'Фев.', goals: 1 },
	{ name: 'Март', goals: 8 },
	{ name: 'Апр.', goals: 4 },
	{ name: 'Май', goals: 12 },
	{ name: 'Июнь', goals: 15 },
	{ name: 'Июль', goals: 10 },
	{ name: 'Авг.', goals: 4 },
	{ name: 'Сент.', goals: 1 },
	{ name: 'Окт.', goals: 0 },
	{ name: 'Нояб.', goals: 2 },
	{ name: 'Дек.', goals: 15 },
]

export function HomeStatistics() {
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
								Всего целей: <span className='font-bold'>100</span>
							</span>
							<span className='text-lg font-normal text-nowrap max-[520px]:text-sm max-[440px]:text-xs'>
								Прогрес целей | <span className='font-bold'>ТОП 10</span>
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
								<YAxis dataKey='percent' fontSize={12} max={100} min={0} />
								<Bar dataKey='percent' fill='url(#gradient1)' />
							</BarChart>
						</ResponsiveContainer>
					</div>
					<div className='relative flex flex-col p-2'>
						<span className='font-normal text-sm text-nowrap'>
							Выполненые задачи:
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
