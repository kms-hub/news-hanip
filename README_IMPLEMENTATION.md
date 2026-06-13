# 뉴스한입 구현 단계 제출용 안내

이 폴더는 `뉴스한입` 구현 단계 제출을 위해 만든 React Native 기반 Android 앱 소스 코드입니다.

## 구현 기능

- 회원가입 / 로그인 화면
- 관심 키워드 설정
- 키워드 기반 뉴스 요약 카드 표시
- 요약 새로고침
- 즐겨찾기 추가 / 삭제
- 상세기사 링크 열기
- 매일 아침 알림 시간 설정
- Android Java Native Module을 이용한 SharedPreferences 저장, AlarmManager 알림 예약, URL 열기

## 기술 구성

- React Native 기반 Android 앱
- Java Android Native Module
- 로컬 데모 뉴스 데이터 사용
- Android 범용 스마트폰 실행 대상

## 파일 구조

```text
src/App.js                                  앱 화면 및 상태 관리
src/data/mockNews.js                         데모 뉴스 데이터
src/storage.js                               React Native ↔ Java Native Module 연결
android/app/src/main/java/com/newshanip/     Android Java 코드
.github/workflows/android-apk.yml            GitHub Actions APK 자동 빌드 설정
```

## 로컬에서 APK 만들기

Android Studio, Android SDK, JDK 17, Node.js 20 이상이 설치되어 있어야 합니다.

```bash
npm install
cd android
gradle :app:assembleDebug
```

생성 위치:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## GitHub Actions로 APK 만들기

1. 이 폴더 안의 파일들을 기존 `news-hanip` GitHub 저장소 루트에 복사합니다.
2. GitHub에 커밋/푸시합니다.
3. GitHub 저장소에서 `Actions` 탭으로 이동합니다.
4. `Build Android APK` 워크플로를 실행합니다.
5. 완료 후 `news-hanip-debug-apk` artifact를 다운로드합니다.
6. 압축을 풀면 `app-debug.apk`가 있습니다.

## 제출 방법

- 소스 코드: 이 프로젝트 폴더 전체를 압축해서 제출
- APK: `app-debug.apk` 파일 제출
- GitHub 링크: `Implementation` 과제 제출 창 또는 테스트 항목 URL 칸에 저장소 링크 작성

## 주의

이 구현은 과제 시연용 독립 실행 앱입니다. 실제 뉴스 API 연동 대신 로컬 데모 뉴스 데이터를 사용했습니다. API 키 없이도 앱 화면, 키워드 설정, 즐겨찾기, 알림 기능을 확인할 수 있도록 만들었습니다.
