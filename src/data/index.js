// ── 색상 ──────────────────────────────────────────────
export const Colors = {
  bg: '#09090f',
  surface: '#111118',
  surface2: '#0d0d18',
  border: '#1c1c28',
  border2: '#161624',
  text: '#f0f0f0',
  textSub: '#888888',
  muted: '#555555',
  accent: '#ff8c00',
  accentRed: '#ff3d3d',
  green: '#4ade80',
  blue: '#60a5fa',
  amber: '#f59e0b',
  red: '#ef4444',
  purple: '#a78bfa',
};

export const levelColors = {
  '입문': Colors.green,
  '아마추어': Colors.blue,
  '중급': Colors.amber,
  '고급': Colors.red,
};

// ── 내 프로필 ─────────────────────────────────────────
export const ME = {
  id: 1,
  name: '김태양',
  gym: '파이터스 랩 강남',
  weight: '67kg',
  level: '아마추어',
  age: 26,
  record: '8-3',
  style: '스트라이커',
  tags: ['공격적', '빠른발'],
  avatar: '🥊',
  isGymOwner: true,
  ownedGymId: 1,
};

// ── 파이터 목록 ───────────────────────────────────────
export const FIGHTERS = [
  { ...ME },
  { id: 2, name: '박지수', gym: '무에타이 방콕짐', weight: '63kg', level: '입문', age: 23, record: '2-1', style: '테크니컬', tags: ['카운터', '수비형'], avatar: '🦵' },
  { id: 3, name: '이도준', gym: '파이터스 랩 강남', weight: '72kg', level: '중급', age: 29, record: '15-6', style: '파이터', tags: ['파워', '클린치'], avatar: '🥊' },
  { id: 4, name: '최민혁', gym: 'K1 파이팅 클럽', weight: '60kg', level: '아마추어', age: 21, record: '5-2', style: '아웃복서', tags: ['빠른발', '리치'], avatar: '⚡' },
  { id: 5, name: '윤서연', gym: '파이터스 랩 강남', weight: '57kg', level: '입문', age: 24, record: '1-0', style: '테크니컬', tags: ['킥중심'], avatar: '🦵' },
  { id: 6, name: '장현우', gym: '무에타이 방콕짐', weight: '75kg', level: '중급', age: 31, record: '20-8', style: '무에타이', tags: ['엘보우', '무릎'], avatar: '🏆' },
  { id: 7, name: '한수민', gym: '파이터스 랩 강남', weight: '58kg', level: '입문', age: 22, record: '0-0', style: '밸런스', tags: ['입문'], avatar: '🌟' },
  { id: 8, name: '오재원', gym: '파이터스 랩 강남', weight: '80kg', level: '중급', age: 33, record: '12-4', style: '파이터', tags: ['헤비펀치'], avatar: '💥' },
];

// ── 체육관 목록 ───────────────────────────────────────
export const INIT_GYMS = [
  { id: 1, name: '파이터스 랩 강남', location: '강남구 테헤란로 128', distance: '0.8km', verified: true, members: 42, sports: ['킥복싱', '무에타이'], rating: 4.8, reviews: 36, open: '평일 06:00~23:00 / 주말 08:00~20:00', phone: '02-555-1234', intro: '강남 최대 규모 킥복싱 전문 짐. 프로 트레이너 4명 상주. 매달 오픈 스파링 이벤트 진행.' },
  { id: 2, name: '무에타이 방콕짐', location: '마포구 홍대입구역 3번출구', distance: '2.1km', verified: true, members: 28, sports: ['무에타이'], rating: 4.6, reviews: 22, open: '평일 07:00~22:00 / 주말 09:00~18:00', phone: '02-333-5678', intro: '태국 정통 무에타이 전문. 방콕 훈련 경험 트레이너 직접 지도.' },
  { id: 3, name: 'K1 파이팅 클럽', location: '송파구 잠실동 121', distance: '3.4km', verified: false, members: 19, sports: ['킥복싱'], rating: 4.2, reviews: 11, open: '평일 14:00~22:00 / 주말 10:00~18:00', phone: '02-777-9012', intro: 'K1 룰 특화 훈련. 아마추어 대회 출전 준비 프로그램 운영.' },
  { id: 4, name: '원더보이 짐', location: '용산구 이태원로 55', distance: '4.0km', verified: true, members: 35, sports: ['킥복싱', '무에타이', 'MMA'], rating: 4.7, reviews: 29, open: '매일 06:00~23:00', phone: '02-111-3456', intro: '종합격투기 전문. 킥복싱·무에타이·MMA 통합 커리큘럼.' },
];

// ── 이벤트 목록 ───────────────────────────────────────
export const INIT_EVENTS = [
  {
    id: 1, title: '주말 오픈 스파링 데이', gymId: 1, gym: '파이터스 랩 강남',
    date: '2026.03.28 (토)', time: '14:00', slots: 12, weightClass: '60-70kg', level: '전체',
    desc: '편하게 오세요! 안전 장비 필수. 보호대 없으시면 짐에서 대여 가능합니다.',
    participants: [1, 3, 5],
    comments: [
      { id: 1, userId: 3, text: '헤드기어 필수인가요?', time: '2일 전' },
      { id: 2, userId: 1, text: '네, 헤드기어랑 마우스피스는 꼭 가져오세요!', time: '1일 전' },
    ],
  },
  {
    id: 2, title: '무에타이 기술 스파링', gymId: 2, gym: '무에타이 방콕짐',
    date: '2026.03.29 (일)', time: '11:00', slots: 8, weightClass: '전체', level: '입문~아마추어',
    desc: '기술 위주 가볍게 진행합니다. 강도 세게 하지 않으니 입문자도 환영!',
    participants: [2, 5, 6],
    comments: [
      { id: 1, userId: 2, text: '입문인데 참가해도 될까요?', time: '3일 전' },
      { id: 2, userId: 6, text: '물론이죠! 가볍게 기술 연습하는 자리예요 😊', time: '3일 전' },
    ],
  },
  {
    id: 3, title: 'K1 룰 스파링 세션', gymId: 3, gym: 'K1 파이팅 클럽',
    date: '2026.04.01 (수)', time: '19:00', slots: 6, weightClass: '65kg+', level: '중급+',
    desc: 'K1 룰 기준으로 진행. 어느 정도 실력 있으신 분들 환영합니다.',
    participants: [4],
    comments: [],
  },
];

export const getF = (id) => FIGHTERS.find(f => f.id === id);
