import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Admin Page',
	robots: {
		index: false,
		follow: false
	}
};

export default function AdminPage() {
	return <div>Admin Page</div>;
}
