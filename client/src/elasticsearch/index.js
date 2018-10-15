import Elasticsearch from "elasticsearch";

var client = new Elasticsearch.Client({
  host: "localhost:9200",
  log: "trace"
});

client.ping(
  {
    requestTimeout: 30000
  },
  function(error) {
    if (error) {
      console.error("elasticsearch cluster is down!");
    } else {
      console.log("All is well");
    }
  }
);

export const saveText = (page, text) =>
  client.index(
    {
      index: "picapoint-dashboard",
      id: "1",
      type: "pages",
      body: {
        page,
        text
      }
    },
    function(err, resp, status) {
      console.log(resp);
    }
  );

export const queryPage = query =>
  client
    .search({
      index: "picapoint-dashboard",
      type: "pages",
      body: {
        query: {
          match: { text: query }
        }
      }
    })
    .then(
      function(response) {
        console.log("--- Response ---");
        console.log(response);
        console.log("--- Hits ---");
        response.hits.hits.forEach(function(hit) {
          console.log(hit);
        });
        console.log(response.hits.hits);
        return response.hits.hits;
      },
      function(error) {
        console.trace(error.message);
      }
    );

export const insertMany = list => {
  for (var current in list) {
    client.bulk.push(
      {
        index: {
          _index: "gov",
          _type: "constituencies",
          _id: list[current].PANO
        }
      },
      {
        constituencyname: list[current].ConstituencyName,
        constituencyID: list[current].ConstituencyID,
        constituencytype: list[current].ConstituencyType,
        electorate: list[current].Electorate,
        validvotes: list[current].ValidVotes,
        regionID: list[current].RegionID,
        county: list[current].County,
        region: list[current].Region,
        country: list[current].Country
      }
    );
  }
};
