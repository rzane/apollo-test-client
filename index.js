const { ModuleMocker } = require("jest-mock");
const { SchemaLink } = require("@apollo/client/link/schema");
const { MockLink, MockedResponse } = require("@apollo/client/testing");
const { MockList, addMocksToSchema } = require("@graphql-tools/mock");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const {
  ApolloClient,
  ApolloLink,
  Observable,
  InMemoryCache,
} = require("@apollo/client/core");

const JestMock = new ModuleMocker(global);

const MOCKS = {
  Date: () => "2019-01-01",
  DateTime: () => "2019-01-01T00:00:00Z",
  Decimal: () => "2.5",
};

/**
 * Useful for testing a Apollo integration using randomly
 * generated return values.
 */
exports.createSchemaClient = (typeDefs, mocks = {}) => {
  const schema = addMocksToSchema({
    schema: makeExecutableSchema({ typeDefs }),
    mocks: { ...MOCKS, ...mocks },
  });

  return new ApolloClient({
    link: new SchemaLink({ schema }),
    cache: new InMemoryCache(),
  });
};

/**
 * Create a new function to create a schema client that is bound to the
 * given type definitions.
 */
exports.configureSchemaClient = (typeDefs, mocks = {}) => {
  return (moreMocks = {}) => {
    return createSchemaClient(typeDefs, { ...mocks, ...moreMocks });
  };
};

/**
 * Useful for testing Apollo integration and providing return values.
 */
exports.createStubbedClient = (mocks) => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new MockLink(mocks),
  });
};

/**
 * Generates a client using Jest's mocks.
 */
exports.createMockedClient = () => {
  const metadata = JestMock.getMetadata(ApolloClient);

  if (!metadata) {
    throw new Error("Failed to create a mocked client");
  }

  const MockedClient = JestMock.generateFromMetadata(metadata);
  return new MockedClient();
};

/**
 * Useful for testing the loading states of components.
 */
exports.createLoadingClient = () => {
  const link = new ApolloLink(() => {
    return new Observable(() => {});
  });

  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });
};

/**
 * Useful for testing the error states of components.
 */
exports.createErrorClient = (errors) => {
  const link = new ApolloLink(() => {
    return new Observable((observer) => {
      observer.next({ errors });
      observer.complete();
    });
  });

  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });
};

Object.assign(exports, {
  MockList,
  MockLink,
  MockedResponse,
});
