import { NextResponse } from 'next/server';
import { withAuth, NextRequestWithAuth } from 'next-auth/middleware';

export default withAuth(
	function middleware(request: NextRequestWithAuth) {
		const session = request?.nextauth?.token;

		if (
			!session &&
			request.nextUrl.pathname !== '/login' &&
			request.nextUrl.pathname !== '/register'
		)
			return NextResponse.redirect(new URL('/login', request.url));
		if (
			session &&
			(request.nextUrl.pathname === '/login' ||
				request.nextUrl.pathname === '/register')
		)
			return NextResponse.redirect(
				new URL(`/user/${session.nickname}`, request.url)
			);
		if (
			session &&
			request.nextUrl.pathname === '/admin' &&
			!session.roles!.includes('ADMIN')
		) {
			return NextResponse.redirect(
				new URL(`/user/${session.nickname}`, request.url)
			);
		}
		return NextResponse.next();
	},
	{
		callbacks: {
			authorized: () => true
		}
	}
);

export const config = {
	matcher: ['/login', '/register', '/admin', '/settings']
};
