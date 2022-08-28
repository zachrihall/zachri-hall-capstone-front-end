const BASE_URL = "http://" + document.location.hostname + ":8080";

export const API_URL =
    process.env.NODE_ENV === 'production'
        ? 'https://zachri-hall-cap-api.herokuapp.com'
        : BASE_URL;

