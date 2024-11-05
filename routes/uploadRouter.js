// const express = require('express');
// const router = express.Router();
// const uploads = require('../lib/upload/uploads');
// const { uploadImageToFlask } = require('../lib/service/uploadService'); 

// 이미지 업로드 및 예측 처리 라우트
// router.post('/upload', uploads.UPLOAD_PROFILE_MIDDLEWARE(), async (req, res) => {
//     if (!req.file) {
//         return res.status(400).json({ error: 'No file uploaded.' });
//     }

//     const imagePath = req.file.path;  

//     try {
//         // 서비스 함수 호출하여 Flask 서버로 업로드된 이미지 처리
//         const result = await uploadImageToFlask(imagePath);
//         res.json(result);  
//     } catch (error) {
//         console.error('이미지 업로드 또는 예측 중 오류:', error); 
//         res.status(500).json({ error: `서버에서 오류가 발생했습니다: ${error.message}` });
//     }
// });


// module.exports = router;
