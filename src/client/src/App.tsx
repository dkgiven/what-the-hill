import ApolloClient from "apollo-boost"
import * as React from 'react';
import { ApolloProvider } from "react-apollo";
import './App.css';
import { VoteSummary }  from "./components/VoteSummary";

const client = new ApolloClient({
  uri: "/services/senate"
});

class App extends React.Component {
  public render() {
    return (
      <ApolloProvider client={client}>
        <VoteSummary />
      </ApolloProvider>
    );
  }
}

export default App;
