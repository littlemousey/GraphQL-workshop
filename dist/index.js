"use strict";

var _apolloServer = require("apollo-server");

var _graphqlTag = _interopRequireDefault(require("graphql-tag"));

var _auth = require("./auth.js");

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const typeDefs = _graphqlTag.default`
  enum RoleType {
    admin
    person
    whatever
  }
  directive @auth(role: String) on FIELD_DEFINITION

  enum TodoType {
    checklist
    reminder
  }
  type User {
    id: ID!
    username: String
    todos: [Todo]!
    secret: String @auth
  }
  type Todo {
    user: User!
    name: String
    done: Boolean
    type: TodoType @auth(role: "admin")
  }

  type Post {
    ups: Int!
    downs: Int!
    title: String!
    subReddit: String!
  }

  type Pokemon {
    name: String!
    url: String!
  }

  type Query {
    oneTodo(index: Int = 0): Todo!
    todos: [Todo!]!
    posts: [Post]!
    pokemon: [Pokemon]
  }

  input NewTodoInput {
    name: String!
    done: Boolean = false
    type: TodoType!
    user: ID!
  }

  input NewUserInput {
    name: String!
  }

  type Mutation {
    newTodo(input: NewTodoInput!): Todo
    newUser(input: NewUserInput!): User
  }
`;
const db = {
  todos: [],
  users: []
};
const resolvers = {
  Query: {
    oneTodo(rootValue, {
      index
    }, context, info) {
      return db.todos[index];
    },

    todos() {
      return db.todos;
    },

    async posts() {
      const posts = await (0, _nodeFetch.default)('https://www.reddit.com/.json').then(r => r.json());
      return posts.data.children.map(child => child.data);
    },

    async pokemon() {
      const pokemon = await (0, _nodeFetch.default)('https://pokeapi.co/api/v2/pokemon/').then(item => item.json());
      return pokemon.results;
    }

  },
  Mutation: {
    newTodo(rootValue, {
      input
    }, context, info) {
      db.todos.push(input);
      return input;
    },

    newUser(rootValue, {
      input
    }, context, info) {
      db.users.push(input);
      return input;
    }

  },
  // resolvers/middleware to connect user to todo
  Todo: {
    user(todo) {
      return {
        id: todo.user,
        username: 'jhgjhg'
      };
    }

  },
  User: {
    todos() {
      return db.todos;
    }

  }
};
const server = new _apolloServer.ApolloServer({
  typeDefs,
  resolvers,

  context({
    req
  }) {
    return {
      isAuth: req.headers.authorization,
      role: 'fghjjg'
    };
  },

  schemaDirectives: {
    auth: _auth.Auth
  }
});
server.listen().then(({
  url
}) => console.log(`server on ${url}`)).catch(console.error.bind(console));