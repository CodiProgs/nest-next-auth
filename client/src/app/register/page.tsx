import type { Metadata } from 'next';
import Register from './Register';

export const metadata: Metadata = {
	title: 'Register',
	robots: {
		index: false,
		follow: false
	}
};

export default function RegisterPage() {
	return (
		<div className="max-w-5xl mx-auto py-6 bg-soft absolute top-1/4 left-0 right-0 h-max w-full">
			<div className="w-[90%] mx-auto flex flex-col items-center">
				<h1 className="text-3xl font-bold capitalize mb-8">Register</h1>
				<Register />
			</div>
		</div>
	);
}
