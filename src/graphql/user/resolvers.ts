const queries = {};
const mutations = {
  createUser: async (_: any, {}: {}) => {
    return "randomString";
  },
};

export const resolvers = { queries, mutations };
