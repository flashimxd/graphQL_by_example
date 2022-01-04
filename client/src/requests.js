import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from 'apollo-boost'
import gql from 'graphql-tag'
import { getAccessToken, isLoggedIn } from './auth'
const graphqlURL = 'http://localhost:9000/graphql'

const authLink = new ApolloLink((operation, forward) => {
  if(isLoggedIn()) {
    operation.setContext({
      headers: {
        'authorization': `Bearer ${getAccessToken()}`
      }
    })
  }
  return forward(operation)
})

const client = new ApolloClient({
  link: new ApolloLink.from([
    authLink,
    new HttpLink({ uri: graphqlURL}),
  ]) ,
  cache: new InMemoryCache()
})

const loadJob = async (id) => {
  const query =  gql`
    query JobQuery($id: ID!) {
      job(id: $id) {
        id
        title
        description
        company {
          id
          name
        }
      }
    }
  `
  
  const {data: { job }} = await client.query({ 
    query,
    variables: { id }
  })

  return job
}

const loadJobs = async () => {
  const query = gql`{
      jobs {
        id
        title
        company {
          id
          name
        }
      }
    }`

  const { data: { jobs } } = await client.query({ query })
  return jobs
}

const loadCompany = async (id) => {
  const query = gql`
    query CompanyQuery($id: ID!) {
      company(id: $id) {
        id
        name
        description
        jobs {
          id
          title
        }
      }
    }
  `
  
  const {data: {company}} = await client.query({ query, variables: {id}})
  return company
}

const createJob = async (input) => {
  const mutation = gql`
    mutation CompanyMutation($input: CreateJobInput) {
      job: createJob(input: $input){
        id
        title
        company {
          id
          name
        }
      }
    }
  `
  
  const {data: {job}} = await client.mutate({ mutation, variables: { input }})
  return job
}

export { loadJobs, loadJob, loadCompany, createJob }