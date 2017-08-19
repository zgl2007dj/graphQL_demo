import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLSchema
} from 'graphql'
import db from './db'
import DataLoader from 'dataloader'

const commentLoader = new DataLoader(keys => {
  return db.models.comment.findAll({where: {
    userId: {
      in: keys
    }
  }})
});
const User = new GraphQLObjectType({
  name: 'User',
  description: 'user info',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(user) {
          return user.id
        }
      },
      userName: {
        type: GraphQLString
      },
      comments: {
        type: new GraphQLList(Comment),
        resolve:  async (user) => {
          let comments = await commentLoader.load(user.id)
          return [comments]
        }
      }
    }
  }
})

const Comment = new GraphQLObjectType({
  name: 'Comment',
  description: 'comment info',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(comment) {
          return comment.id
        }
      },
      title: {
        type: GraphQLString,
        resolve(comment) {
          return comment.title
        }
      },
      content: {
        type: GraphQLString,
        resolve(comment) {
          return comment.content
        }
      }
    }
  }
})

const query = new GraphQLObjectType({
  name: 'Query',
  description: 'root Query',
  fields: () => {
    return {
      user: {
        type:  User,
        args: {
          id: {
            type: GraphQLInt
          }
        },
        resolve(root, args) {
          return db.models.user.find({where: args})
        }
      },
      users: {
        type:  new GraphQLList(User),
        args: {
          id: {
            type: GraphQLInt
          }
        },
        resolve(root, args) {
          return db.models.user.findAll({where: args})
        }
      }
    }
  }
})

const Schema = new GraphQLSchema({
  query
})

export default Schema