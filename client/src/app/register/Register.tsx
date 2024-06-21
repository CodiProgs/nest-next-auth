'use client';

import { GraphQLErrorExtensions } from 'graphql';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CreateUserDto, useRegisterMutation } from '../../gql/graphql';
import toast from 'react-hot-toast';
import { Field } from '../../components/ui/Field';

export default function Register() {
	const { push } = useRouter();
	const [errors, setErrors] = useState<GraphQLErrorExtensions>({});

	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors: errorsForm }
	} = useForm<CreateUserDto>({
		mode: 'onSubmit'
	});
	const [registerMutation] = useRegisterMutation({
		onCompleted() {
			reset();
			toast.success("Successful registration")
			push('/login');
		},
		onError(error) {
			const extensions = error?.graphQLErrors?.[0]?.extensions;
			if (extensions) {
				setErrors(extensions);
			}
		}
	});

	const onSubmit: SubmitHandler<CreateUserDto> = data => {
		setErrors({});
		registerMutation({ variables: { ...data } });
	};
	return (
		<form
			className="w-full"
			onSubmit={handleSubmit(onSubmit)}
		>
			<div className="flex gap-8 mb-4">
				<Field
					id="name"
					label="Name"
					placeholder="John"
					extra="w-full"
					error={(errors?.name as string) || errorsForm?.name?.message}
					{...register('name', {
						required: 'Name is required',
						maxLength: { value: 20, message: 'Max length is 20' },
						minLength: { value: 3, message: 'Min length is 3' }
					})}
				/>
				<Field
					id="surname"
					label="Surname"
					placeholder="Doe"
					extra="w-full"
					error={(errors?.surname as string) || errorsForm?.surname?.message}
					{...register('surname', {
						required: 'Surname is required',
						maxLength: { value: 20, message: 'Max length is 20' },
						minLength: { value: 3, message: 'Min length is 3' }
					})}
				/>
			</div>
			<Field
				id="email"
				label="Email"
				placeholder="john.doe@example.com"
				type="email"
				extra="mb-4"
				error={(errors?.email as string) || errorsForm?.email?.message}
				{...register('email', { required: 'Email is required' })}
			/>
			<div className="flex gap-8 mb-4">
				<Field
					id="password"
					label="Password"
					placeholder="******"
					type="password"
					extra="w-full"
					error={(errors?.password as string) || errorsForm?.password?.message}
					{...register('password', {
						required: 'Password is required',
						maxLength: { value: 32, message: 'Max length is 32' },
						minLength: { value: 6, message: 'Min lenght is 6'}
					})}
				/>
				<Field
					id="confirmPassword"
					label="Confirm Password"
					placeholder="******"
					type="password"
					extra="w-full"
					error={
						(errors?.confirmPassword as string) ||
						errorsForm?.passwordConfirm?.message
					}
					{...register('passwordConfirm', {
						validate: value => {
							if (watch('password') !== value) return 'Passwords do not match';
						}
					})}
				/>
			</div>
			<>
				{errors?.extended && (
					<p className="text-red-500 text-sm mb-6">
						{errors.extended as string}
					</p>
				)}
			</>
			<div className="flex items-center gap-5 justify-between mt-2">
				<button
					className="text-white hover:bg-primary/70 w-32 py-2 bg-primary rounded-md duration-300 ease-in-out disabled:bg-primary/40 disabled:cursor-not-allowed"
					disabled={Object.keys(errorsForm).length > 0}
				>
					Register
				</button>
				<Link
					href="/login"
					className="hover:text-primary duration-300 ease-in-out"
				>
					Already have an account?
				</Link>
			</div>
		</form>
	);
}
