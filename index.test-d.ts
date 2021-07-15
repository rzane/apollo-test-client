import { expectType } from "tsd";
import { GraphQLError } from "graphql";
import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client/core";
import {
  createSchemaClient,
  configureSchemaClient,
  createErrorClient,
  createLoadingClient,
  createStubbedClient,
  createMockedClient,
} from ".";

type Client = ApolloClient<NormalizedCacheObject>;

expectType<Client>(createSchemaClient(""));
expectType<Client>(createSchemaClient("", {}));

expectType<Client>(configureSchemaClient("")());
expectType<Client>(configureSchemaClient("")({}));
expectType<Client>(configureSchemaClient("", {})());
expectType<Client>(configureSchemaClient("", {})({}));

expectType<Client>(createErrorClient([]));
expectType<Client>(createErrorClient([new GraphQLError("Boom")]));

expectType<Client>(createLoadingClient());

expectType<Client>(createStubbedClient([]));
expectType<Client>(
  createStubbedClient([{ request: { query: gql`{}` }, result: { data: {} } }])
);

expectType<jest.Mocked<Client>>(createMockedClient());
