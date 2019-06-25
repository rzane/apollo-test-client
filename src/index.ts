import jestMock from "jest-mock";
import { SchemaLink } from "apollo-link-schema";
import { GraphQLError } from "graphql";
import { ApolloClient } from "apollo-client";
import { ApolloLink, Observable } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import { MockLink, MockedResponse } from "react-apollo/test-links";
import {
  IMocks,
  addMockFunctionsToSchema,
  makeExecutableSchema
} from "graphql-tools";

/**
 * Useful for testing a Apollo integration using randomly
 * generated return values.
 */
export const createSchemaClient = (typeDefs: string, mocks?: IMocks) => {
  const schema = makeExecutableSchema({ typeDefs });

  addMockFunctionsToSchema({ schema, mocks });

  return new ApolloClient({
    link: new SchemaLink({ schema }),
    cache: new InMemoryCache()
  });
};

/**
 * Useful for testing Apollo integration and providing return values.
 */
export const createStubbedClient = (mocks: MockedResponse[]) => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new MockLink(mocks)
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
    cache: new InMemoryCache()
  });
};

/**
 * Useful for testing the error states of components.
 */
export const createErrorClient = (errors: GraphQLError[]) => {
  const link = new ApolloLink(() => {
    return new Observable(observer => {
      observer.next({ errors });
      observer.complete();
    });
  });

  return new ApolloClient({
    link,
    cache: new InMemoryCache()
  });
};
