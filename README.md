# SPARTNER 🥊
오픈 스파링 네트워크 — 근처 체육관과 파이터를 연결합니다

---

## 📁 프로젝트 구조

```
spartner/
├── App.js                          # 메인 앱 + 탭 네비게이션
├── app.json                        # Expo 설정
├── eas.json                        # EAS Build 설정 (앱스토어 배포)
├── package.json
└── src/
    ├── data/index.js               # 데이터, 색상 상수
    ├── components/UI.js            # 공통 컴포넌트
    └── screens/
        ├── EventsScreen.js         # 이벤트 목록 + 댓글
        ├── MatchScreen.js          # 파이터 매칭
        ├── GymsScreen.js           # 체육관 목록
        └── AdminScreen.js          # 관리자 대시보드
```

---

## 🚀 로컬 실행 (개발)

### 1. 의존성 설치
```bash
npm install
```

### 2. Expo 실행
```bash
npx expo start
```

### 3. 기기에서 확인
- **Android 실기기**: [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) 설치 → QR 스캔
- **Android 에뮬레이터**: Android Studio 에뮬레이터 실행 후 `a` 키 입력
- **iOS 시뮬레이터** (Mac 전용): `i` 키 입력

---

## 📦 APK 빌드 (Android)

### 방법 A — EAS Build (권장, 클라우드 빌드)
```bash
# EAS CLI 설치
npm install -g eas-cli

# Expo 계정 로그인 (없으면 expo.dev 에서 무료 가입)
eas login

# 테스트용 APK 빌드 (무료)
eas build --platform android --profile preview

# 완성되면 다운로드 링크가 터미널에 출력됩니다
```

### 방법 B — 로컬 빌드
```bash
# Java 17 + Android SDK 필요
npx expo run:android
```

---

## 🏪 앱스토어/플레이스토어 출시

### Google Play Store
```bash
# 프로덕션 AAB 빌드
eas build --platform android --profile production

# 스토어 제출
eas submit --platform android
```

### Apple App Store
```bash
# Mac + Xcode 필요
eas build --platform ios --profile production
eas submit --platform ios
```

---

## 🔧 주요 기능

| 기능 | 설명 |
|------|------|
| 이벤트 탭 | 근처 스파링 이벤트 목록, 참가 신청, 참가자 댓글 |
| 매칭 탭 | 체급/레벨 필터로 파이터 탐색 |
| 체육관 탭 | 근처 체육관 상세 정보, 예정 이벤트 연결 |
| 관리자 | 이벤트 개설/관리, 참가자 현황, 회원 목록 |

---

## 📱 사용 기술

- **React Native + Expo** ~51
- **expo-router** — 파일 기반 라우팅
- **expo-haptics** — 햅틱 피드백
- **react-native-safe-area-context** — 노치/홈바 대응
- **expo-linear-gradient** — 그라디언트
- **EAS Build** — 클라우드 빌드 & 배포

---

## 💡 다음 단계 (백엔드 연동 시)

1. **Supabase** 또는 **Firebase**로 실시간 데이터 연동
2. **push notifications** — 이벤트 알림, 댓글 알림
3. **위치 기반** — 실제 GPS로 근처 체육관 필터
4. **소셜 로그인** — 카카오/구글 로그인
