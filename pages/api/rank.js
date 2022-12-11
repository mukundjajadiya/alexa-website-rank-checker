import convert from "xml-js";

export default async function rank(req, res) {
  switch (req.method) {
    case "GET":
      res.status(200).json({ success: true });
      break;

    case "POST":
      try {
        const { url: targetURL } = req.body;

        const resObj = await fetch(
          `https://data.alexa.com/data?cli=10&url=${targetURL}`
        );
        const xml = await resObj.text();
        const xml2json = convert.xml2json(xml, { compact: false, spaces: 4 });
        const data = JSON.parse(xml2json);

        if (
          data.elements[1].attributes.URL == "404" ||
          data.elements[1]["elements"] == undefined
        ) {
          return res.status(200).json({
            success: false,
            message: "Data not available.",
          });
        }
        console.log("DATA", data.elements[1].elements[0].elements[2]);

        const country = data.elements[1].elements[0].elements.find(
          (element) => {
            return element.name == "COUNTRY";
          }
        );
        const countryRank = data.elements[1].elements[0].elements.find(
          (element) => {
            return element.name == "COUNTRY";
          }
        );
        const globalRank = data.elements[1].elements[0].elements.find(
          (element) => {
            return element.name == "POPULARITY";
          }
        );

        const reach = data.elements[1].elements[0].elements.find((element) => {
          return element.name == "REACH";
        });

        const change = data.elements[1].elements[0].elements.find((element) => {
          return element.name == "RANK";
        });

        const givenURL = targetURL;

        const rankResult = {
          givenURL,
          globalRank: globalRank ? globalRank.attributes.TEXT : "Not Avalibale",
          country: country ? country.attributes.NAME : "Not Avalibale",
          countryRank: countryRank
            ? countryRank.attributes.RANK
            : "Not Avalibale",
          reach: reach ? reach.attributes.RANK : "Not Avalibale",
          change: change ? change.attributes.DELTA : "Not Avalibale",
        };
        res.setHeader(
          "Access-Control-Allow-Origin",
          "https://alexa-rank-checker.vercel.app"
        );
        return res.status(200).json({
          success: true,
          data: [{ result: rankResult }],
        });
      } catch (error) {
        console.log("[ERROR] ", error.message);
        console.log("[ERROR] ", error);
        return res.status(200).json({
          success: false,
          message: "Something went wrong.",
        });
      }
      break;
    default:
      res.status(405).json({
        success: false,
        message: "Method not allowed.",
      });
      break;
  }
}
