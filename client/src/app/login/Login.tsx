'use client';

import { GraphQLErrorExtensions } from 'graphql';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { LoginDto, useLoginMutation } from '../../gql/graphql';
import toast from 'react-hot-toast';
import { useGlobalStore } from '../../stores/global-store';
import { Field } from '../../components/ui/Field';

export default function Login() {
	const { push } = useRouter();
	const [errors, setErrors] = useState<GraphQLErrorExtensions>({});

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors: errorsForm }
	} = useForm<LoginDto>({
		mode: 'onSubmit'
	});
	const [login] = useLoginMutation({
		onCompleted(data) {
			toast.success("Successful login")
			signIn('credentials', {
				redirect: false,
				...data.user
			});
			push(`/user/${data.user.nickname}`);
			useGlobalStore.getState().setToken(data.user.token!);
			reset();
		},
		onError(error) {
			const extensions = error?.graphQLErrors?.[0]?.extensions;
			if (extensions) {
				setErrors(extensions);
			}
		}
	});

	const onSubmit: SubmitHandler<LoginDto> = data => {
		setErrors({});
		login({ variables: { ...data } });
	};

	return (
		<form
			className="w-full"
			onSubmit={handleSubmit(onSubmit)}
		>
			<Field
				id="email"
				label="Email"
				placeholder="john.doe@example.com"
				type="email"
				extra="mb-4"
				error={(errors?.email as string) || errorsForm?.email?.message}
				{...register('email', { required: 'Email is required' })}
			/>
			<Field
				id="password"
				label="Password"
				placeholder="******"
				type="password"
				extra="mb-4"
				error={(errors?.password as string) || errorsForm?.password?.message}
				{...register('password', { required: 'Password is required' })}
			/>
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
					Login
				</button>
				<Link
					href="/register"
					className="hover:text-primary duration-300 ease-in-out"
				>
					Create an account
				</Link>
			</div>
		</form>
	);
}
