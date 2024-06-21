import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Global {
	token: string | null;
}

export interface GlobalActions {
	setToken: (token: string | null) => void;
}

export const useGlobalStore = create<Global & GlobalActions>()(
	devtools(
		persist(
			set => ({
				token: null,
				setToken: (token: string | null) => set(state => ({ ...state, token }))
			}),
			{
				name: 'global-storage'
			}
		)
	)
);
