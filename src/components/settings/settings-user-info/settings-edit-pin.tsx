import { useNavigate } from 'react-router'
import { useEditUser } from '../../../hooks/useEditUser'
import { useAuthStore } from '../../../store/auth.store'
import { Button } from '../../ui/button'
import { useContext, useEffect, useState } from 'react'
import OTPInput from '../../ui/otp-input'
import { DialogContext } from '../../ui/dialog'

export function SettingsEditPin() {
	const DialogContextValues = useContext(DialogContext)
	const closeDialog = () => DialogContextValues?.closeDialog()

	const { user } = useAuthStore()
	const navigate = useNavigate()

	const [pin, setPin] = useState<string>('')

	const { mutate: editUser, isPending } = useEditUser(closeDialog)

	useEffect(() => {
		if (!user) navigate('/register')
	}, [user])

	return (
		<div className='flex flex-col gap-4 items-center w-full'>
			<div className='w-full'>
				<div
					className='rounded-t-lg text-white px-2 py-0.5 text-sm w-full'
					style={{
						background: 'linear-gradient(90deg, #2F51A8 0%, #122042 100%)',
					}}
				>
					Новый PIN
				</div>
				<div className='relative p-[3px] rounded-xl w-full'>
					<div
						className='absolute inset-0 rounded-b-lg'
						style={{
							background: 'linear-gradient(90deg, #2F51A8 0%, #122042 100%)',
						}}
					/>

					<div className='relative bg-white flex items-center justify-center rounded-b-md py-4'>
						<OTPInput length={4} onComplete={setPin} />
					</div>
				</div>
			</div>
			<Button
				onClick={() => editUser({ id: user!.id, data: { pin } })}
				disabled={pin.trim().length !== 4 || isPending}
			>
				Сменить
			</Button>
		</div>
	)
}
