'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import LogoutButton from '../LogoutButton';

export default function HeaderMenu({
	setShowMenu
}: {
	setShowMenu: (showMenu: boolean) => void;
}) {
	const nickname = useSession().data?.user.nickname;

	const menuRef = useRef<HTMLDivElement | null>(null);
	function handleClickOutside(event: MouseEvent) {
		if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
			setShowMenu(false);
		}
	}
	useEffect(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [menuRef, setShowMenu]);
	return (
		<div
			className="absolute top-[40px] right-0 border border-black/20 rounded-md shadow-md bg-soft w-60"
			ref={menuRef}
		>
			<ul>
				<li onClick={() => setShowMenu(false)}>
					<Link
						href={`/user/${nickname}`}
						className="block py-3 px-6 hover:bg-black/10 hover:rounded-t-md"
					>
						Profile
					</Link>
				</li>
				<li onClick={() => setShowMenu(false)}>
					<Link
						href="/settings"
						className="block py-3 px-6 hover:bg-black/10"
					>
						Settings
					</Link>
				</li>
				<li onClick={() => setShowMenu(false)}>
					<LogoutButton className="w-full text-start py-3 px-6 hover:bg-black/10 hover:rounded-b-md" />
				</li>
			</ul>
		</div>
	);
}
