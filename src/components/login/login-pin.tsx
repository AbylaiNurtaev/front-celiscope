import OTPInput from '../ui/otp-input'

interface Props {
	setPin: (pin: string) => void
}

export function LoginPin({ setPin }: Props) {
	return (
		<div className='mt-12 px-3'>
			<div
				className='rounded-t-lg text-white px-2 py-0.5 text-sm'
				style={{
					background: 'linear-gradient(90deg, #2F51A8 0%, #122042 100%)',
				}}
			>
				Введи PIN
			</div>
			<div className='relative p-[3px] rounded-xl'>
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
	)
}
