const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

async function upload() {
    try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream('d:/Luffy/test_teams.csv'));

        const res = await axios.post('http://localhost:5001/api/csv/upload', formData, {
            headers: formData.getHeaders()
        });
        console.log('SUCCESS:', res.data);
    } catch (err) {
        if (err.response) {
            console.error('ERROR RESPONSE:', err.response.data);
        } else {
            console.error('ERROR:', err.message);
        }
    }
}

upload();
