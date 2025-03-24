import { createClient } from "contentful";

const createConnection = async () => {
  try {
    const client = createClient({
      space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
      accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
    });
    return client;
  } catch (error) {
    console.error("Error connecting to Contentful:", error);
  }
};

export default createConnection; 