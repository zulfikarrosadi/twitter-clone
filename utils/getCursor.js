/**
 * cursor is one of the component to create infiniteScroll feature in prisma
 * for mor information: https://prisma.com/docs
 * @param data resultQuery[]
 * @returns number
 */
const getCursor = (data) => data[data.length - 1].id;
module.exports = getCursor;
