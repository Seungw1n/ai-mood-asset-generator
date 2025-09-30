# Supabase 설정 가이드

이 문서는 Nano Banana Icon Asset Generator를 위한 Supabase 데이터베이스 및 스토리지 설정 방법을 설명합니다.

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 접속하여 로그인
2. "New Project" 버튼 클릭
3. 프로젝트 이름, 데이터베이스 비밀번호, 리전 선택
4. "Create new project" 클릭

## 2. 데이터베이스 테이블 생성

### 방법 1: SQL Editor 사용 (권장)

1. Supabase 대시보드에서 **SQL Editor** 메뉴로 이동
2. "New query" 버튼 클릭
3. `supabase-setup.sql` 파일의 내용을 복사하여 붙여넣기
4. "Run" 버튼 클릭하여 실행

### 방법 2: Table Editor 사용

#### Workspaces 테이블

1. Supabase 대시보드에서 **Table Editor** 메뉴로 이동
2. "Create a new table" 클릭
3. 테이블 설정:
   - **Name**: `workspaces`
   - **Columns**:
     - `id` (text, Primary Key)
     - `name` (text, NOT NULL)
     - `description` (text)
     - `style` (jsonb, NOT NULL)
     - `creator` (text, NOT NULL)
     - `created_at` (timestamptz, DEFAULT: now())
   - **RLS (Row Level Security)**: Enabled
4. "Save" 클릭

#### Assets 테이블

1. "Create a new table" 클릭
2. 테이블 설정:
   - **Name**: `assets`
   - **Columns**:
     - `id` (uuid, Primary Key, DEFAULT: gen_random_uuid())
     - `name` (text, NOT NULL)
     - `description` (text)
     - `image_url` (text, NOT NULL)
     - `style` (jsonb, NOT NULL)
     - `workspace_id` (text, Foreign Key → workspaces.id)
     - `created_at` (timestamptz, DEFAULT: now())
   - **RLS (Row Level Security)**: Enabled
3. "Save" 클릭

## 3. Row Level Security (RLS) 정책 설정

### Workspaces 테이블 정책

1. **Table Editor** > **workspaces** 테이블 선택
2. 상단의 **RLS** 탭 클릭
3. "Add Policy" 버튼 클릭
4. 다음 정책들을 추가:

**모든 읽기 허용:**
```sql
CREATE POLICY "Allow public read access"
  ON workspaces FOR SELECT
  USING (true);
```

**모든 쓰기 허용:**
```sql
CREATE POLICY "Allow public insert access"
  ON workspaces FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON workspaces FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete access"
  ON workspaces FOR DELETE
  USING (true);
```

### Assets 테이블 정책

동일한 방식으로 `assets` 테이블에도 정책 추가:

```sql
CREATE POLICY "Allow public read access"
  ON assets FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access"
  ON assets FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON assets FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete access"
  ON assets FOR DELETE
  USING (true);
```

## 4. Storage 버킷 생성

### 버킷 생성

1. Supabase 대시보드에서 **Storage** 메뉴로 이동
2. "Create a new bucket" 버튼 클릭
3. 버킷 설정:
   - **Name**: `assets`
   - **Public bucket**: ✅ 체크 (public 접근 허용)
4. "Create bucket" 클릭

### Storage 정책 설정

1. 생성된 `assets` 버킷 선택
2. "Policies" 탭 클릭
3. "New Policy" 버튼 클릭

**모든 업로드 허용:**
```sql
CREATE POLICY "Allow public upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'assets');
```

**모든 읽기 허용:**
```sql
CREATE POLICY "Allow public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'assets');
```

**모든 삭제 허용:**
```sql
CREATE POLICY "Allow public delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'assets');
```

## 5. 환경 변수 설정

1. Supabase 대시보드에서 **Settings** > **API** 메뉴로 이동
2. 다음 정보를 복사:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...`

3. 프로젝트 루트에 `.env.local` 파일 생성:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# Gemini API Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## 6. 기본 데이터 삽입 (선택사항)

SQL Editor에서 다음을 실행하여 기본 워크스페이스 데이터 삽입:

```sql
INSERT INTO workspaces (id, name, description, style, creator, created_at)
VALUES
  (
    'y2k',
    'Y2K',
    'Icons with a retro-futuristic Y2K aesthetic, featuring glossy and translucent elements.',
    '{"style": "glossy plastic and chrome", "material": "translucent plastic and bubbly shapes", "finish": "shiny and iridescent", "texture": "smooth with cybernetic details"}',
    'system',
    '2023-10-26T10:00:00Z'
  ),
  (
    'analog',
    'Analog',
    'Retro-style icons with a warm, analog feel.',
    '{"style": "retro analog", "material": "bakelite plastic and warm wood", "finish": "matte and satin", "texture": "textured with physical knobs"}',
    'system',
    '2023-10-26T10:05:00Z'
  ),
  (
    'vintage',
    'Vintage',
    'Faded and distressed icons with a vintage aesthetic.',
    '{"style": "faded vintage", "material": "aged paper and distressed leather", "finish": "dull and worn", "texture": "cracked and weathered"}',
    'system',
    '2023-10-26T10:10:00Z'
  )
ON CONFLICT (id) DO NOTHING;
```

## 7. 테이블 구조 확인

### workspaces 테이블
```
┌─────────────┬────────────┬──────────┬─────────────┐
│ Column      │ Type       │ Nullable │ Default     │
├─────────────┼────────────┼──────────┼─────────────┤
│ id          │ text       │ NO       │             │
│ name        │ text       │ NO       │             │
│ description │ text       │ YES      │             │
│ style       │ jsonb      │ NO       │             │
│ creator     │ text       │ NO       │             │
│ created_at  │ timestamptz│ YES      │ now()       │
└─────────────┴────────────┴──────────┴─────────────┘
```

### assets 테이블
```
┌──────────────┬────────────┬──────────┬────────────────────┐
│ Column       │ Type       │ Nullable │ Default            │
├──────────────┼────────────┼──────────┼────────────────────┤
│ id           │ uuid       │ NO       │ gen_random_uuid()  │
│ name         │ text       │ NO       │                    │
│ description  │ text       │ YES      │                    │
│ image_url    │ text       │ NO       │                    │
│ style        │ jsonb      │ NO       │                    │
│ workspace_id │ text       │ NO       │                    │
│ created_at   │ timestamptz│ YES      │ now()              │
└──────────────┴────────────┴──────────┴────────────────────┘
```

## 8. 연결 테스트

애플리케이션을 실행하고 다음을 확인:

```bash
npm run dev
```

1. 로그인 (ID: `wm-admin`, 비밀번호: `Makewishmood:)`)
2. 워크스페이스가 정상적으로 표시되는지 확인
3. 이미지 생성 테스트
4. Supabase Storage에 이미지가 업로드되었는지 확인
5. assets 테이블에 데이터가 저장되었는지 확인

## 보안 참고사항

⚠️ **개발 환경에서는** 위의 RLS 정책(모든 접근 허용)을 사용해도 괜찮지만, **프로덕션 환경에서는** 더 엄격한 정책을 설정해야 합니다:

- 인증된 사용자만 쓰기 가능
- 특정 역할(role)에만 권한 부여
- API Key 기반 접근 제어 등

## 문제 해결

### 연결 오류
- `.env.local` 파일이 올바르게 설정되었는지 확인
- Supabase URL과 Anon Key가 정확한지 확인
- 개발 서버를 재시작

### RLS 오류
- RLS 정책이 올바르게 생성되었는지 확인
- 개발 중에는 임시로 RLS를 비활성화할 수 있음 (권장하지 않음)

### Storage 업로드 오류
- `assets` 버킷이 public으로 설정되어 있는지 확인
- Storage 정책이 올바르게 설정되었는지 확인