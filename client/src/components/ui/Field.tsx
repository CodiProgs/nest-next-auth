import { forwardRef } from 'react';

interface FieldProps {
	extra?: string;
	id: string;
	label: string;
	placeholder?: string;
	state?: 'error' | 'success';
	type?: string;
	isNumber?: boolean;
	error?: string;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(
	({ extra, id, label, placeholder, type, isNumber, error, ...rest }, ref) => {
		return (
			<div className={`${extra}`}>
				<label
					htmlFor={id}
					className={`text-sm text-white/80 ml-1.5 font-medium`}
				>
					{label}
				</label>
				<input
					ref={ref}
					type={type}
					id={id}
					placeholder={placeholder}
					className={`mt-2 flex w-full items-center justify-center rounded-lg outline-none p-3 bg-bg/60 text-white/80 border border-soft/60 focus:border-primary/70 focus:bg-soft/70 transition-all duration-300 ease-in-out`}
					onKeyDown={event => {
						if (
							isNumber &&
							!/[0-9]/.test(event.key) &&
							event.key !== 'Backspace' &&
							event.key !== 'Tab' &&
							event.key !== 'Enter' &&
							event.key !== 'ArrowLeft' &&
							event.key !== 'ArrowRight' &&
							event.key !== 'Delete' &&
							event.key !== 'Home' &&
							event.key !== 'End'
						)
							event.preventDefault();
					}}
					{...rest}
				/>
				{error && <p className="text-red-500 text-sm">{error}</p>}
			</div>
		);
	}
);
Field.displayName = 'Field';
