import UpdateUser from "../../components/settings/UpdateUser";
import UpdateUserAvatar from "../../components/settings/UpdateUserAvatar";

export default function Settings() {
	return (
		<div className="flex gap-20 pt-10">
			<div>
				<h2 className="text-xl text-center mb-4">Update avatar</h2>
				<UpdateUserAvatar />
			</div>
			<div className="w-full">
				<h2 className="text-xl mb-4">Update user</h2>
				<UpdateUser />
			</div>
		</div>
	);
}
