import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';

const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: {},
				password: {}
			},
			async authorize(credentials: any) {
				return {
					...credentials
				};
			}
		})
	],
	session: {
		strategy: 'jwt'
	},
	pages: {
		signIn: '/login'
	},
	callbacks: {
		async jwt({ token, user, session }: any) {
			let updatedToken = { ...token };

			if (user) {
				updatedToken = {
					...updatedToken,
					...user
				};
			}

			if (session) {
				updatedToken = {
					...updatedToken,
					...session
				};
			}

			return updatedToken;
		},
		async session({ session, token }) {
			return {
				...session,
				user: {
					id: token.id,
					name: token.name,
					surname: token.surname,
					email: token.email,
					nickname: token.nickname,
					avatar: token.avatar,
					roles: token.roles
				}
			};
		}
	}
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
