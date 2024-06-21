interface User {
	id?: string | undefined;
	name?: string | undefined;
	surname?: string | null | undefined;
	nickname?: string | undefined;
	email?: string | undefined;
	avatar?: string | null | undefined;
	roles?: string[] | undefined;
}
