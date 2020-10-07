import jestMock from "jest-mock";
import { GraphQLError } from "graphql";
import { SchemaLink } from "@apollo/client/link/schema";
import { MockLink, MockedResponse } from "./MockLink";
import { MockList, IMocks, addMocksToSchema } from "@graphql-tools/mock";
import { makeExecutableSchema } from "@graphql-tools/schema";
import {
  ApolloClient,
  ApolloLink,
  Observable,
  InMemoryCache,
} from "@apollo/client/core";

const DEFAULT_MOCKS = {
  Date: () => "2019-01-01",
  DateTime: () => "2019-01-01T00:00:00Z",
  Decimal: () => "2.5",
};

/**
 * Useful for testing a Apollo integration using randomly
 * generated return values.
 */
export const createSchemaClient = (typeDefs: string, mocks: IMocks = {}) => {
  const schema = addMocksToSchema({
    schema: makeExecutableSchema({ typeDefs }),
    mocks: { ...DEFAULT_MOCKS, ...mocks },
  });

  return new ApolloClient({
    link: new SchemaLink({ schema }),
    cache: new InMemoryCache(),
  });
};

/**
 * Useful for testing Apollo integration and providing return values.
 */
export const createStubbedClient = (mocks: MockedResponse[]) => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new MockLink(mocks),
  });
};

/**
 * Generates a client using Jest's mocks.
 */
export const createMockedClient = (): jest.Mocked<ApolloClient<any>> => {
  const metadata = jestMock.getMetadata(ApolloClient);
  const MockedClient = jestMock.generateFromMetadata(metadata!);
  return new MockedClient() as any;
};

/**
 * Useful for testing the loading states of components.
 */
export const createLoadingClient = () => {
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
export const createErrorClient = (errors: GraphQLError[]) => {
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

export { MockList, MockLink, MockedResponse };
