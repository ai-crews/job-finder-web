require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { google } = require('googleapis');

// 💡 이미지가 저장될 폴더 경로 설정 (public/logos)
const LOGO_DIR = path.join(__dirname, 'public', 'logos');

// 폴더가 없으면 자동으로 생성
if (!fs.existsSync(LOGO_DIR)) {
    fs.mkdirSync(LOGO_DIR, { recursive: true });
}

// 💡 대상 서버(THE VC)에 과부하를 주지 않기 위한 딜레이 함수
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 파일명에 쓸 수 없는 특수문자 제거 함수
const sanitizeFilename = (name) => {
    return name.replace(/[^a-z0-9가-힣]/gi, '_');
};

async function downloadImage(url, filename) {
    const filePath = path.join(LOGO_DIR, filename);

    // 이미 파일이 존재하면 다운로드 건너뛰기 (효율성)
    if (fs.existsSync(filePath)) {
        console.log(`⏩ 스킵: ${filename} (이미 존재함)`);
        return;
    }

    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
            timeout: 10000, // 10초 타임아웃
        });

        return new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`❌ 실패: ${filename} (${url}) - ${error.message}`);
    }
}

async function run() {
    console.log('🚀 로고 일괄 다운로드 스크립트를 시작합니다...');

    try {
        // 기존 server.js와 동일한 방식으로 구글 시트 연결
        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });
        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = process.env.SPREADSHEET_ID;
        const range = process.env.SHEET_RANGE;

        const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
        const rows = response.data.values || [];

        console.log(`총 ${rows.length}개의 데이터를 확인했습니다.\n`);

        for (let i = 0; i < rows.length; i++) {
            const companyName = rows[i][0]; // A열: 기업명
            const logoUrl = rows[i][6];     // G열: 로고 URL (index 6)

            if (!companyName || !logoUrl) continue;

            // 외부 URL인 경우에만 다운로드 진행
            if (logoUrl.startsWith('http')) {
                // 예: "토스.jpg" 형태로 저장
                const filename = `${sanitizeFilename(companyName)}.jpg`;

                console.log(`⬇️ 다운로드 중 [${i + 1}/${rows.length}]: ${companyName}`);
                await downloadImage(logoUrl, filename);

                // 서버 차단을 막기 위해 1장 다운로드 후 0.5초 대기
                await sleep(500);
            }
        }
        console.log('\n🎉 모든 다운로드 작업이 완료되었습니다!');
    } catch (error) {
        console.error('스크립트 실행 중 에러 발생:', error);
    }
}

run();