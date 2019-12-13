import React from 'react';
import ClientOAuth2 from 'client-oauth2';
import { useCookies } from 'react-cookie';

export const withAuthentication = WrappedComponent => {

  const Wrapper = (props) => {
    const [cookies, setCookie] = useCookies(['token']);
    const token = cookies.token;

    // Return wrapped component if we're authenticated.
    if (token) {
      return <WrappedComponent {...props} />
    }

    // Let's not return anything server-side if we're not authenticated.
    if (!process.browser) {
      return null;
    }

    const google = new ClientOAuth2({
      clientId: process.env.GOOGLE_CLIENT_ID,
      authorizationUri: 'https://accounts.google.com/o/oauth2/v2/auth',
      scopes: ['https://www.googleapis.com/auth/userinfo.profile'],
      query: {
        hd: process.env.GOOGLE_DOMAIN,
      }
    });

    if (window.location.hash) {
      google.token.getToken(window.location.href, { redirectUri: window.location.href })
        .then(user => {
          setCookie('token', user.accessToken, { path: '/' });
          window.location = window.location.href.split('#')[0];
        });
    } else {
      window.location = google.token.getUri({
        redirectUri: window.location.href
      });
    }
  };

  Wrapper.getInitialProps = async ctx => {
    return WrappedComponent.getInitialProps &&
      (await WrappedComponent.getInitialProps(ctx));
  };

  return Wrapper;
};
