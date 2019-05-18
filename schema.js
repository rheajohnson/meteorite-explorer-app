const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLInt,
  GraphQLString,
  GraphQLSchema
} = require("graphql");
const axios = require("axios");

const MeteoriteLandings = new GraphQLObjectType({
  name: "Landings",
  fields: () => ({
    name: { type: GraphQLString },
    id: { type: GraphQLInt },
    nametype: { type: GraphQLString },
    recclass: { type: GraphQLString },
    mass: { type: GraphQLString },
    fall: { type: GraphQLString },
    year: { type: GraphQLString },
    reclat: { type: GraphQLString },
    reclong: { type: GraphQLString }
  })
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    landings: {
      type: new GraphQLList(MeteoriteLandings),
      resolve(parent, args) {
        return axios
          .get("https://data.nasa.gov/resource/gh4g-9sfh.json")
          .then(res => res.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
