import axios from 'axios';

const wordCupApi = async (url) => {
    try {
        const res = await axios.get(`https://raw.githubusercontent.com/openfootball/worldcup.json/master/${url}`);

        return res;
    
    }
    catch (err) {
        if (err.response) {
            console.error("Error Response:", err.response);
        } else if (err.request) {
            console.error("No response received:", err.request);
        } else {
            console.error("Axios config error:", err.message);
        }
        return null;
    }
};

export default wordCupApi;