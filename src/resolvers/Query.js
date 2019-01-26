const feed = (root, args, context, info) => context.prisma.links()
const link = (_, { id }, context) => context.prisma.link({ id })

module.exports = {
    feed,
    link
}
