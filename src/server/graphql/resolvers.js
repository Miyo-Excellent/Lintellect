export default ({
  Query: {
    product: (root, {id}) => `Hello ${id}`
  }
});
