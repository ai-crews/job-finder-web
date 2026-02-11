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

    // 지혜 님의 시트 ID를 여기에 넣어주세요!
    const spreadsheetId = '1NgUX0IiyH42wVM_GWHpiRSdMOc6je2fIzB1zEijbPfM';
    // 시트 탭 이름이 '시트1'이 아니라면 '수시채용공고목록!A2:F' 처럼 수정하세요.
    const range = 'Sheet1!A2:J';

    const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    return response.data.values || [];
}

app.get('/', async (req, res) => {
    try {
        const jobs = await getJobsFromSheet();
        res.render('index', { jobs });
    } catch (err) {
        console.error('데이터 로드 실패:', err);
        res.status(500).send('시트 데이터를 불러오지 못했습니다.');
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT} 에서 확인 가능합니다!`));