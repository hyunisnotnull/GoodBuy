const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');

/**
 * 이미지 파일을 Flask 서버에 업로드하고 예측 결과를 반환하는 함수
 * @param {string} imagePath - 업로드할 이미지 파일의 경로
 * @returns {Promise<object>} - 예측 결과 또는 오류 메시지를 담은 객체
 */
async function uploadImageToFlask(imagePath) {
    const form = new FormData();
    form.append('file', fs.createReadStream(imagePath));

    try {
        const response = await fetch(process.env.FLASK_URL, {
            method: 'POST',
            body: form,
            headers: form.getHeaders(),
        });

        const data = await response.json();

        if (response.ok) {
            return { message: data.message };  // 예측 결과 반환
        } else {
            console.error('Flask 서버 응답 오류:', data); // Flask 서버의 응답 내용을 콘솔에 출력
            throw new Error(data.message || data.error || 'Unknown error');
        }
    } catch (error) {
        console.error('이미지 업로드 중 발생한 오류:', error); // 오류 로그 출력
        throw new Error(`${error.message}`);
    }
}


module.exports = { uploadImageToFlask };
