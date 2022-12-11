import convert from "xml-js";

const getUrlRank = async (url) => {
  try {
    const resObj = await fetch(`https://data.alexa.com/data?cli=10&url=${url}`);
    const xml = await resObj.text();
    const xml2json = convert.xml2json(xml, { compact: false, spaces: 4 });
    const data = JSON.parse(xml2json);

    if (
      data.elements[1].attributes.URL == "404" ||
      data.elements[1]["elements"] == undefined
    ) {
      return {
        givenURL: url,
        globalRank: "Not Avalibale",
        country: "Not Avalibale",
        countryRank: "Not Avalibale",
        reach: "Not Avalibale",
        change: "Not Avalibale",
      };
    }

    const country = data.elements[1].elements[0].elements.find((element) => {
      return element.name == "COUNTRY";
    });
    const countryRank = data.elements[1].elements[0].elements.find(
      (element) => {
        return element.name == "COUNTRY";
      }
    );
    const globalRank = data.elements[1].elements[0].elements.find((element) => {
      return element.name == "POPULARITY";
    });

    const reach = data.elements[1].elements[0].elements.find((element) => {
      return element.name == "REACH";
    });

    const change = data.elements[1].elements[0].elements.find((element) => {
      return element.name == "RANK";
    });

    const givenURL = url;

    const rankResult = {
      givenURL,
      globalRank: globalRank ? globalRank.attributes.TEXT : "Not Avalibale",
      country: country ? country.attributes.NAME : "Not Avalibale",
      countryRank: countryRank ? countryRank.attributes.RANK : "Not Avalibale",
      reach: reach ? reach.attributes.RANK : "Not Avalibale",
      change: change ? change.attributes.DELTA : "Not Avalibale",
    };

    return rankResult;
  } catch (error) {
    console.log("[ERROR] getUrlRank", error.message);
  }
};

export default async function rank(req, res) {
  switch (req.method) {
    case "GET":
      res.status(200).json({ success: true });
      break;

    case "POST":
      try {
        const { url: targetURLs } = req.body;

        const filterTargetURLs = targetURLs
          .split("\n")
          .filter((url) => (url ? true : false))
          .map((url) => url.trim());

        const rankResult = await Promise.all(
          filterTargetURLs.map((url) => {
            return getUrlRank(url);
          })
        );

        return res.status(200).json({
          success: true,
          data: rankResult,
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
