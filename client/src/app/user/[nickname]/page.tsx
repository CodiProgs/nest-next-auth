import type { Metadata } from 'next';
import User from './User';

export const metadata: Metadata = {
	title: 'User',
	robots: {
		index: false,
		follow: false
	}
};

export default function UserPage() {
	return <User />;
}
