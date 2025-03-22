import { createClient } from "contentful";

const createConnection = async () => {
  try {
    const client = createClient({
      space:import.meta.env.VITE_CONTENTFUL_SPACE_ID!,
      accessToken:  import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN!,
    });
    return client;
  } catch (error) {
    console.error("Error connecting to Contentful:", error);
  }
};

export default createConnection; 