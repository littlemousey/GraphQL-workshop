"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Auth = void 0;

var _apolloServer = require("apollo-server");

var _graphql = require("graphql");

class Auth extends _apolloServer.SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolve = field.resolve || _graphql.defaultFieldResolver;
    const role = this.args.role;

    field.resolve = function (rv, args, ctx, info) {
      if (!ctx.isAuth || role !== ctx.role) {
        throw new _apolloServer.AuthenticationError('not auth homie 😓');
      }

      return resolve.call(this, rv, args, ctx, info);
    };
  }

}

exports.Auth = Auth;