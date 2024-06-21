import type { Metadata } from 'next';
import Settings from './Settings';

export const metadata: Metadata = {
	title: 'Settings',
	robots: {
		index: false,
		follow: false
	}
};

export default function SettingsPage() {
	return <Settings />;
}
