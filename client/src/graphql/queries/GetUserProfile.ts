import { gql } from '@apollo/client';

gql`
	query GetUserProfile($nickname: String!) {
		user: getUserProfile(nickname: $nickname) {
			id
			name
			surname
			nickname
			email
			avatar
		}
	}
`;
