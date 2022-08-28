const BASE_URL = "https://" + document.location.hostname;

export const API_URL =
    process.env.NODE_ENV === 'production'
        ? 'https://zachri-hall-cap-api.herokuapp.com'
        : BASE_URL;

