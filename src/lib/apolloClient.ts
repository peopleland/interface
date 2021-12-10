import { ApolloClient, InMemoryCache } from '@apollo/client';

const apolloClient = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/peopleland/v1-subgraph",
  cache: new InMemoryCache(),
});

export default apolloClient;
