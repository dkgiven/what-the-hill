import ApolloClient from "apollo-boost"
import * as React from 'react';
import { ApolloProvider } from "react-apollo";
import { Col, Container, Row } from "reactstrap";
import { RollCallList } from "src/components/RollCallList";
import WthNavbar from "src/components/WthNavbar";
import { CongressMetadata } from "../../types/congress/CongressMetadata";
import { Vote } from "../../types/votes/Vote";
import { RollCallVoteList } from "./components/RollCallVoteList";

const client = new ApolloClient({
  uri: "/services/senate"
});

const CURRENT_CONGRESS_METADATA: CongressMetadata = {
  congress: 115,
  session: 2
};

interface AppState extends CongressMetadata {
  vote: Vote;
}

class App extends React.Component<any, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      vote: {} as Vote,
      ...CURRENT_CONGRESS_METADATA
    }
    this.updateActiveVote = this.updateActiveVote.bind(this);
  }

  public updateActiveVote(vote: Vote) {
    this.setState({
      ...this.state,
      vote
    });
  }
  /**
   * Recommendation to place Provider as high up in the app as possible
   *  More here: https://www.apollographql.com/docs/react/essentials/get-started.html#creating-provider
   */
  public render() {
    return (
      <ApolloProvider client={client}>
        <Container>
          <WthNavbar />
          <Row>
            <Col xl={4} lg={4} md={4}>
              <RollCallList updateActiveVote={this.updateActiveVote} {...CURRENT_CONGRESS_METADATA} />
            </Col>
            <Col xl={8} lg={8} md={8}>
              <RollCallVoteList
                congress={this.state.congress}
                session={this.state.session}
                vote={this.state.vote}
              />
            </Col>
          </Row>
        </Container>
      </ApolloProvider>
    );
  }
}

export default App;
