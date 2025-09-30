# Vercel 배포 가이드

이 문서는 Vercel에 애플리케이션을 배포하고 환경 변수를 설정하는 방법을 설명합니다.

## 📋 배포 전 체크리스트

- [ ] Supabase 프로젝트가 생성되어 있음
- [ ] Supabase 데이터베이스 테이블 (`assets`, `workspaces`) 생성됨
- [ ] Supabase Storage 버킷 (`assets-storage`) 생성됨
- [ ] Gemini API 키 발급됨
- [ ] GitHub 저장소에 코드가 푸시됨

## 🚀 Vercel 배포 단계

### 1. Vercel 프로젝트 생성

1. [Vercel 대시보드](https://vercel.com/dashboard)에 로그인
2. "Add New..." > "Project" 클릭
3. GitHub 저장소 연결
4. 프로젝트 import

### 2. 빌드 설정 (자동 감지됨)

Vercel이 자동으로 감지하지만, 필요시 수동 설정:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. 환경 변수 설정 (중요!)

Vercel 프로젝트 설정에서 다음 환경 변수를 **반드시** 설정해야 합니다.

#### 🔧 Settings > Environment Variables로 이동

아래 환경 변수를 추가하세요:

#### Supabase 설정 (클라이언트용 - `VITE_` prefix 필요)

| 변수 이름 | 값 | 설명 |
|----------|-----|------|
| `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` | Supabase 프로젝트 URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGc...` | Supabase anon/public key |

#### Gemini API 설정 (서버용 - `VITE_` prefix 없음)

| 변수 이름 | 값 | 설명 |
|----------|-----|------|
| `GEMINI_API_KEY` | `AIzaSy...` | Google Gemini API 키 |

#### 환경 변수 가져오기

Supabase 값을 가져오는 방법:

1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택
3. **Settings** > **API** 메뉴로 이동
4. 다음 값 복사:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

### 4. 환경별 설정

환경 변수는 다음 환경에 모두 추가하는 것을 권장합니다:

- ✅ **Production** (필수)
- ✅ **Preview** (권장)
- ✅ **Development** (선택)

### 5. 배포 실행

1. "Deploy" 버튼 클릭
2. 빌드 로그 확인
3. 배포 완료 후 URL 확인

## 🐛 배포 후 문제 해결

### "Failed to fetch assets" 오류

**증상**: 워크스페이스 페이지에서 "Loading assets..." 무한 표시 또는 "Error: Failed to fetch assets." 표시

**원인**:
1. Supabase 환경 변수가 설정되지 않음
2. 환경 변수에 `VITE_` prefix가 누락됨
3. Supabase 데이터베이스 테이블이 생성되지 않음
4. RLS 정책이 설정되지 않음

**해결 방법**:

#### 1. 환경 변수 확인

Vercel 대시보드에서:
1. **Settings** > **Environment Variables**로 이동
2. 다음 변수가 모두 존재하는지 확인:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
3. 값이 올바르게 설정되어 있는지 확인
4. 변수 수정 후 **반드시 재배포** 필요

#### 2. 브라우저 콘솔 확인

배포된 사이트에서:
1. F12 키로 개발자 도구 열기
2. Console 탭 확인
3. 다음 메시지 확인:

**정상 케이스**:
```
Supabase config validation: { hasUrl: true, hasKey: true, ... }
✅ Supabase client initialized successfully
🔍 Fetching assets for workspace: y2k
📤 Executing query...
✅ Assets fetched successfully: X items
```

**오류 케이스**:
```
❌ Supabase is NOT configured. Using mock client.
Supabase config validation: { hasUrl: false, hasKey: false, ... }
```

또는

```
❌ Supabase error details: { message: "...", code: "...", ... }
```

#### 3. Supabase 데이터베이스 확인

1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. **Table Editor** > **assets** 테이블 확인
3. 테이블이 없으면 `SUPABASE_SETUP.md` 가이드 참고하여 생성

#### 4. RLS 정책 확인

1. Supabase Dashboard > **Authentication** > **Policies**
2. `assets` 테이블에 읽기 정책이 있는지 확인
3. 없으면 다음 SQL 실행:

```sql
CREATE POLICY "Allow public read access"
  ON assets FOR SELECT
  USING (true);
```

#### 5. 재배포

환경 변수 수정 후:
1. **Deployments** 탭으로 이동
2. 최신 배포 옆 "..." 메뉴 클릭
3. **Redeploy** 선택
4. 새 배포 완료 대기

### "Invalid Gemini API key" 오류

**원인**:
- `GEMINI_API_KEY` 환경 변수가 설정되지 않음
- API 키가 유효하지 않음

**해결 방법**:
1. Vercel Settings에서 `GEMINI_API_KEY` 확인
2. [Google AI Studio](https://makersuite.google.com/app/apikey)에서 새 키 발급
3. 환경 변수 업데이트 후 재배포

### "Storage bucket not found" 오류

**원인**: Supabase Storage 버킷이 생성되지 않음

**해결 방법**:
1. Supabase Dashboard > **Storage**로 이동
2. `assets-storage` 버킷 생성
3. Public bucket으로 설정
4. Storage 정책 설정 (자세한 내용은 `STORAGE_SETUP_GUIDE.md` 참고)

## 📊 배포 상태 모니터링

### 빌드 로그 확인

1. Vercel Dashboard > **Deployments** 탭
2. 배포 클릭하여 로그 확인
3. 오류 발생 시 스택 트레이스 확인

### 런타임 로그 확인

1. Vercel Dashboard > **Deployments** > 배포 선택
2. **Runtime Logs** 탭 클릭
3. 실시간 서버 로그 확인

### 브라우저 콘솔 로그

프로덕션 환경에서도 상세한 로그가 출력되도록 설정되어 있습니다:
- Supabase 연결 상태
- 쿼리 실행 결과
- 에러 상세 정보

## 🔒 보안 권장사항

### 프로덕션 환경

현재는 개발 편의를 위해 모든 접근을 허용하고 있지만, 프로덕션 환경에서는:

1. **Supabase RLS 정책 강화**:
   ```sql
   -- 인증된 사용자만 쓰기 허용
   CREATE POLICY "Authenticated users can insert"
     ON assets FOR INSERT
     TO authenticated
     WITH CHECK (true);
   ```

2. **Storage 정책 강화**:
   - 파일 크기 제한
   - MIME 타입 제한 (이미지만 허용)
   - Rate limiting 설정

3. **API Key 보호**:
   - Gemini API 키를 절대 클라이언트에 노출하지 않음 (현재는 `/api/gemini` 프록시 사용 중)
   - Supabase anon key는 공개되어도 RLS 정책으로 보호됨

## 🔄 업데이트 배포

코드 변경 후:
1. GitHub에 푸시
2. Vercel이 자동으로 빌드 및 배포
3. 배포 상태 확인
4. Preview URL에서 테스트 후 Production으로 프로모션

## 📝 환경 변수 요약

### 필수 환경 변수

```bash
# 클라이언트 (브라우저에서 접근 가능, VITE_ prefix 필수)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# 서버 (serverless function에서만 사용, VITE_ prefix 없음)
GEMINI_API_KEY=AIzaSy...
```

### 환경 변수 체크 명령

로컬 환경에서 테스트:
```bash
npm run build
npm run preview
```

브라우저 콘솔에서 확인:
```javascript
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
```

## 🆘 추가 도움말

문제가 계속되면:
1. 브라우저 콘솔의 전체 에러 로그 캡처
2. Vercel 빌드 로그 확인
3. Supabase 테이블 구조 확인
4. RLS 정책 상태 확인

관련 문서:
- `SUPABASE_SETUP.md` - Supabase 초기 설정
- `STORAGE_SETUP_GUIDE.md` - Storage 버킷 설정
- `README.md` - 프로젝트 개요