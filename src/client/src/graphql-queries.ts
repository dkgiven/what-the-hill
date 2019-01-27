import gql from "graphql-tag";
export const GET_ROLL_CALL_LISTS_QUERY = gql`
  query getRollCallLists($congress: Int!, $session: Int!) {
    getRollCallLists(congress: $congress, session: $session) {
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
`;

export const GET_ROLL_CALL_VOTES_QUERY = gql`
  query getRollCallVotes($congress: Int!, $session: Int!, $voteNum: Int!) {
    getRollCallVotes(congress: $congress, session: $session, voteNum: $voteNum) {
      voteTitle
      question
      voteDate
      voteDocumentText
      members {
        member {
          firstName
          lastName
          state
          party
          voteCast
        }
      }
    }
  }
`;
