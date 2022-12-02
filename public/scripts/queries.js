var participatoryProcessesQuery = `{  
  participatoryProcesses {
    id
    title {
      translation(locale: "de")
    }
    components(filter: {type: "Meetings"}) {
      id
      __typename
      ... on Meetings {
        meetings {
          nodes {
            description {
              translation(locale: "de")
            }
            coordinates {
              latitude
              longitude
            }
          }
        }
      }
    }
  }
}`