const { GraphQLServer } = require('graphql-yoga')

let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
},
	    {
    id: 'link-120',
    url: 'www.facebook.com',
    description: 'Fuck facebook.com!'
}]

let idCount = links.length
const resolvers = {
    Query: {
	info: () => `This is the API of a Hackernews clone`,
	feed: () => links,
	link: (_, { id }) => links.filter(obj => obj.id === id)[0]
    },
    Mutation: {
	post: (parent, args) => {
	    const link = {
		id: `link-${idCount++}`,
		description: args.description,
		url: args.url
	    }
	    links.push(link)
	    return link
	},
	updateLink: (parent, { id, url = null, description = null }) => {
	    let value = links
		.filter(linkObject => linkObject.id === id)
		.map(linkValue => {
		    linkValue.url = url
		    linkValue.description = description
		    return linkValue
		})
	    return value[0]
	},
	deleteLink: (parent, { id }) => {
	    let index = links.findIndex(linkObject => linkObject.id === id)
	    if (index !== -1) {
		let linkValue = links.splice(index, 1)
		return linkValue[0]
	    }
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
    resolvers
})

server.start(() => console.log(`Server is running on http://localhost:4000`))
