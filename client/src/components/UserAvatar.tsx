import Image from 'next/image';
import { URL_SERVER } from '../utils/constants';

export default function UserAvatar({
	session,
	size
}: {
	session: any;
	size: number;
}) {
	if (session?.user?.avatar === 'null') {
		return (
			<div
				className={`w-[${size}px] h-[${size}px] rounded-full bg-gray-300`}
			></div>
		);
	}

	const avatarSrc = session?.user?.avatar?.startsWith('http')
		? session.user.avatar
		: URL_SERVER! + session?.user?.avatar;
	return (
		<Image
			src={avatarSrc}
			alt="avatar"
			fill
			sizes="(max-width: 768px) 100vw, 650px"
			priority
			className={`rounded-full object-cover`}
		/>
	);
}
