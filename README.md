# Nano Banana Icon Asset Generator

위시무드(Wishmood) 서비스의 그래픽 에셋을 생성하기 위한 어드민 플랫폼입니다.

## Demo
🔗 [Live Demo](https://ai-ui-description-figma-plugin.vercel.app)

## 🖼️ Preview  
<p align="center">
  <img src="https://raw.githubusercontent.com/Seungw1n/ai-mood-asset-generator/main/public/thumbnail.png" alt="Project Thumbnail" width="600"/>
</p>

## 📝 프로젝트 개요

위시무드는 사용자가 자신의 취향대로 그래픽 보드를 만들 수 있는 서비스입니다. 이 플랫폼은 위시무드 서비스에 제공될 그래픽 에셋을 생성하고 관리하는 어드민 도구입니다.

### 주요 기능

- **그래픽 스타일 정의**: 추상적인 그래픽 스타일을 명확한 JSON 형식으로 규정
- **레퍼런스 관리**: 그래픽 이름과 레퍼런스 이미지 관리
- **에셋 생성**: 정의된 그래픽 컨셉에 맞춰 AI 기반 에셋 자동 생성
- **워크스페이스 관리**: 여러 그래픽 스타일을 워크스페이스 단위로 조직화

생성된 에셋은 위시무드 서비스에 제공되어 사용자들이 개인화된 보드를 만들 때 활용됩니다.

## 🚀 시작하기

### 필수 요구사항

- Node.js (최신 LTS 버전 권장)
- Gemini API Key
- Supabase 계정 및 프로젝트

### 설치 및 실행

1. 의존성 패키지 설치:
   ```bash
   npm install
   ```

2. 환경 변수 설정:
   - `.env.local` 파일 생성
   - Gemini API 키 설정: `GEMINI_API_KEY=your_api_key_here`
   - Supabase 설정 추가 (필요시)

3. 개발 서버 실행:
   ```bash
   npm run dev
   ```

4. 프로덕션 빌드:
   ```bash
   npm run build
   ```

## 🛠 기술 스택

- **Frontend**: React + TypeScript
- **Build Tool**: Vite
- **AI Service**: Google Gemini AI
- **Database**: Supabase
- **Styling**: CSS-in-JS (React inline styles)

## 📦 주요 구성

```
src/
├── components/        # UI 컴포넌트
│   ├── AssetCard.tsx
│   ├── AssetForm.tsx
│   ├── AssetList.tsx
│   ├── StyleEditorModal.tsx
│   └── WorkspaceSelector.tsx
├── pages/            # 페이지 컴포넌트
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   └── WorkspacePage.tsx
├── services/         # 외부 서비스 연동
│   ├── geminiService.ts
│   └── supabaseService.ts
├── contexts/         # React Context
├── types.ts          # TypeScript 타입 정의
└── constants.ts      # 상수 정의
```

## 🔑 주요 기능 상세

### 워크스페이스

각 워크스페이스는 특정 그래픽 스타일을 나타내며, 다음 정보를 포함합니다:
- 워크스페이스 이름 및 설명
- 그래픽 스타일 정의 (JSON)
- 레퍼런스 이미지
- 생성된 에셋 목록

### 스타일 정의

그래픽 스타일은 구조화된 JSON 형식으로 정의되며, AI가 이를 기반으로 일관된 스타일의 에셋을 생성합니다.

### 에셋 생성

Gemini AI를 활용하여 정의된 스타일 가이드에 따라 자동으로 그래픽 에셋을 생성합니다.

## 📄 라이선스

Private

## 🔗 관련 링크

- AI Studio: https://ai.studio/apps/drive/1R9yRN_lYBahwYH8s2y7Uc7oUtp5XfEdK