'use client';

import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { ROUTES_WITHOUT_LAYOUT } from '../../utils/constants';
import Header from '../header/Header';

export default function Layout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const shouldDisplayLayout = !ROUTES_WITHOUT_LAYOUT.includes(pathname);
	return (
		<>
            <Toaster/>
			<div className={`${shouldDisplayLayout && 'max-w-7xl mx-auto'}`}>
				{shouldDisplayLayout && <Header />}
				{children}
			</div>
		</>
	);
}
