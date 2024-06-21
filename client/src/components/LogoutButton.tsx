'use client';

import { signOut } from 'next-auth/react';
import { useLogoutMutation } from '../gql/graphql';
import { useGlobalStore } from '../stores/global-store';
import toast from 'react-hot-toast';

export default function LogoutButton(props: any) {
	const [logout] = useLogoutMutation();

	const onLogout = async () => {
		try {
			await logout();
			await signOut();
			useGlobalStore.getState().setToken(null);
			toast.success('You are logged out of your account')
		} catch (err: any) {
			toast.error(err.message)
		}
	};
	return (
		<button
			onClick={onLogout}
			className={`${props.className}`}
		>
			Logout
		</button>
	);
}
