import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { ApolloProvider, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import zustand from 'zustand';

import createApolloClient from '../services/apollo';

// eslint-disable-next-line import/no-mutable-exports
export let useAuth;

export function GqlAuthProvider({ children }) {
  const { data, status } = useSession();

  useAuth = zustand(() => ({
    user: null,
    role: 0,
    token: '',
    crUser: {}
  }));

  if (status === 'loading') {
    return null;
  }

  if (!data) {
    signIn('auth0');
    return null;
  }

  const { user, role, accessToken } = data;

  if (accessToken !== localStorage.getItem('crAccessToken')) {
    localStorage.setItem('crAccessToken', accessToken as string);
  }

  return (
    <GqlProvider user={user} role={role} accessToken={accessToken}>
      {children}
    </GqlProvider>
  );
}

function GqlProvider({ user, role, accessToken, children }) {
  const [client] = useState(createApolloClient(accessToken));

  const { data } = useQuery(gql`
    query crUser($email: String!) {
      cr_user(where: {email: {_eq: $email}}) {
        id
        name
        email
      }
    }`, {
    variables: {
      // @ts-ignore
      email: user.email
    },
    client
  });

  if (data) {
    useAuth.setState({
      user,
      role,
      token: accessToken,
      crUser: data?.cr_user[0]
    });

    return (
      <ApolloProvider client={client}>
        {children}
      </ApolloProvider>
    );
  }

  return null;
}
