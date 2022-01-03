const graphqlURL = 'http://localhost:9000/graphql'

const graphqlRequest = async ({ query, variables = {} }) => {
  const response = await fetch(graphqlURL, {
    method: 'POST',
    headers: { 'content-Type': 'application/json'},
    body: JSON.stringify({ query, variables })
  })

  const responseBody = await response.json()

  if(responseBody.errors) {
    const message = responseBody.errors.map(err => err.message).join('\n')
    throw new Error(message)
  }

  return responseBody.data
}

const loadJob = async (id) => {
  const params = {
    variables: { id },
    query: `query JobQuery($id: ID!) {
      job(id: $id) {
        id
        title
        description
        company {
          id
          name
        }
      }
    }`
  }
  
  const { job } = await graphqlRequest(params)
  return job
}

const loadJobs = async () => {
  const params = {
    query: `{
      jobs {
        id
        title
        company {
          id
          name
        }
      }
    }`
  }

  const { jobs } = await graphqlRequest(params)
  return jobs
}

const loadCompany = async (id) => {
  const params = {
    variables: { id },
    query: `query CompanyQuery($id: ID!) {
      company(id: $id) {
        id
        name
        description
        jobs {
          id
          title
        }
      }
    }`
  }
  
  const { company } = await graphqlRequest(params)
  return company
}

export { loadJobs, loadJob, loadCompany }