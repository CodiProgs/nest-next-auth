'use client'

import { SessionProvider } from 'next-auth/react'
import { client } from '../utils/apolloClient'
import { ApolloProvider } from '@apollo/client'

export default function Providers({ children }: { children: React.ReactNode }) {
	const clientApollo = client
	return (
		<SessionProvider>
			<ApolloProvider client={clientApollo}>{children}</ApolloProvider>
		</SessionProvider>
	)
}
