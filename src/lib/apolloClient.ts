import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const customFetch = (uri: string, options: any) => {
  const { service } = options.headers;
  const { headers } = options;
  delete headers.service;
  if (service === 'uniswap-v3') {
    return fetch(`https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3`, {
      ...options,
      headers: {
        ...headers,
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
      },
    });
  }
  if (service === 'v1-subgraph') {
    return fetch(`https://api.thegraph.com/subgraphs/name/peopleland/v1-subgraph`, {
      ...options,
      headers: {
        ...headers,
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
      },
    });
  }
  if (service === 'ethereum-blocks') {
    return fetch(`https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks`, {
      ...options,
      headers: {
        ...headers,
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
      },
    });
  }
  return fetch(
    `https://api.thegraph.com/subgraphs/name/peopleland/v1-subgraph`,
    options,
  );
};

const httpLink = new HttpLink({
  fetch: customFetch,
  credentials: 'same-origin',
});

const authLink = setContext((_, context) => {
  return {
    headers: {
      ...context.headers,
      service: context.service,
    },
  };
});

const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default apolloClient;
