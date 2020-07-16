/**
 * See: https://github.com/apollographql/apollo-client/blob/5082138ae82f7d08dc69e2ba388854438ed31b43/packages/apollo-client/src/__mocks__/mockLinks.ts
 */

import { print } from "graphql/language/printer";
import {
  Operation,
  ApolloLink,
  FetchResult,
  Observable,
  GraphQLRequest,
} from "apollo-link";

export interface MockedResponse {
  request: GraphQLRequest;
  result?: FetchResult;
  error?: Error;
  delay?: number;
}

export class MockLink extends ApolloLink {
  public operation?: Operation;
  private mockedResponsesByKey: { [key: string]: MockedResponse[] } = {};

  constructor(mockedResponses: MockedResponse[]) {
    super();
    mockedResponses.forEach((mockedResponse) => {
      this.addMockedResponse(mockedResponse);
    });
  }

  public addMockedResponse(mockedResponse: MockedResponse) {
    const key = requestToKey(mockedResponse.request);
    let mockedResponses = this.mockedResponsesByKey[key];
    if (!mockedResponses) {
      mockedResponses = [];
      this.mockedResponsesByKey[key] = mockedResponses;
    }
    mockedResponses.push(mockedResponse);
  }

  public request(operation: Operation) {
    this.operation = operation;
    const key = requestToKey(operation);
    const responses = this.mockedResponsesByKey[key];
    if (!responses || responses.length === 0) {
      throw new Error(
        `No more mocked responses for the query: ${print(
          operation.query
        )}, variables: ${JSON.stringify(operation.variables)}`
      );
    }

    const { result, error, delay } = responses.shift()!;
    if (!result && !error) {
      throw new Error(
        `Mocked response should contain either result or error: ${key}`
      );
    }

    return new Observable<FetchResult>((observer) => {
      let timer = setTimeout(
        () => {
          if (error) {
            observer.error(error);
          } else {
            if (result) observer.next(result);
            observer.complete();
          }
        },
        delay ? delay : 0
      );

      return () => {
        clearTimeout(timer);
      };
    });
  }
}

const requestToKey = (request: GraphQLRequest): string => {
  const queryString = request.query && print(request.query);

  return JSON.stringify({
    variables: request.variables || {},
    query: queryString,
  });
};
