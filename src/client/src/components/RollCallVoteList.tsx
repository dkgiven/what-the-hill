import * as React from "react";
import { Query } from "react-apollo";
import { CongressMetadata } from "../../../types/congress/CongressMetadata";
import { Member } from "../../../types/members/Member";
import { Vote } from "../../../types/votes/Vote";
import { GET_ROLL_CALL_VOTES_QUERY } from "../graphql-queries";
// import { VoteMap } from "./VoteMap";

interface RollCallVoteProps extends CongressMetadata {
  vote: Vote;
}

export class RollCallVoteList extends React.Component<RollCallVoteProps> {
  public constructor(props: RollCallVoteProps) {
    super(props);
  }

  public render() {
    return (
      <Query 
        query={GET_ROLL_CALL_VOTES_QUERY}
        variables={{
          congress: this.props.congress,
          session: this.props.session,
          voteNum: this.props.vote.voteNumber
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
            <div>
              {/* <VoteMap /> */}
              {data.getRollCallVotes.members.member.map(
                (member: Member, idx: number) => {
                  return (
                    <>
                      <div>Member: {member.firstName} {member.lastName} </div>
                      <div>State: {member.firstName} </div>
                      <div>Party: {member.party} </div>
                      <div>Vote: {member.voteCast} </div>
                  </>
                  )
                }
              )}
            </div>
          );
        }}
      </Query>
    )
  }
}