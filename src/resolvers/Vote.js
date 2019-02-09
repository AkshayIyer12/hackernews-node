const link = (parent, args, context) => context.prisma.vote({ id: parent.id }).link()

const user = (parent, args, context) => context.prisma.vote({ id: prisma.id }).user()

module.exports = {
    link,
    user
}
