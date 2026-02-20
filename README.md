# 🚀 Job Finder: Google Sheets 기반 수시채용공고 웹사이트

> **Google Sheets를 활용하여 수시 채용 정보를 보여주는 웹사이트 입니다.**

---

## 📌 프로젝트 개요
수시채용공고의 경우 맞춤형 메일을 보내는 것 보다 웹 사이트에서 확인할 수 있도록 만들었습니다.
**Google Sheets**를 활용하였기에 데이터 수정이 쉽습니다.

## ✨ 주요 기능
- **Google Sheets 데이터 연동**: Google Sheets API를 통해 시트의 데이터를 확인
- **직무 필터링**: MLE, DE, DA 등 직무 카테고리별 필터링 기능
- **마감기한 정렬**: 마감기한이 임박한 순서대로 공고 정렬 기능
- **페이지네이션**: 많은 기업의 채용공고가 있을때 10개 단위 페이지 처리
- **반응형 디자인**: 스마트폰에서도 확인 가능한 UI 제공

## 🛠 Tech Stack
- **Backend**: Node.js, Express
- **Frontend**: EJS (Template Engine), Tailwind CSS
- **Database**: Google Sheets API v4
- **Deployment**: 



## 📂 Project Structure
```text
.
├── public/              # 정적 파일 (CSS, Images)
├── views/               # EJS 템플릿 파일
│   └── index.ejs        # 메인 대시보드 페이지
├── server.js            # Express 서버 및 API 연동 로직
├── .gitignore           # 보안을 위한 설정 (credentials.json 제외)
├── .env                 # 환경변수 세팅 
├── credentials.json     # Google Sheets API 서비스 계정 json 키
└── package.json         # 의존성 관리
```

## ⚙️ 초기 세팅 가이드 (Getting Started)

### 1. 필수 요구사항
- **Node.js**: LTS 버전 이상 설치가 필요.
- **Google Cloud 프로젝트**: Sheets API 활성화 및 서비스 계정 키 발급이 필요함.
  - 서비스 계정을 만들고 '키'에 들어가 '키 추가' > '새 키 만들기' > 'json'선택 > 파일 다운받고, 'credentials.json'으로 이름 바꾸기 > 해당 파일을 프로젝트에 넣기
- **.env 파일 생성**: 자신의 SPREADSHEET_ID와 SHEET_RANGE, PORT를 설정하기

### 2. 설치 및 실행
터미널에서 아래 명령어를 순서대로 입력.

```bash
# 1. 저장소 클론 (본인의 계정명으로 수정 필요)
git clone https://github.com/ai-crews/job-finder-web.git

# 2. 프로젝트 폴더 이동
cd job-finder

# 3. 의존성 라이브러리 설치
npm install

# 4. 로컬 서버 실행
node server.js
```

## 📺 시연 영상
[![Job Finder 시연 영상](https://img.youtube.com/vi/swkIy9-_ouY/maxresdefault.jpg)](https://www.youtube.com/watch?v=swkIy9-_ouY)

## 🛜 실제 이용 URL
