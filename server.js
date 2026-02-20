require('dotenv').config(); //환경변수 로드

const express = require('express');
const { google } = require('googleapis');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

// MongoDB 연결 설정
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB 연결 성공!'))
    .catch(err => console.error('DB 연결 에러:', err));

// 클릭 데이터를 위한 스키마(틀) 정의
const clickSchema = new mongoose.Schema({
    recruitment_title: { type: String, unique: true }, // 공고명이 중복되지 않게 저장
    count: { type: Number, default: 0 }
});
const Click = mongoose.model('Click', clickSchema);


async function getJobsFromSheet() {
    const auth = new google.auth.GoogleAuth({
        keyFile: 'credentials.json',
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    const sheets = google.sheets({ version: 'v4', auth });


    // 시트 ID
    const spreadsheetId = process.env.SPREADSHEET_ID;
    // 시트 탭 이름이 '시트1'이 아니라면 '시트이름!A2:F' 처럼 수정
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

        // DB에서 모든 클릭 데이터를 가져옴
        const allStats = await Click.find({});

        // 빠른 조회를 위해 { "공고명": 클릭수 } 형태의 객체로 변환
        const statsMap = {};
        allStats.forEach(item => {
            statsMap[item.recruitment_title] = item.count;
        });

        // 시트 데이터에 클릭수 매칭
        const enrichedJobs = jobs.map(job => {
            const title = job[1]; // 시트의 공고명
            const count = statsMap[title] || 0;
            job[7] = count; // EJS에서 쓸 수 있게 7번 인덱스에 저장
            return job;
        });

        res.render('index', {
            jobs: enrichedJobs,
            gaId: process.env.GA_MEASUREMENT_ID
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("데이터 로딩 중 에러 발생");
    }
});

// 5. 클릭수 증가 API: DB에 업데이트
app.post('/api/jobs/click', async (req, res) => {
    const { recruitment_title } = req.body;

    try {
        // 이 공고명을 찾아서 숫자를 1 올리고, 없으면 새로 만듬(upsert)
        const result = await Click.findOneAndUpdate(
            { recruitment_title: recruitment_title },
            { $inc: { count: 1 } },
            { upsert: true, new: true }
        );

        console.log(`클릭 업데이트: ${recruitment_title} (현재 ${result.count}회)`);
        res.json({ success: true, count: result.count });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

// PORT도 .env에서 가져오되, 없으면 기본값 3000을 사용.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT} 에서 확인 가능합니다!`));