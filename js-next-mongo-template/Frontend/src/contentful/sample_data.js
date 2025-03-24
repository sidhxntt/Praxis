import { fetchContentfulData } from "./contentfulDataFetching.js";

const get_BackendEssentials_data = () =>
  fetchContentfulData("backendEssentials");

export { get_BackendEssentials_data };
