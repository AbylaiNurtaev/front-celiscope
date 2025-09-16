import { Link, useNavigate } from 'react-router'
import { HomeIcon } from '../components/icons/home-icon'
import { Button } from '../components/ui/button'
import { LoaderIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useCreateGoal } from '../hooks/useGoal'
import {
	CreateGoalTitle,
	CreateGoalAttainable,
	CreateGoalAward,
	CreateGoalDeadline,
	CreateGoalDescription,
	CreateGoalMeasurable,
	CreateGoalPrivacy,
	CreateGoalRelevant,
	CreateGoalSpecific,
	CreateGoalSubGoal,
	CreateGoalTitleField,
	CreateGoalUrgency,
	CreateGoalImageField,
} from '../components/create-goal'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

interface Form {
	title: string
	urgencyLevel: 'LOW' | 'AVERAGE' | 'HIGH'
	specific: string
	measurable: string
	attainable: string
	award: string
	description: string
	relevant: string
	privacy: 'PRIVATE' | 'PUBLIC'
	deadline: '3_MONTHS' | '6_MONTHS' | '1_YEAR'
	subGoals?: { description: string; deadline: Date }[]
	image?: File
}

export function CreateGoal() {
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const { register, handleSubmit, setValue, watch, reset } = useForm<Form>({
		defaultValues: {
			privacy: 'PRIVATE',
			deadline: '3_MONTHS',
			urgencyLevel: 'LOW',
		},
	})

	useEffect(() => {
		setValue(
			'description',
			`${watch('specific')}, ${watch('measurable')}, ${watch(
				'attainable'
			)}, ${watch('relevant')}\n\n${watch('award') ? `Награда: ${watch('award')}` : ''}`
		)
	}, [
		watch('specific'),
		watch('measurable'),
		watch('attainable'),
		watch('award'),
		watch('relevant'),
	])

	const { mutate: createGoal, isPending } = useCreateGoal(() => {
		reset()
		queryClient.invalidateQueries({ queryKey: ['get goals'] })
		setTimeout(() => navigate('/'), 1000)
	})

	return (
		<section className='relative pb-20'>
			<Link to='/' className='p-3 flex justify-end'>
				<HomeIcon />
			</Link>

			<CreateGoalTitle />

			<form
				onSubmit={handleSubmit(data => {
					console.log('Form data before cleaning:', data)
					
					if (!data.subGoals || data.subGoals.length === 0) {
						toast.error('Пожалуйста, добавьте хотя бы одну задачу')
						return
					}
					
					const cleanedData = {
						...data,
						description: data.description,
						award: data.award ? `Награда: ${data.award}` : undefined,
						subGoals: data.subGoals?.map(subGoal => ({
							description: subGoal.description,
							deadline: subGoal.deadline
						}))
					}
					console.log('Cleaned data to send:', cleanedData)
					createGoal({
						data: cleanedData
					})
				})}
			>
				<section className='px-4 pt-5 flex flex-col gap-5 w-full'>
					<CreateGoalTitleField register={register} />
					<CreateGoalUrgency setValue={setValue} watch={watch} />
				</section>

				<div className='bg-[#27448D] my-5 py-0.5 text-center text-white text-lg text-semibold'>
					<span>Описание цели</span>
				</div>

				<section className='flex flex-col gap-5 px-4'>
					<CreateGoalSpecific register={register} />
					<CreateGoalMeasurable register={register} />
					<CreateGoalAttainable register={register} />
					<CreateGoalRelevant register={register} />
					<CreateGoalDescription register={register} />
					<CreateGoalAward register={register} />
					<CreateGoalDeadline setValue={setValue} />
					<CreateGoalSubGoal watch={watch} setValue={setValue} />
					<CreateGoalImageField watch={watch} setValue={setValue} />
					<CreateGoalPrivacy setValue={setValue} watch={watch} />
				</section>
			</form>
			
			{/* Фиксированная кнопка внизу */}
			<div className='fixed flex justify-end bottom-0 left-0 right-0  p-4 z-10'>
				<Button 
					type='submit' 
					className='' 
					disabled={isPending}
					onClick={handleSubmit(data => {
						console.log('Form data before cleaning:', data)
						
						if (!data.subGoals || data.subGoals.length === 0) {
							toast.error('Пожалуйста, добавьте хотя бы одну задачу')
							return
						}
						
						const cleanedData = {
							...data,
							description: data.description,
							award: data.award ? `Награда: ${data.award}` : undefined,
							subGoals: data.subGoals?.map(subGoal => ({
								description: subGoal.description,
								deadline: subGoal.deadline
							}))
						}
						console.log('Cleaned data to send:', cleanedData)
						createGoal({
							data: cleanedData
						})
					})}
				>
					{isPending && <LoaderIcon className='animate-spin mr-2' />}
					{isPending ? 'Сохранение...' : 'Готово'}
				</Button>
			</div>
		</section>
	)
}
