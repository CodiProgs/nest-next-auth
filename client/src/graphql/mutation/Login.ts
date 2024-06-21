import { gql } from '@apollo/client';

gql`
	mutation Login($email: String!, $password: String!) {
		user: login(loginInput: { email: $email, password: $password }) {
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
