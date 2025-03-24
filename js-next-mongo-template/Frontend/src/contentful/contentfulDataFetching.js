import createConnection from "./client.js";

const mapEntries = (items) => {
  return items.map((item) => {
    const fields = item.fields;
    const thumbnail = fields.thumbnail?.fields.file?.url;
    return {
      reading_time: fields.readingTime || "0",
      title: fields.title || "",
      src: thumbnail ? `https:${thumbnail}` : "",
      content: fields.content || "",
    };
  });
};

const fetchContentfulData = async (contentType) => {
  try {
    const client = await createConnection();

    if (!client) {
      throw new Error("Contentful client is undefined");
    }
    const res = await client.getEntries({ content_type: contentType });
    const data = res.items;

    return mapEntries(data);
  } catch (error) {
    console.error(`Error fetching ${contentType} data from Contentful:`, error);
  }
};

export { fetchContentfulData };
