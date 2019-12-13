import fetch from 'isomorphic-unfetch';
import styled from 'styled-components';
import Quote from '../components/Quote';
import Layout from '../components/Layout';
import { withAuthentication } from '../authentication';

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  padding: 18px;
`;

const Item = styled.div`
  flex-basis: 25%;
  width: 25%;
  padding: 10px;
  margin: auto;
  min-width: 300px;
`;

function Page({ quotes }) {
  return (
    <Layout>
      <Grid>
        {quotes.map(quote => (
          <Item>
            <Quote key={quote.id} {...quote} />
          </Item>
        ))}
      </Grid>
    </Layout>
  );
}

Page.getInitialProps = async ({ req }) => {
  const baseUrl = req ? `http://${req.headers.host}` : '';
  const response = await fetch(`${baseUrl}/api/quotes`);
  const json = await response.json();
  return { quotes: json.data };
};

export default withAuthentication(Page);
