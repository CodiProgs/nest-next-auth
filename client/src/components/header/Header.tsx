'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import HeaderMenu from './HeaderMenu';
import UserAvatar from '../UserAvatar';

export default function Header() {
	const [showMenu, setShowMenu] = useState(false);
	const { data: session, status } = useSession();
	return (
		<header className="flex justify-between items-center py-4 h-[64px]">
			<Link href="/">Home</Link>
			{status !== 'loading' ? (
				status === 'authenticated' ? (
					<div className="relative">
						<button
							onClick={() => setShowMenu(!showMenu)}
							className="w-[32px] h-[32px] relative overflow-hidden rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
						>
							<UserAvatar
								size={32}
								session={session}
							/>
						</button>
						{showMenu && <HeaderMenu setShowMenu={setShowMenu} />}
					</div>
				) : (
					<Link
						href="/login"
						className="hover:text-primary"
					>
						Sign in
					</Link>
				)
			) : (
				<>
					<div className="rounded-full bg-gray-300 w-[32px] h-[32px] flex-shrink-0 animate-pulse" />
				</>
			)}
		</header>
	);
}
