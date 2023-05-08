import fastify, { FastifyBaseLogger, FastifyInstance, FastifyPluginOptions, FastifyTypeProvider, RawServerDefault } from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import { organizationRoutes } from './http/controller/organizations/routes'
import { IncomingMessage, ServerResponse } from 'node:http'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(organizationRoutes)

app.setErrorHandler((error, _request, response) => {
  if (error instanceof ZodError) {
    return response.status(400).send({
      message: 'Validation error.',
      issues: error.format(),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return response.status(500).send({ message: 'Internal Server Error.' })
})

