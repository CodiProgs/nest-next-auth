import type { Metadata } from 'next';
import Login from './Login';

export const metadata: Metadata = {
	title: 'Login',
	robots: {
		index: false,
		follow: false
	}
};

export default function LoginPage() {
	return (
		<div className="max-w-xl mx-auto py-6 bg-soft absolute top-1/4 left-0 right-0 h-max w-full">
			<div className="w-[80%] mx-auto flex flex-col items-center">
				<h1 className="text-3xl font-bold capitalize mb-8">Sign in</h1>
				<Login />
			</div>
		</div>
	);
}
