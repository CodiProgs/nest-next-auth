import { gql } from '@apollo/client';

gql`
	mutation Register(
		$name: String!
		$surname: String
		$email: String!
		$password: String!
		$passwordConfirm: String!
	) {
		register(
			registerInput: {
				name: $name
				surname: $surname
				email: $email
				password: $password
				passwordConfirm: $passwordConfirm
			}
		){
			id
			name
			surname
			nickname
			email
			avatar
			roles
			token
		}
	}
`;
