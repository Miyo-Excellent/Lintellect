//  Dependencies
const { gql } = require('apollo-server');

export default gql`
  type Query {
    product(id: String!): String
  }
`;
