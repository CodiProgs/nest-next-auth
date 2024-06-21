import { URL_SERVER } from './src/utils/constants';
import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	schema: `${URL_SERVER}graphql`,
	documents: ['src/graphql/**/*.ts'],
	generates: {
		'./src/gql/graphql.ts': {
			plugins: [
				'typescript',
				'typescript-operations',
				'typescript-react-apollo'
			]
		}
	}
};

export default config;
