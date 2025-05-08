import axiosClient from "./axiosClient";

export const getLocationbyCategory = async (
    category:string,
)=>{
    const response = await axiosClient.get("/location2/filter_category", {
        params: {
            category,
        },
    });
    return response.data;
}
export const getLocationbySearch = async (
    textSearch:string,
)=>{
    console.log("textSeatch", textSearch)
    const response = await axiosClient.get("/location2/search", {
        params: {
            textSearch,
        },
    });
    return response.data;
}
