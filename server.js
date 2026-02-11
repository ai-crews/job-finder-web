require('dotenv').config(); //환경변수 로드

const express = require('express');
const { google } = require('googleapis');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

async function getJobsFromSheet() {
    const auth = new google.auth.GoogleAuth({
        keyFile: 'credentials.json',
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    const sheets = google.sheets({ version: 'v4', auth });


    // 시트 ID를 여기에 넣어주세요!
    const spreadsheetId = process.env.SPREADSHEET_ID;
    // 시트 탭 이름이 '시트1'이 아니라면 '시트이름!A2:F' 처럼 수정하세요.
    const range = process.env.SHEET_RANGE;

    // 만약 값이 없으면 여기서 에러를 미리 던져서 원인을 파악
    if (!spreadsheetId || !range) {
        throw new Error(".env 파일에서 SPREADSHEET_ID 또는 SHEET_RANGE를 읽지 못했습니다.");
    }

    // 디버깅을 위한 로그
    console.log("----------------------------");
    console.log("시트 ID:", spreadsheetId);
    console.log("데이터 범위:", range);
    console.log("----------------------------");

    const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    return response.data.values || [];
}

app.get('/', async (req, res) => {
    try {
        const jobs = await getJobsFromSheet();
        res.render('index', { jobs });
    } catch (err) {
        console.error('데이터 로드 실패:', err.message); // 상세 에러 메시지 출력
        res.status(500).send(`시트 데이터를 불러오지 못했습니다. 에러: ${err.message}`);
    }
});

// PORT도 .env에서 가져오되, 없으면 기본값 3000을 사용.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT} 에서 확인 가능합니다!`));