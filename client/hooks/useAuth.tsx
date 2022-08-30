import { useCreation } from 'ahooks';
import { useState, createContext, useContext } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { ApolloProvider, useQuery } from '@apollo/client';
import gql from 'graphql-tag';

import createApolloClient from '../services/apollo';

const context = createContext({ user: {}, role: '', token: '' });

function LoginPage() {
  const [signInState, setSignInState] = useState();

  useCreation(() => {
    return signIn('auth0').then(setSignInState);
  }, []);

  return signInState || null;
}

export function GqlAuthProvider({ children }) {
  const { data, status } = useSession();

  if (status === 'loading') {
    return null;
  }

  if (!data) {
    return (
      <LoginPage />
    );
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

export function GqlProvider({ user, role, accessToken, children }) {
  const [client] = useState(createApolloClient(accessToken));

  return (
    <ApolloProvider client={client}>
      <context.Provider value={({ user, role, token: accessToken })}>
        {children}
      </context.Provider>
    </ApolloProvider>
  );
}

export function useAuth() {
  const r = useContext(context);
  const { user, role, token } = r;

  // const _role = {
  //   'admin': Role.Admin
  // }[role];

  const { data, loading, error } = useQuery(gql`
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
    }
  });

  if (loading || error) {
    if (error) {
      console.error(error);
    }

    return { user, role, rawRole: role, token };
  }

  return { user, role, rawRole: role, token, crUser: data?.cr_user[0] };
}
