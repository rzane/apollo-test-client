/// <reference types="jest" />

import { GraphQLError } from "graphql";
import { MockLink, MockedResponse } from "@apollo/client/testing";
import { MockList, IMocks } from "@graphql-tools/mock";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client/core";

declare type Client = ApolloClient<NormalizedCacheObject>;

export { MockList, MockLink, MockedResponse };

/**
 * Useful for testing a Apollo integration using randomly
 * generated return values.
 */
export declare const createSchemaClient: (
  typeDefs: string,
  mocks?: IMocks
) => Client;

/**
 * Create a new function to create a schema client that is bound to the
 * given type definitions.
 */
export declare const configureSchemaClient: (
  typeDefs: string,
  mocks?: IMocks
) => (moreMocks?: IMocks) => Client;

/**
 * Useful for testing Apollo integration and providing return values.
 */
export declare const createStubbedClient: (mocks: MockedResponse[]) => Client;

/**
 * Generates a client using Jest's mocks.
 */
export declare const createMockedClient: () => jest.Mocked<Client>;

/**
 * Useful for testing the loading states of components.
 */
export declare const createLoadingClient: () => Client;

/**
 * Useful for testing the error states of components.
 */
export declare const createErrorClient: (errors: GraphQLError[]) => Client;
