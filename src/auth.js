import { SchemaDirectiveVisitor, AuthenticationError } from 'apollo-server'
import { defaultFieldResolver } from 'graphql'

export class Auth extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolve = field.resolve || defaultFieldResolver
    const role = this.args.role

    field.resolve = function(rv, args, ctx, info) {
      if (!ctx.isAuth || role !== ctx.role) {
        throw new AuthenticationError('not auth homie 😓')
      }
      return resolve.call(this, rv, args, ctx, info)
    }
  }
}
