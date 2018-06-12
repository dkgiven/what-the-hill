import gql from "graphql-tag";
import * as React from "react";
import { Query } from "react-apollo";

export const VoteSummary = () => (
  <Query
    query={gql`
    {
      getRollCallLists(congress: 110, session: 2) {
        congress
        congressYear
        votes {
          vote {
            issue
            question
            result
            title
            voteDate
            voteNumber
            voteTally {
              absent
              yeas
              nays
              present
            }
          }
        }
      }
    }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) { return <p>Loading...</p>; }
      if (error) { return <p>Error :(</p>; }
      return (
      <div>
        <h3>Congress: {data.getRollCallLists.congress}</h3>
        <h4>Congress year: {data.getRollCallLists.congressYear}</h4>
        {
          data.getRollCallLists.votes.vote.map((vote: any) => (
            <div key={(vote.issue as string).replace(' ', '')}>
              <p>{`${vote.issue}: ${vote.result}`}</p>
            </div>
            )
          )
        }
      </div>);
    }}
  </Query>
);