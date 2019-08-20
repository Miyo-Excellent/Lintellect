//  Dependencies
import {makeExecutableSchema} from 'graphql-tools';
import {resolvers, typeDefs} from './graphql';
// Data Base Connection
const db = process.env.MONGODB || 'mongodb://127.0.0.1:27017/lintellect';

const SECRET_TOKEN = 'miclavedetokens';

const graphqlOptions = {
  graphiql: true,
  schema: makeExecutableSchema({
    typeDefs,
    resolvers
  })
};

const config = {db, graphqlOptions, SECRET_TOKEN};

export default config;
