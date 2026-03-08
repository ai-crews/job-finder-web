# 🚀 Job Finder: Google Sheets 기반 수시채용공고 웹사이트

> **Google Sheets를 활용하여 수시 채용 정보를 보여주는 웹사이트 입니다.**

---

## 📌 프로젝트 개요
수시채용공고의 경우 맞춤형 메일을 보내는 것 보다 웹 사이트에서 확인할 수 있도록 만들었습니다.
**Google Sheets**를 활용하였기에 데이터 수정이 쉽습니다.

## ✨ 주요 기능
- **Google Sheets 데이터 연동**: Google Sheets API를 통해 시트의 데이터를 확인
- **직무 필터링 및 검색**: MLE, 데이터엔지니어, 데이터분석가 등 직무 카테고리 필터링 기능과 기업명/공고명 키워드 검색 지원
- **마감기한 자동 정렬**: 마감기한이 임박한 순서대로 공고 정렬 기능
- **무한스크롤**: 방대한 양의 채용공고를 10개 단위로 부드럽게 로드하여 사용자 경험(UX) 최적화
- **공고 클릭 수 확인**: MongoDB를 활용해 사용자들이 어떤 공고를 많이 클릭했는지 실시간 카운트 및 UI에 화염(🔥) 아이콘과 함께 노출
- **반응형 디자인**: Tailwind CSS를 활용해 모바일과 데스크톱 환경 모두에 최적화된 UI 제공
- **GA4 및 유입 경로 추적**: Google Analytics 연동 및 이메일/웹 등 사용자의 유입 소스(source) 트래킹 기능 내장

## 🛠 Tech Stack
- **Backend**: Node.js, Express
- **Frontend**: EJS (Template Engine), Tailwind CSS, JavaScript
- **Database & API**: Google Sheets API v4, MongoDB Atlas (Mongoose)
- **Analytics**: Google Analytics 4 (GA4)
- **Deployment**: Railway



## 📂 Project Structure
```text
.
├── public/              # 정적 파일 (favicon 등)
├── views/               # EJS 템플릿 파일
│   └── index.ejs        # 메인 웹 페이지 (프론트엔드 로직 포함)
├── server.js            # Express 서버 및 API, DB 연동 로직
├── .gitignore           # 보안을 위한 설정 (credentials.json 제외)
├── .env                 # 환경변수 세팅 
├── credentials.json     # Google Sheets API 서비스 계정 json 키
└── package.json         # 의존성 라이브러리 및 스크립트 관리
```

## ⚙️ 초기 세팅 가이드 (Getting Started)

### 1. 필수 요구사항
- **Node.js**: LTS 버전 이상 설치가 필요
- **Google Cloud 프로젝트**: 
  - Google Sheets API 활성화
  - 서비스 계정(Service Account) 생성 및 키(JSON) 발급 
  - 주의: 다운로드 받은 JSON 파일의 내용을 통째로 복사하여 .env 파일의 GOOGLE_CREDENTIALS에 넣어야 합니다.
- **MongoDB Atlas**: 공고 클릭 수 저장을 위한 클러스터 및 Database 생성
- **Google Analytics 4**: 데이터 수집을 위한 측정 ID (G-XXXXXXX) 발급
- **.env 파일 생성**: 자신의 SPREADSHEET_ID와 SHEET_RANGE, PORT 등을 설정하기

### 2. 설치 및 실행
터미널에서 아래 명령어를 순서대로 입력.

```bash
# 1. 저장소 클론
git clone https://github.com/ai-crews/job-finder-web.git

# 2. 프로젝트 폴더 이동
cd job-finder

# 3. 의존성 라이브러리 설치
npm install

# 4. 로컬 서버 실행
node server.js
```

### .env 파일 예시
```bash
# 포트 설정
PORT=3000

# Google Sheets 설정
SPREADSHEET_ID=당신의_스프레드시트_아이디_입력
SHEET_RANGE=Sheet1!A2:H

# MongoDB 연동 (Atlas URI)
MONGODB_URI=mongodb+srv://<사용자아이디>:<비밀번호>@<클러스터주소>/myJobs?retryWrites=true&w=majority

# Google Analytics 설정
GA_MEASUREMENT_ID=G-영문숫자입력

# Google 서비스 계정 자격 증명 (JSON 내용을 한 줄로 또는 그대로 문자열로 입력)
GOOGLE_CREDENTIALS={"type": "service_account", "project_id": "...", "private_key": "...", "client_email": "..."}

```

## 📺 시연 영상 및 사진
[![Job Finder 시연 영상](https://img.youtube.com/vi/uMQhQMBzzP8/0.jpg)](https://www.youtube.com/watch?v=uMQhQMBzzP8)

## 🛜 실제 이용 URL
https://job-finder-web-production.up.railway.app/