'use client';

import { SessionProvider } from 'next-auth/react';
import ApolloProviderWrapper from '../utils/ApolloProviderWrapper';

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
        <SessionProvider>
            <ApolloProviderWrapper>
                { children }
            </ApolloProviderWrapper>
        </SessionProvider>
    );
}
