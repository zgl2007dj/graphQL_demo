import schema from './schema'
import express from 'express'
import GraphHTTP from 'express-graphql'

const PORT = 3000;
const app = express();

app.use('/graphql', GraphHTTP({
  schema,
  pretty: true,
  graphiql: true
}))

app.listen(PORT, () => {
  console.log(`server's listening on port ${PORT}`)
})