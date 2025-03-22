import { fetchContentfulData } from "./contentfulDataFetching";

const get_BackendEssentials_data = () => fetchContentfulData("backendEssentials");

export { 
    get_BackendEssentials_data,
 };
