'use client';

import React, { useMemo } from 'react';
import { onError } from '@apollo/client/link/error';
import {
	ApolloClient,
	ApolloLink,
	ApolloProvider,
	from,
	InMemoryCache,
	NormalizedCacheObject,
	Observable
} from '@apollo/client';
import { URL_SERVER } from './constants';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { getSession, signOut } from 'next-auth/react';
import toast from 'react-hot-toast';
import { LogoutDocument, RefreshTokensDocument } from '../gql/graphql';
import { useGlobalStore } from '../stores/global-store';

const createApolloClient = () => {
	let client: ApolloClient<NormalizedCacheObject>;

	const errorLink = onError(
		({ networkError, graphQLErrors, operation, forward }) => {
			if (networkError) {
				toast.error(networkError.message)
			}
			if (graphQLErrors) {
				for (const err of graphQLErrors) {
					if (err.extensions?.code === '401') {
						return new Observable(observer => {
							getSession().then(session => {
								if (!session) {
									toast.error(err.message)
									observer.error(err);
									return;
								}

								client
									.mutate({
										mutation: RefreshTokensDocument
									})
									.then(token => {
										useGlobalStore.setState({
											token: token.data.refreshTokens
										});
										operation.setContext((previousContext: any) => ({
											headers: {
												...previousContext.headers,
												authorization: `Bearer ${token.data.refreshTokens}`
											}
										}));
										const forward$ = forward(operation);
										forward$.subscribe(observer);
									})
									.catch(error => {
										toast.error(err.message)
										signOut({ redirect: false });
										observer.error(error);
									});
							});
						});
					}
					if(err.extensions?.logout){
						client.mutate({
							mutation: LogoutDocument
						}).then( _ => {
							signOut()
							useGlobalStore.setState({
								token: null
							})
						})
						toast.error(err.extensions.logout as string)
					}
				}
			}
		}
	);

	const uploadLink = createUploadLink({
		uri: `${URL_SERVER}graphql`,
		credentials: 'include',
		headers: {
			'apollo-require-preflight': 'true'
		}
	});

	const authMiddleware = new ApolloLink((operation, forward) => {
		const token = useGlobalStore.getState().token;
		operation.setContext({
			headers: {
				Authorization: token ? `Bearer ${token}` : ''
			}
		});
		return forward(operation);
	});

	client = new ApolloClient({
		cache: new InMemoryCache({}),
		headers: {
			'Content-Type': 'application/json'
		},
		link: from([authMiddleware, errorLink, uploadLink])
	});
	return client;
};

function ApolloProviderWrapper({ children }: { children: React.ReactNode }) {
	const client = useMemo(
		() => createApolloClient(),
		[]
	);

	return (
		<>
			<ApolloProvider client={client}>{children}</ApolloProvider>
		</>
	);
}

export default ApolloProviderWrapper;
