const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

const signup = async (parent, args, context, info) => {
    const password = await bcrypt.hash(args.password, 10)
    const user = await context.prisma.createUser({ ...args, password })
    const token = jwt.sign({ userId: user.id }, APP_SECRET)
    return ({ token, user })
}

const login = async (parent, args, context, info) => {
    const user = await context.prisma.user({ email: args.email })
    if (!user) throw new Error('No such user found')

    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) throw new Error('Invalid password')

    const token = jwt.sign({ userId: user.id }, APP_SECRET)
    return ({ token, user })
}

const post = (parent, { url, description }, context, info) => {
    const userId = getUserId(context)
    return context.prisma.createLink({ description: description, url: url, postedBy: { connect: { id: userId } } })
}
const updateLink = (parent, { id, url, description }, context) => context.prisma.updateLink({ data: { url, description }, where: { id } })
const deleteLink = (parent, { id }, context) => context.prisma.deleteLink({ id })

const vote = async (parent, args, context, info) => {
    const userId = getUserId(context)

    const linkExists = await context.prisma.$exists.vote({
	user: { id: userId },
	link: { id: args.linkId }
    })
    if (linkExists) {
	throw new Error(`Already voted for link: ${args.linkId}`)
    }

    return context.prisma.createVote({
	user: { connect: { id: userId } },
	link: { connect: { id: args.linkId } }
    })
}

module.exports = {
    signup,
    login,
    post,
    updateLink,
    deleteLink,
    vote
}
