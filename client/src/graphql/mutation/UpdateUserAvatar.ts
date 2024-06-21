import { gql } from '@apollo/client';

gql`
	mutation UpdateUserAvatar($image: Upload!) {
		image: updateUserAvatar(image: $image)
	}
`;
