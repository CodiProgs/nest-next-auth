'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { IoMdSettings } from 'react-icons/io'
import { useGetUserProfileQuery } from '../../../gql/graphql'

export default function User() {
	const { nickname } = useParams() as { nickname: string }
	const { data, loading, error } = useGetUserProfileQuery({
		variables: { nickname }
	})

	const { data: session } = useSession()

	return loading ? (
		<div>Loading...</div>
	) : (
		<>
			{!error ? (
				<div className="flex items-center gap-4">
					<h2>{data?.user.name}</h2>
					{session?.user?.id === data?.user?.id && (
						<Link
							href={'/settings'}
							className="group p-2"
						>
							<IoMdSettings
								size={24}
								className="text-white/60 group-hover:text-white/100 transition-colors duration-200 ease-in-out"
							/>
						</Link>
					)}
				</div>
			) : (
				<div>An error has occurred.</div>
			)}
		</>
	)
}
