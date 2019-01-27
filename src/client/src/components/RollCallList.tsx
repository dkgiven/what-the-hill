import * as React from "react";
import { Query } from "react-apollo";
import {
  ListGroup,
  ListGroupItem,
  Progress
} from "reactstrap";
import { CongressMetadata } from "../../../types/congress/CongressMetadata";
import { Vote } from "../../../types/votes/Vote";
import { GET_ROLL_CALL_LISTS_QUERY } from "../graphql-queries";

const VOTE_TITLE_PREVIEW_LENGTH: number = 32;

interface RollCallListProps extends CongressMetadata {
  updateActiveVote(vote: Vote): void;
}

export class RollCallList extends React.Component<RollCallListProps,
  {
    activeId: string;
  }
> {
  public constructor(props: RollCallListProps) {
    super(props);
    this.state = {
      // Start off with no active
      activeId: ""
    };
    this.getIdString = this.getIdString.bind(this);
    this.isActive = this.isActive.bind(this);
  }

  public render() {
    /**
     * <Query> is a React component exported from react-apollo that uses the render prop pattern to share GraphQL data with your UI
     * More info: https://www.apollographql.com/docs/react/essentials/get-started.html#request
     */
    return (
      <Query
        query={GET_ROLL_CALL_LISTS_QUERY}
        variables={{
          congress: this.props.congress,
          session: this.props.session
        }}
      >
        {({ loading, error, data }) => {
          /**
           *  Render list of roll call votes based on congress/session
           */
          if (loading) {
            return <p>Loading...</p>;
          }
          if (error) {
            return <p>Error :(</p>;
          }
          return (
            <ListGroup>
              {data.getRollCallLists.votes.vote.map(
                (vote: Vote, idx: number) => (
                  <ListGroupItem
                    id={this.getIdString(vote)}
                    key={this.getIdString(vote)}
                    active={this.isActive(vote)}
                    onClick={this.updateActiveId.bind(this, vote)}
                  >
                    
                    <h5>{`${
                        vote.title.substring(0, VOTE_TITLE_PREVIEW_LENGTH).concat("...")
                      } on ${vote.voteDate}`}</h5>
                    <h6>{`Issue: ${vote.issue}`}</h6>
                    <h6>{`Question: ${vote.question}`}</h6>
                    <br/>
                    {`Result: ${vote.result}`}
                    <Progress multi={true}>
                      <Progress
                        bar={true}
                        color="success"
                        value={vote.voteTally.yeas}
                      />
                      <Progress
                        bar={true}
                        color="danger"
                        value={vote.voteTally.nays}
                      />
                      <Progress
                        bar={true}
                        color="muted"
                        value={vote.voteTally.absent}
                      />
                    </Progress>
                  </ListGroupItem>
                )
              )}
            </ListGroup>
          );
        }}
      </Query>
    );
  }

  public getIdString(vote: Vote): string {
    // Strip all whitespace
    return `${vote.issue}${vote.voteDate}${vote.voteNumber}${vote.result}`.replace(/\s/g, "");
  }

  private updateActiveId(vote: Vote, e: React.MouseEvent<HTMLElement>): void {
    const clickedComponentId: string = this.getIdString(vote);
    if (clickedComponentId !== undefined) {
      this.setState({
        activeId: clickedComponentId
      }, () => this.props.updateActiveVote(vote));
    }
  }

  private isActive(vote: Vote): boolean {
    return this.state.activeId === this.getIdString(vote);
  }
}
