//  Dependencies
import firebaseAdmin from 'firebase-admin';
import {makeExecutableSchema} from 'graphql-tools';

import {resolvers, typeDefs} from './graphql';

import serviceAccount from './serviceAccountKey';

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

const firebase = {
  //  credential: firebaseAdmin.credential.cert(serviceAccount),
  //  databaseURL: 'https://lintellect-48520.firebaseio.com'

  credential: firebaseAdmin.credential.refreshToken(serviceAccount),
  databaseURL: 'https://lintellect-48520.firebaseio.com'
};

const config = {db, graphqlOptions, SECRET_TOKEN, firebase};

export default config;
