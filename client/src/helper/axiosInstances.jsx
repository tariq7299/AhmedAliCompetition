import axios from 'axios';

    // we can also check if cookies in null and throw an error with status 401 and message upmiannauthorized
    // But it is unneccessary actually because we send isAuthenticated request to api !    

// Create an instance with a base URL for your API
export const apiUrl = axios.create({
  baseURL: 'http://localhost:8001'
});