import { UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { Block } from '../ui/block'
import { Button } from '../ui/button'

export function CreateGoalImageField({
	setValue,
	watch,
}: {
	setValue: UseFormSetValue<any>
	watch: UseFormWatch<any>
}) {
	return (
		<Block title='Загрузить фото'>
			<div className='w-full px-4'>
				<Button
					type='button'
					onClick={() => document.getElementById('image')?.click()}
				>
					Загрузить
				</Button>
				<input
					type='file'
					id='image'
					className='hidden'
					onChange={e => setValue('image', e.target.files?.[0])}
				/>
				{watch('image') && <p className='mt-2'>{watch('image')?.name}</p>}
			</div>
		</Block>
	)
}
