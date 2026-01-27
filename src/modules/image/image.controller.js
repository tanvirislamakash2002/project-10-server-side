const axios = require('axios');
const FormData = require('form-data');

const IMG_BB_API_KEY = process.env.IMGBB_API_KEY;

exports.uploadImageToImgBB = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Image file is required' });
        }

        const formData = new FormData();
        formData.append('image', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        const formHeaders = formData.getHeaders();

        const response = await axios.post(
            `https://api.imgbb.com/1/upload?key=${IMG_BB_API_KEY}`,
            formData,
            {
                headers: {
                    ...formHeaders,
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                timeout: 60000,
            }
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Image upload failed:', error.response?.data || error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
        if (error.request) {
            console.error('Request made but no response:', error.request);
        }
        res.status(500).json({ error: 'Image upload failed' });
    }
};
