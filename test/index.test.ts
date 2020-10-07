import gql from "graphql-tag";
import { GraphQLError } from "graphql";
import {
  createErrorClient,
  createLoadingClient,
  createMockedClient,
  createStubbedClient,
  createSchemaClient,
} from "../src";

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const schema = `
scalar Date
scalar DateTime
scalar Decimal

type Query {
  hello: String!
  date: Date!
  datetime: DateTime!
  decimal: Decimal!
}
`;

const query = gql`
  query {
    hello
  }
`;

describe("createErrorClient", () => {
  it("produces an error", async () => {
    const error = new GraphQLError("whoops");
    const client = createErrorClient([error]);

    await expect(client.query({ query })).rejects.toThrowError("whoops");
  });
});

describe("createLoadingClient", () => {
  it("is loading", async () => {
    const client = createLoadingClient();
    const result = await Promise.race([
      client.query({ query }),
      delay(300).then(() => "PASS"),
    ]);

    expect(result).toEqual("PASS");
  });
});

describe("createMockedClient", () => {
  it("is constructed from Jest's mock functions", async () => {
    const client = createMockedClient();
    client.query.mockResolvedValue("PASS" as any);

    const result = await client.query({ query });
    expect(client.query).toHaveBeenCalledWith({ query });
    expect(result).toEqual("PASS");
  });
});

describe("createStubbedClient", () => {
  it("has canned responses", async () => {
    const client = createStubbedClient([
      {
        request: { query },
        result: { data: { hello: "PASS" } },
      },
    ]);

    const result = await client.query({ query });
    expect(result.data.hello).toEqual("PASS");
  });
});

describe("createSchemaClient", () => {
  it("generates random data", async () => {
    const client = createSchemaClient(schema);
    const result = await client.query({ query });
    expect(result.data.hello).toEqual(expect.any(String));
  });

  it("allows mocks to be provided", async () => {
    const mocks = { String: () => "PASS" };
    const client = createSchemaClient(schema, mocks);
    const result = await client.query({ query });
    expect(result.data.hello).toEqual("PASS");
  });

  it("provides a mocks for common scalars", async () => {
    const query = gql`
      query {
        date
        datetime
        decimal
      }
    `;

    const client = createSchemaClient(schema);
    const result = await client.query({ query });
    expect(result.data.date).toEqual("2019-01-01");
    expect(result.data.datetime).toEqual("2019-01-01T00:00:00Z");
    expect(result.data.decimal).toEqual("2.5");
  });
});
