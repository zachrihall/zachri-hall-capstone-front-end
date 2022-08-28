const BASE_URL = "https://" + document.location.hostname;

export const API_URL =
    process.env.NODE_ENV === 'production'
        ? 'https://zachri-hall-cap-client.herokuapp.com'
        : BASE_URL;

