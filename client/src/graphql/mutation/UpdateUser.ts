import { gql } from '@apollo/client';

gql`
	mutation UpdateUser($name: String!, $surname: String) {
		updateUser(updateUserInput: { name: $name, surname: $surname })
	}
`;
