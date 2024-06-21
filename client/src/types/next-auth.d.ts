import NextAuth from 'next-auth';
import JWT from 'next-auth/jwt';

export declare module 'next-auth' {
	interface Session extends NextAuth.Session {
		user: User;
	}
}

declare module 'next-auth/jwt' {
	interface JWT extends User {}
}
