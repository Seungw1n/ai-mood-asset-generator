# Supabase Storage 설정 가이드

"Failed to upload image" 오류를 해결하기 위한 Storage 설정 가이드입니다.

## 1단계: Storage 버킷 생성

1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택
3. 왼쪽 메뉴에서 **Storage** 클릭
4. **New bucket** 버튼 클릭
5. 버킷 설정:
   - **Name**: `assets-storage`
   - **Public bucket**: ✅ **체크** (매우 중요!)
   - **File size limit**: 기본값 (50MB) 사용
   - **Allowed MIME types**: 비워두기 (모든 타입 허용)
6. **Create bucket** 클릭

## 2단계: Storage 정책(Policies) 설정

버킷 생성 후 정책을 설정해야 합니다.

### 방법 1: SQL Editor 사용 (권장)

1. Supabase Dashboard에서 **SQL Editor** 메뉴로 이동
2. "New query" 클릭
3. 다음 SQL 실행:

```sql
-- 1. 모든 사용자에게 assets-storage 버킷의 파일 업로드 권한 부여
CREATE POLICY "Allow public uploads to assets-storage bucket"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'assets-storage');

-- 2. 모든 사용자에게 assets-storage 버킷의 파일 읽기 권한 부여
CREATE POLICY "Allow public read access to assets-storage bucket"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'assets-storage');

-- 3. 모든 사용자에게 assets-storage 버킷의 파일 업데이트 권한 부여
CREATE POLICY "Allow public updates to assets-storage bucket"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'assets-storage')
WITH CHECK (bucket_id = 'assets-storage');

-- 4. 모든 사용자에게 assets-storage 버킷의 파일 삭제 권한 부여
CREATE POLICY "Allow public deletes from assets-storage bucket"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'assets-storage');
```

### 방법 2: UI에서 정책 생성

1. **Storage** > **assets-storage** 버킷 클릭
2. **Policies** 탭 클릭
3. **New policy** 버튼 클릭
4. 각 작업(INSERT, SELECT, UPDATE, DELETE)에 대해 정책 생성:

#### INSERT 정책 (업로드)
- **Policy name**: `Allow public uploads`
- **Allowed operation**: `INSERT`
- **Target roles**: `public`
- **USING expression**: (비워두기)
- **WITH CHECK expression**:
  ```sql
  bucket_id = 'assets-storage'
  ```

#### SELECT 정책 (읽기)
- **Policy name**: `Allow public read`
- **Allowed operation**: `SELECT`
- **Target roles**: `public`
- **USING expression**:
  ```sql
  bucket_id = 'assets-storage'
  ```

#### UPDATE 정책 (수정)
- **Policy name**: `Allow public updates`
- **Allowed operation**: `UPDATE`
- **Target roles**: `public`
- **USING expression**:
  ```sql
  bucket_id = 'assets-storage'
  ```
- **WITH CHECK expression**:
  ```sql
  bucket_id = 'assets-storage'
  ```

#### DELETE 정책 (삭제)
- **Policy name**: `Allow public deletes`
- **Allowed operation**: `DELETE`
- **Target roles**: `public`
- **USING expression**:
  ```sql
  bucket_id = 'assets-storage'
  ```

## 3단계: 버킷 설정 확인

1. **Storage** > **assets-storage** 버킷으로 이동
2. **Configuration** 탭 확인:
   - ✅ **Public bucket** 이 활성화되어 있어야 함
3. **Policies** 탭 확인:
   - 최소 4개의 정책이 있어야 함 (INSERT, SELECT, UPDATE, DELETE)

## 4단계: 수동 테스트

1. **Storage** > **assets-storage** 버킷으로 이동
2. **Upload file** 버튼 클릭
3. 테스트 이미지 업로드
4. 업로드가 성공하면 설정이 올바르게 된 것입니다

## 5단계: 애플리케이션 테스트

1. 개발 서버 재시작:
   ```bash
   npm run dev
   ```

2. 로그인 후 워크스페이스에서 이미지 생성 테스트

3. 브라우저 개발자 도구 콘솔에서 로그 확인:
   - "Uploading image:" - 업로드 시작
   - "Upload successful:" - 업로드 성공
   - "Public URL generated:" - URL 생성 완료

## 문제 해결

### 오류: "Bucket not found"
- **원인**: `assets-storage` 버킷이 생성되지 않음
- **해결**: 1단계로 돌아가 버킷 생성

### 오류: "new row violates row-level security policy"
- **원인**: Storage 정책이 설정되지 않음
- **해결**: 2단계의 SQL 스크립트 실행

### 오류: "Failed to upload image"
1. 브라우저 개발자 도구 콘솔 확인
2. 더 자세한 에러 메시지 확인
3. Supabase Dashboard > **Storage** > **assets-storage** > **Policies** 탭에서 정책 확인

### 버킷이 비공개(Private)로 설정된 경우
1. **Storage** > **assets-storage** 버킷 클릭
2. **Configuration** 탭
3. **Make public** 버튼 클릭

## 보안 참고사항

⚠️ **개발 환경**에서는 위의 public 정책을 사용해도 괜찮지만, **프로덕션 환경**에서는:

1. 인증된 사용자만 업로드 가능하도록 제한:
   ```sql
   CREATE POLICY "Allow authenticated uploads"
   ON storage.objects
   FOR INSERT
   TO authenticated  -- public 대신 authenticated 사용
   WITH CHECK (bucket_id = 'assets-storage');
   ```

2. 파일 크기 제한 설정
3. MIME 타입 제한 (이미지만 허용)
4. Rate limiting 설정

## 확인 체크리스트

- [ ] `assets-storage` 버킷이 생성되어 있음
- [ ] 버킷이 **Public**으로 설정되어 있음
- [ ] INSERT 정책이 있음 (업로드 허용)
- [ ] SELECT 정책이 있음 (읽기 허용)
- [ ] 수동으로 파일 업로드 테스트 성공
- [ ] 애플리케이션에서 이미지 생성 테스트 성공

모든 항목이 체크되면 Storage가 정상적으로 작동합니다!