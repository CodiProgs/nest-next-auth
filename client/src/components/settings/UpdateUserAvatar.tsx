'use client';

import { GraphQLErrorExtensions } from 'graphql';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';
import UserAvatar from '../UserAvatar';
import { useUpdateUserAvatarMutation } from '../../gql/graphql';
import toast from 'react-hot-toast';
import { HiOutlinePhoto } from 'react-icons/hi2';

export default function UpdateUserAvatar() {
	const [errors, setErrors] = useState<GraphQLErrorExtensions>({});
	const { data: session, status, update } = useSession();

	const [updateImage] = useUpdateUserAvatarMutation({
		onCompleted(data) {
			toast.success("Update avatar success")
			update({
				avatar: data.image
			});
		},
		onError(error) {
			const message = error?.graphQLErrors?.[0]?.message;
			if (message) {
				setErrors({ message });
			}
		}
	});

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setErrors({});
			await updateImage({
				variables: {
					image: e.target.files[0]
				}
			});
		}
	};
	return (
		<div className="py-4 flex flex-col items-center">
			<label
				htmlFor="fileInput"
				tabIndex={0}
				role="button"
				onKeyDown={e => e.key === 'Enter' && e.currentTarget.click()}
				className="group rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 "
			>
				<div className="relative w-[200px] h-[200px] rounded-full cursor-pointer group-hover:shadow-[0_0_0_3px_#ffffff;] transition-all duration-300">
					{status !== 'loading' ? (
						<UserAvatar
							size={200}
							session={session}
						/>
					) : (
						<div className="rounded-full bg-gray-300 w-[200px] h-[200px] flex-shrink-0 animate-pulse" />
					)}
					<div className="absolute p-2 rounded-full bg-avatar w-full h-full inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center flex-col cursor-pointer text-center">
						<HiOutlinePhoto
							size={32}
							stroke="white"
						/>
					</div>
				</div>
			</label>
			<input
				type="file"
				id="fileInput"
				className="hidden"
				onChange={e => handleFileChange(e)}
			/>
			{errors?.message! && (
				<p className="text-red-500 text-sm">{errors?.message as string}</p>
			)}
		</div>
	);
}
