const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')
const resolvers = {
    Query: {
	info: () => `This is the API of a Hackernews clone`,
	feed: (root, args, context, info) => context.prisma.links(),
	link: (_, { id }, context) => context.prisma.link({ id })
    },
    Mutation: {
	post: (parent, { url, description }, context) => {
	    return context.prisma.createLink({
		description: description,
		url: url
	    })
	},
	updateLink: (parent, { id, url, description }, context) => {
	    return context.prisma.updateLink({
		data: {
		    url,
		    description
		},
		where: {
		    id
		}
	    })
	},
	deleteLink: (parent, { id }, context) => {
	    return context.prisma.deleteLink({
		id
	    })
	}
    },
    Link: {
	id: parent => parent.id,
	description: parent => parent.description,
	url: parent => parent.url,
    }
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: { prisma }
})

server.start(() => console.log(`Server is running on http://localhost:4000`))
