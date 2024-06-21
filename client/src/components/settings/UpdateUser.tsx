'use client';

import { GraphQLErrorExtensions } from 'graphql';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Field } from '../ui/Field';
import { useSession } from 'next-auth/react';
import { UpdateUserDto, useUpdateUserMutation } from '../../gql/graphql';
import toast from 'react-hot-toast';

export default function UpdateUser() {
	const [errors, setErrors] = useState<GraphQLErrorExtensions>({});
	const { update } = useSession();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors: errorsForm }
	} = useForm<UpdateUserDto>({
		mode: 'onSubmit'
	});
	const [updateUser] = useUpdateUserMutation({
		onCompleted() {
			reset();
			toast.success("Successful update")
		},
		onError(error) {
			const extensions = error?.graphQLErrors?.[0]?.extensions;
			if (extensions) {
				setErrors(extensions);
			}
		}
	});

	const onSubmit: SubmitHandler<UpdateUserDto> = data => {
		setErrors({});
		updateUser({ variables: { name: data.name, surname: data.surname == '' ? null : data.surname } }).then(() => {
			update({ ...data });
		});
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
						maxLength: { value: 20, message: 'Max length is 20' },
						minLength: { value: 3, message: 'Min length is 3' }
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
					Update
				</button>
			</div>
		</form>
	);
}
