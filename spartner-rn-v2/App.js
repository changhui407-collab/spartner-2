import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Modal, Pressable, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// ── 색상 ──────────────────────────────────────────────
const C = {
  bg: '#09090f', surface: '#111118', surface2: '#0d0d18',
  border: '#1c1c28', text: '#f0f0f0', muted: '#555',
  sub: '#888', accent: '#ff8c00', red: '#ff3d3d',
  green: '#4ade80', blue: '#60a5fa', amber: '#f59e0b',
  purple: '#a78bfa',
};
const LC = { '입문': '#4ade80', '아마추어': '#60a5fa', '중급': '#f59e0b', '고급': '#ef4444' };

// ── 데이터 ────────────────────────────────────────────
const ME = {
  id: 1, name: '김태양', gym: '파이터스 랩 강남', weight: '67kg',
  level: '아마추어', age: 26, record: '8-3', style: '스트라이커',
  tags: ['공격적', '빠른발'], avatar: '🥊', isGymOwner: true, ownedGymId: 1,
};
const FIGHTERS = [
  { ...ME },
  { id: 2, name: '박지수', gym: '무에타이 방콕짐', weight: '63kg', level: '입문', age: 23, record: '2-1', style: '테크니컬', tags: ['카운터', '수비형'], avatar: '🦵' },
  { id: 3, name: '이도준', gym: '파이터스 랩 강남', weight: '72kg', level: '중급', age: 29, record: '15-6', style: '파이터', tags: ['파워', '클린치'], avatar: '🥊' },
  { id: 4, name: '최민혁', gym: 'K1 파이팅 클럽', weight: '60kg', level: '아마추어', age: 21, record: '5-2', style: '아웃복서', tags: ['빠른발', '리치'], avatar: '⚡' },
  { id: 5, name: '윤서연', gym: '파이터스 랩 강남', weight: '57kg', level: '입문', age: 24, record: '1-0', style: '테크니컬', tags: ['킥중심'], avatar: '🦵' },
  { id: 6, name: '장현우', gym: '무에타이 방콕짐', weight: '75kg', level: '중급', age: 31, record: '20-8', style: '무에타이', tags: ['엘보우', '무릎'], avatar: '🏆' },
  { id: 7, name: '한수민', gym: '파이터스 랩 강남', weight: '58kg', level: '입문', age: 22, record: '0-0', style: '밸런스', tags: ['입문'], avatar: '🌟' },
  { id: 8, name: '오재원', gym: '파이터스 랩 강남', weight: '80kg', level: '중급', age: 33, record: '12-4', style: '파이터', tags: ['헤비펀치'], avatar: '💥' },
];
const GYMS = [
  { id: 1, name: '파이터스 랩 강남', location: '강남구 테헤란로 128', distance: '0.8km', verified: true, members: 42, sports: ['킥복싱', '무에타이'], rating: 4.8, reviews: 36, open: '평일 06:00~23:00 / 주말 08:00~20:00', phone: '02-555-1234', intro: '강남 최대 규모 킥복싱 전문 짐. 프로 트레이너 4명 상주. 매달 오픈 스파링 이벤트 진행.' },
  { id: 2, name: '무에타이 방콕짐', location: '마포구 홍대입구역 3번출구', distance: '2.1km', verified: true, members: 28, sports: ['무에타이'], rating: 4.6, reviews: 22, open: '평일 07:00~22:00 / 주말 09:00~18:00', phone: '02-333-5678', intro: '태국 정통 무에타이 전문. 방콕 훈련 경험 트레이너 직접 지도.' },
  { id: 3, name: 'K1 파이팅 클럽', location: '송파구 잠실동 121', distance: '3.4km', verified: false, members: 19, sports: ['킥복싱'], rating: 4.2, reviews: 11, open: '평일 14:00~22:00 / 주말 10:00~18:00', phone: '02-777-9012', intro: 'K1 룰 특화 훈련. 아마추어 대회 출전 준비 프로그램 운영.' },
  { id: 4, name: '원더보이 짐', location: '용산구 이태원로 55', distance: '4.0km', verified: true, members: 35, sports: ['킥복싱', '무에타이', 'MMA'], rating: 4.7, reviews: 29, open: '매일 06:00~23:00', phone: '02-111-3456', intro: '종합격투기 전문. 킥복싱·무에타이·MMA 통합 커리큘럼.' },
];
const INIT_EVENTS = [
  { id: 1, title: '주말 오픈 스파링 데이', gymId: 1, gym: '파이터스 랩 강남', date: '2026.03.28 (토)', time: '14:00', slots: 12, weightClass: '60-70kg', level: '전체', desc: '편하게 오세요! 안전 장비 필수. 보호대 없으시면 짐에서 대여 가능합니다.', participants: [1, 3, 5], comments: [{ id: 1, userId: 3, text: '헤드기어 필수인가요?', time: '2일 전' }, { id: 2, userId: 1, text: '네, 헤드기어랑 마우스피스는 꼭 가져오세요!', time: '1일 전' }] },
  { id: 2, title: '무에타이 기술 스파링', gymId: 2, gym: '무에타이 방콕짐', date: '2026.03.29 (일)', time: '11:00', slots: 8, weightClass: '전체', level: '입문~아마추어', desc: '기술 위주 가볍게 진행합니다. 강도 세게 하지 않으니 입문자도 환영!', participants: [2, 5, 6], comments: [{ id: 1, userId: 2, text: '입문인데 참가해도 될까요?', time: '3일 전' }, { id: 2, userId: 6, text: '물론이죠! 가볍게 기술 연습하는 자리예요 😊', time: '3일 전' }] },
  { id: 3, title: 'K1 룰 스파링 세션', gymId: 3, gym: 'K1 파이팅 클럽', date: '2026.04.01 (수)', time: '19:00', slots: 6, weightClass: '65kg+', level: '중급+', desc: 'K1 룰 기준으로 진행. 어느 정도 실력 있으신 분들 환영합니다.', participants: [4], comments: [] },
];

const gf = (id) => FIGHTERS.find(f => f.id === id);

// ── 공통 컴포넌트 ─────────────────────────────────────
const Pill = ({ label, color, bg }) => (
  <View style={{ paddingHorizontal: 9, paddingVertical: 2, borderRadius: 20, backgroundColor: bg || color + '22', borderWidth: 1, borderColor: color + '44' }}>
    <Text style={{ fontSize: 10, fontWeight: '700', color }}>{label}</Text>
  </View>
);

const Tag = ({ label }) => (
  <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.04)' }}>
    <Text style={{ fontSize: 10, color: '#555' }}>#{label}</Text>
  </View>
);

const Av = ({ emoji, size = 44, bg = '#1a1a2e', bc = '#2a2a3e' }) => (
  <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, borderWidth: 2, borderColor: bc, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontSize: size * 0.46 }}>{emoji}</Text>
  </View>
);

const Bar = ({ pct, warn }) => (
  <View style={{ height: 3, backgroundColor: '#1c1c28', borderRadius: 2, overflow: 'hidden' }}>
    <View style={{ height: '100%', width: `${Math.min(pct, 100)}%`, backgroundColor: warn ? '#ef4444' : C.accent, borderRadius: 2 }} />
  </View>
);

const GradBtn = ({ label, onPress, style: sx }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.85}
    style={[{ backgroundColor: '#ff5500', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }, sx]}>
    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>{label}</Text>
  </TouchableOpacity>
);

const Sheet = ({ visible, onClose, children }) => {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' }} onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Pressable onPress={e => e.stopPropagation()}>
            <View style={{ backgroundColor: '#13131f', borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth: 1, borderColor: C.border, paddingBottom: insets.bottom + 16 }}>
              <View style={{ width: 36, height: 4, backgroundColor: '#2a2a3e', borderRadius: 2, alignSelf: 'center', marginVertical: 12 }} />
              {children}
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

// ── 이벤트 탭 ─────────────────────────────────────────
function EventsTab({ events, setEvents }) {
  const [sel, setSel] = useState(null);
  const [txt, setTxt] = useState('');
  const joined = sel ? sel.participants.includes(ME.id) : false;

  const toggle = (id) => {
    const u = ev => ev.id !== id ? ev : { ...ev, participants: ev.participants.includes(ME.id) ? ev.participants.filter(p => p !== ME.id) : [...ev.participants, ME.id] };
    setEvents(p => p.map(u)); setSel(p => p ? u(p) : null);
  };
  const comment = (id) => {
    if (!txt.trim()) return;
    const nc = { id: Date.now(), userId: ME.id, text: txt.trim(), time: '방금' };
    const u = ev => ev.id === id ? { ...ev, comments: [...ev.comments, nc] } : ev;
    setEvents(p => p.map(u)); setSel(p => p ? u(p) : null); setTxt('');
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={s.scroll} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <GradBtn label="＋ 스파링 이벤트 개설하기" style={{ marginBottom: 18 }} />
        {events.map(ev => {
          const j = ev.participants.includes(ME.id);
          const fill = Math.round((ev.participants.length / ev.slots) * 100);
          return (
            <TouchableOpacity key={ev.id} activeOpacity={0.85} onPress={() => setSel(ev)}
              style={[s.card, j && { borderColor: '#ff3d3d33' }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={s.cardTitle}>{ev.title}</Text>
                  <Text style={s.cardSub}>{ev.gym}</Text>
                </View>
                {j && <Pill label="참가중" color={C.accent} bg="#ff3d3d12" />}
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                {[['📅', ev.date], ['⏰', ev.time], ['⚖️', ev.weightClass], ['🥋', ev.level]].map(([i, v]) => (
                  <Text key={i} style={{ fontSize: 11, color: '#666' }}>{i} {v}</Text>
                ))}
              </View>
              <View style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text style={{ fontSize: 11, color: C.muted }}>참가자</Text>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: C.text }}>{ev.participants.length}/{ev.slots}명</Text>
                </View>
                <Bar pct={fill} warn={fill >= 80} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row' }}>
                  {ev.participants.slice(0, 5).map((pid, i) => (
                    <View key={pid} style={{ width: 24, height: 24, backgroundColor: '#1a1a2e', borderRadius: 12, borderWidth: 2, borderColor: C.bg, marginLeft: i > 0 ? -7 : 0, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 11 }}>{gf(pid)?.avatar}</Text>
                    </View>
                  ))}
                </View>
                <Text style={{ fontSize: 11, color: C.muted }}>{ev.comments.length > 0 ? `💬 ${ev.comments.length}` : ''} ›</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Sheet visible={!!sel} onClose={() => setSel(null)}>
        {sel && (
          <>
            <ScrollView style={{ maxHeight: 520 }} showsVerticalScrollIndicator={false}>
              <View style={{ padding: 18 }}>
                <Text style={s.sheetTitle}>{sel.title}</Text>
                <Text style={{ color: C.muted, fontSize: 12, marginBottom: 12 }}>{sel.gym}</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                  {[['📅', sel.date], ['⏰', sel.time], ['⚖️', sel.weightClass], ['🥋', sel.level]].map(([i, v]) => (
                    <View key={i} style={{ backgroundColor: '#1a1a2e', borderRadius: 20, paddingHorizontal: 9, paddingVertical: 4 }}>
                      <Text style={{ fontSize: 11, color: '#777' }}>{i} {v}</Text>
                    </View>
                  ))}
                </View>
                <Text style={{ color: C.sub, fontSize: 13, lineHeight: 21, marginBottom: 16 }}>{sel.desc}</Text>
                <Text style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>참가자 {sel.participants.length}/{sel.slots}명</Text>
                <Bar pct={Math.round((sel.participants.length / sel.slots) * 100)} />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10, marginBottom: 14 }}>
                  {sel.participants.map(pid => {
                    const f = gf(pid); const mine = pid === ME.id;
                    return (
                      <View key={pid} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: mine ? '#ff3d3d12' : '#1a1a2e', borderWidth: 1, borderColor: mine ? '#ff3d3d2a' : '#2a2a3e', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
                        <Text style={{ fontSize: 13 }}>{f?.avatar}</Text>
                        <Text style={{ fontSize: 12, color: mine ? C.accent : '#bbb', fontWeight: mine ? '700' : '400' }}>{f?.name}{mine ? ' (나)' : ''}</Text>
                      </View>
                    );
                  })}
                </View>
                <TouchableOpacity onPress={() => toggle(sel.id)} activeOpacity={0.85}
                  style={{ borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 16, backgroundColor: joined ? '#1c1c28' : '#ff5500', borderWidth: joined ? 1 : 0, borderColor: '#2a2a3e' }}>
                  <Text style={{ fontWeight: '700', fontSize: 14, color: joined ? '#666' : '#fff' }}>{joined ? '참가 취소' : '⚡ 참가 신청'}</Text>
                </TouchableOpacity>
                <View style={{ height: 1, backgroundColor: C.border, marginHorizontal: -18, marginBottom: 16 }} />
                <Text style={{ fontSize: 12, color: C.muted, fontWeight: '600', marginBottom: 12 }}>
                  💬 댓글 {sel.comments.length}{!joined ? <Text style={{ color: '#333', fontWeight: '400' }}> — 참가자만 작성 가능</Text> : ''}
                </Text>
                {sel.comments.length === 0 && <Text style={{ textAlign: 'center', color: '#2a2a3e', paddingVertical: 16 }}>첫 댓글을 남겨보세요</Text>}
                {sel.comments.map(c => {
                  const f = gf(c.userId); const mine = c.userId === ME.id;
                  return (
                    <View key={c.id} style={{ flexDirection: 'row', gap: 9, marginBottom: 14 }}>
                      <View style={{ width: 30, height: 30, backgroundColor: '#1a1a2e', borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: mine ? '#ff3d3d33' : C.border }}>
                        <Text style={{ fontSize: 14 }}>{f?.avatar}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 4 }}>
                          <Text style={{ fontSize: 12, fontWeight: '700', color: mine ? C.accent : '#ccc' }}>{f?.name}{mine ? ' (나)' : ''}</Text>
                          <Text style={{ fontSize: 10, color: '#333' }}>{c.time}</Text>
                        </View>
                        <View style={{ backgroundColor: '#0d0d18', padding: 10, borderRadius: 2, borderTopRightRadius: 12, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, borderWidth: 1, borderColor: '#161624' }}>
                          <Text style={{ fontSize: 13, color: '#bbb', lineHeight: 20 }}>{c.text}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
            <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
              {joined ? (
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-end' }}>
                  <View style={{ width: 30, height: 30, backgroundColor: '#2a1010', borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#ff3d3d22' }}>
                    <Text style={{ fontSize: 14 }}>🥊</Text>
                  </View>
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', backgroundColor: '#0d0d18', borderRadius: 12, borderWidth: 1, borderColor: C.border, paddingHorizontal: 12, paddingVertical: 8, gap: 8 }}>
                    <TextInput value={txt} onChangeText={setTxt} placeholder="댓글 입력..." placeholderTextColor="#333"
                      style={{ flex: 1, color: C.text, fontSize: 13 }} multiline />
                    <TouchableOpacity onPress={() => comment(sel.id)}
                      style={{ backgroundColor: txt.trim() ? '#ff5500' : '#1c1c28', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 }}>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: txt.trim() ? '#fff' : '#444' }}>전송</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : <Text style={{ textAlign: 'center', color: '#333', fontSize: 12, paddingVertical: 8 }}>참가 신청 후 댓글을 남길 수 있습니다</Text>}
            </View>
          </>
        )}
      </Sheet>
    </View>
  );
}

// ── 매칭 탭 ──────────────────────────────────────────
function MatchTab() {
  const [fw, setFw] = useState('전체');
  const [fl, setFl] = useState('전체');
  const fighters = FIGHTERS.filter(f => {
    if (f.id === ME.id) return false;
    const wt = parseFloat(f.weight);
    const wm = fw === '전체' || (fw === '~60kg' && wt <= 60) || (fw === '60~70kg' && wt > 60 && wt <= 70) || (fw === '70~80kg' && wt > 70);
    return wm && (fl === '전체' || f.level === fl);
  });
  return (
    <ScrollView style={s.scroll} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
      <View style={{ backgroundColor: '#130c0c', borderRadius: 16, padding: 14, marginBottom: 18, borderWidth: 1, borderColor: '#ff3d3d1a' }}>
        <Text style={{ fontSize: 9, color: C.red, fontWeight: '700', letterSpacing: 1.5, marginBottom: 9 }}>내 프로필</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Av emoji={ME.avatar} size={50} bg="#2a1010" bc="#ff3d3d33" />
          <View style={{ flex: 1 }}>
            <Text style={{ color: C.text, fontWeight: '700', fontSize: 16 }}>{ME.name}</Text>
            <Text style={{ color: C.muted, fontSize: 12, marginTop: 1 }}>{ME.gym} · {ME.weight}</Text>
            <View style={{ flexDirection: 'row', gap: 5, marginTop: 7 }}>
              <Pill label={ME.level} color={LC[ME.level]} />
              <Pill label={ME.record} color="#777" bg="#ffffff08" />
            </View>
          </View>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }} contentContainerStyle={{ gap: 6, paddingRight: 15 }}>
        {['전체', '~60kg', '60~70kg', '70~80kg'].map(o => (
          <TouchableOpacity key={o} onPress={() => setFw(o)} style={{ paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: fw === o ? C.red : '#2a2a3e', backgroundColor: fw === o ? '#ff3d3d1a' : 'transparent' }}>
            <Text style={{ fontSize: 12, color: fw === o ? C.red : C.muted }}>{o}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }} contentContainerStyle={{ gap: 6, paddingRight: 15 }}>
        {['전체', '입문', '아마추어', '중급'].map(o => {
          const ac = LC[o] || C.red;
          return (
            <TouchableOpacity key={o} onPress={() => setFl(o)} style={{ paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: fl === o ? ac : '#2a2a3e', backgroundColor: fl === o ? ac + '1a' : 'transparent' }}>
              <Text style={{ fontSize: 12, color: fl === o ? ac : C.muted }}>{o}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <Text style={{ fontSize: 11, color: '#444', marginBottom: 10 }}>근처 파이터 {fighters.length}명</Text>
      {fighters.map(f => (
        <TouchableOpacity key={f.id} activeOpacity={0.85} style={[s.card, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
          <Av emoji={f.avatar} size={46} />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: C.text, fontWeight: '700', fontSize: 14 }}>{f.name}</Text>
              <Text style={{ color: '#ccc', fontWeight: '700', fontSize: 13 }}>{f.weight}</Text>
            </View>
            <Text style={{ color: C.muted, fontSize: 11, marginTop: 1 }}>{f.gym} · {f.record}</Text>
            <View style={{ flexDirection: 'row', gap: 5, marginTop: 7, flexWrap: 'wrap' }}>
              <Pill label={f.level} color={LC[f.level]} />
              {f.tags.map(t => <Tag key={t} label={t} />)}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// ── 체육관 탭 ─────────────────────────────────────────
function GymsTab({ events }) {
  const insets = useSafeAreaInsets();
  const [sel, setSel] = useState(null);
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={s.scroll} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 16 }}>
          <Text style={{ color: '#333', fontSize: 16 }}>🔍</Text>
          <Text style={{ color: '#2a2a3e', fontSize: 13 }}>체육관 검색...</Text>
        </View>
        {GYMS.map(gym => (
          <TouchableOpacity key={gym.id} activeOpacity={0.85} onPress={() => setSel(gym)}
            style={[s.card, gym.id === ME.ownedGymId && { borderColor: '#ff3d3d33' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
              <View style={{ width: 50, height: 50, backgroundColor: '#1a1a2e', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 24 }}>🏟</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                  <Text style={{ color: C.text, fontWeight: '700', fontSize: 14 }}>{gym.name}</Text>
                  {gym.verified && <Text style={{ fontSize: 12 }}>✅</Text>}
                  {gym.id === ME.ownedGymId && <Pill label="내 짐" color={C.accent} bg="#ff3d3d12" />}
                </View>
                <Text style={{ color: C.muted, fontSize: 11, marginBottom: 8 }}>{gym.location} · {gym.distance}</Text>
                <View style={{ flexDirection: 'row', gap: 5, flexWrap: 'wrap', marginBottom: 8 }}>
                  {gym.sports.map(s2 => <View key={s2} style={{ backgroundColor: '#1a1a2e', borderWidth: 1, borderColor: C.border, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 }}><Text style={{ fontSize: 10, color: '#888' }}>{s2}</Text></View>)}
                </View>
                <Text style={{ fontSize: 11, color: C.sub }}>⭐ {gym.rating} ({gym.reviews})  👥 {gym.members}명</Text>
              </View>
              <Text style={{ fontSize: 14, color: '#333', marginTop: 4 }}>›</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ marginTop: 14, backgroundColor: '#0a0a18', borderWidth: 1, borderColor: '#2a2a4e', borderStyle: 'dashed', borderRadius: 14, padding: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 22, marginBottom: 8 }}>🏋️</Text>
          <Text style={{ color: C.text, fontWeight: '700', fontSize: 14, marginBottom: 6 }}>내 체육관을 등록하세요</Text>
          <Text style={{ color: C.muted, fontSize: 12, marginBottom: 14, textAlign: 'center' }}>회원들과 오픈 스파링 이벤트를 쉽게 열어보세요</Text>
          <GradBtn label="체육관 등록하기" style={{ paddingHorizontal: 24, width: 'auto' }} />
        </View>
      </ScrollView>

      <Sheet visible={!!sel} onClose={() => setSel(null)}>
        {sel && (
          <ScrollView style={{ maxHeight: 580 }} showsVerticalScrollIndicator={false}>
            <View style={{ padding: 18 }}>
              <View style={{ flexDirection: 'row', gap: 14, marginBottom: 16 }}>
                <View style={{ width: 56, height: 56, backgroundColor: '#1a1a2e', borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border }}>
                  <Text style={{ fontSize: 28 }}>🏟</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <Text style={{ color: C.text, fontWeight: '800', fontSize: 18 }}>{sel.name}</Text>
                    {sel.verified && <Text>✅</Text>}
                  </View>
                  <Text style={{ color: '#666', fontSize: 12 }}>{sel.location}</Text>
                  <Text style={{ fontSize: 12, color: C.sub, marginTop: 4 }}>⭐ {sel.rating}  ({sel.reviews}개 리뷰)  👥 {sel.members}명</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 6, marginBottom: 14 }}>
                {sel.sports.map(sp => <Pill key={sp} label={sp} color={C.accent} bg="#ff3d3d12" />)}
              </View>
              <View style={{ backgroundColor: '#0d0d18', borderRadius: 12, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#161624' }}>
                <Text style={{ color: '#bbb', fontSize: 13, lineHeight: 21 }}>{sel.intro}</Text>
              </View>
              {[['⏰', '운영시간', sel.open], ['📞', '전화번호', sel.phone], ['📍', '주소', sel.location]].map(([ic, label, val]) => (
                <View key={label} style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
                  <Text style={{ fontSize: 14 }}>{ic}</Text>
                  <View><Text style={{ fontSize: 11, color: C.muted, marginBottom: 2 }}>{label}</Text><Text style={{ fontSize: 13, color: '#ccc' }}>{val}</Text></View>
                </View>
              ))}
              <View style={{ height: 1, backgroundColor: C.border, marginBottom: 14 }} />
              <Text style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>예정 이벤트</Text>
              {events.filter(ev => ev.gymId === sel.id).length === 0
                ? <Text style={{ textAlign: 'center', color: '#2a2a3e', paddingVertical: 12 }}>예정된 이벤트가 없습니다</Text>
                : events.filter(ev => ev.gymId === sel.id).map(ev => (
                  <View key={ev.id} style={{ backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View><Text style={{ color: C.text, fontWeight: '600', fontSize: 13, marginBottom: 3 }}>{ev.title}</Text><Text style={{ color: C.muted, fontSize: 11 }}>{ev.date} · {ev.time}</Text></View>
                    <Text style={{ fontSize: 11, color: C.sub }}>{ev.participants.length}/{ev.slots}명 ›</Text>
                  </View>
                ))}
              <GradBtn label="초대 요청 보내기" style={{ marginTop: 8 }} />
            </View>
          </ScrollView>
        )}
      </Sheet>
    </View>
  );
}

// ── 관리자 화면 ────────────────────────────────────────
function AdminScreen({ events, setEvents, onBack }) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('overview');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', time: '', slots: '10', weightClass: '전체', level: '전체', desc: '' });
  const myGym = GYMS.find(g => g.id === ME.ownedGymId);
  const myEvents = events.filter(e => e.gymId === ME.ownedGymId);
  const myMembers = FIGHTERS.filter(f => f.gym === ME.gym);
  const totalPax = myEvents.reduce((a, e) => a + e.participants.length, 0);
  const totalCmt = myEvents.reduce((a, e) => a + e.comments.length, 0);

  const create = () => {
    if (!form.title || !form.date || !form.time) return;
    setEvents(p => [...p, { id: Date.now(), title: form.title, gymId: ME.ownedGymId, gym: myGym.name, date: form.date, time: form.time, slots: parseInt(form.slots) || 10, weightClass: form.weightClass, level: form.level, desc: form.desc, participants: [], comments: [] }]);
    setShowForm(false);
    setForm({ title: '', date: '', time: '', slots: '10', weightClass: '전체', level: '전체', desc: '' });
  };

  return (
    <View style={[{ flex: 1, backgroundColor: C.bg }, { paddingTop: insets.top }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, paddingVertical: 12, backgroundColor: '#160808', borderBottomWidth: 1, borderBottomColor: C.border }}>
        <TouchableOpacity onPress={onBack} style={{ width: 34, height: 34, backgroundColor: '#1a1a2e', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#888', fontSize: 20 }}>‹</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: C.accent }}>관리자 대시보드</Text>
          <Text style={{ fontSize: 10, color: C.muted }}>{myGym?.name}</Text>
        </View>
        <View style={{ width: 8, height: 8, backgroundColor: C.green, borderRadius: 4 }} />
      </View>
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: C.border }}>
        {[{ k: 'overview', l: '개요' }, { k: 'events', l: '이벤트' }, { k: 'members', l: '회원' }].map(t => (
          <TouchableOpacity key={t.k} onPress={() => setTab(t.k)} style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: tab === t.k ? C.red : 'transparent' }}>
            <Text style={{ fontSize: 13, color: tab === t.k ? C.red : '#444', fontWeight: tab === t.k ? '700' : '400' }}>{t.l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {tab === 'overview' && (
          <View>
            <View style={{ backgroundColor: '#130808', borderRadius: 16, padding: 16, marginBottom: 18, borderWidth: 1, borderColor: '#ff3d3d22' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <View><Text style={{ color: C.text, fontWeight: '800', fontSize: 17 }}>{myGym?.name}</Text><Text style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{myGym?.location}</Text></View>
                <Pill label="운영중" color={C.green} bg="#4ade8022" />
              </View>
              <View style={{ flexDirection: 'row', gap: 6 }}>{myGym?.sports.map(sp => <Pill key={sp} label={sp} color={C.accent} bg="#ff3d3d12" />)}</View>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
              {[['👥', '총 회원', myMembers.length, '명', C.blue], ['📅', '진행 이벤트', myEvents.length, '개', C.accent], ['⚡', '누적 참가자', totalPax, '명', C.green], ['💬', '전체 댓글', totalCmt, '개', C.purple]].map(([ic, label, val, unit, color]) => (
                <View key={label} style={{ backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 14, padding: 14, width: '47%' }}>
                  <Text style={{ fontSize: 20, marginBottom: 8 }}>{ic}</Text>
                  <Text style={{ fontSize: 26, fontWeight: '800', color, lineHeight: 30 }}>{val}<Text style={{ fontSize: 12, fontWeight: '400', color: C.muted }}>{unit}</Text></Text>
                  <Text style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{label}</Text>
                </View>
              ))}
            </View>
            <GradBtn label="＋ 새 이벤트 개설하기" onPress={() => { setTab('events'); setShowForm(true); }} />
          </View>
        )}

        {tab === 'events' && (
          <View>
            <GradBtn label="＋ 새 이벤트 개설하기" onPress={() => setShowForm(true)} style={{ marginBottom: 18 }} />
            {myEvents.map(ev => {
              const fill = Math.round((ev.participants.length / ev.slots) * 100);
              return (
                <View key={ev.id} style={[s.card, { marginBottom: 12 }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <View style={{ flex: 1 }}><Text style={s.cardTitle}>{ev.title}</Text><Text style={{ fontSize: 11, color: C.muted }}>{ev.date} · {ev.time}</Text></View>
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      <TouchableOpacity style={{ backgroundColor: '#1a1a2e', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}><Text style={{ fontSize: 11, color: '#888' }}>수정</Text></TouchableOpacity>
                      <TouchableOpacity style={{ backgroundColor: '#2a1010', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}><Text style={{ fontSize: 11, color: '#ef4444' }}>삭제</Text></TouchableOpacity>
                    </View>
                  </View>
                  <View style={{ backgroundColor: '#0d0d18', borderRadius: 10, padding: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                      <Text style={{ fontSize: 11, color: C.muted }}>참가자 현황</Text>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: fill >= 80 ? '#ef4444' : C.accent }}>{ev.participants.length}/{ev.slots}명</Text>
                    </View>
                    <Bar pct={fill} warn={fill >= 80} />
                    {ev.participants.map(pid => {
                      const f = gf(pid);
                      return (
                        <View key={pid} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 }}>
                          <Av emoji={f?.avatar} size={28} />
                          <View style={{ flex: 1 }}><Text style={{ fontSize: 12, fontWeight: '600', color: C.text }}>{f?.name}</Text><Text style={{ fontSize: 10, color: C.muted }}>{f?.gym} · {f?.weight}</Text></View>
                          <Pill label={f?.level} color={LC[f?.level]} />
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {tab === 'members' && (
          <View>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 18 }}>
              {[['전체 회원', myMembers.length, C.blue], ['이번달 활동', Math.floor(myMembers.length * 0.7), C.green], ['평균 평점', '4.8', C.accent]].map(([label, val, color]) => (
                <View key={label} style={{ flex: 1, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 12, alignItems: 'center' }}>
                  <Text style={{ fontSize: 22, fontWeight: '800', color }}>{val}</Text>
                  <Text style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>{label}</Text>
                </View>
              ))}
            </View>
            {myMembers.map(f => (
              <View key={f.id} style={[s.card, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
                <Av emoji={f.avatar} size={44} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: C.text, fontWeight: '700', fontSize: 14 }}>{f.name}</Text>
                    <Text style={{ fontSize: 12, color: C.sub }}>{f.weight}</Text>
                  </View>
                  <Text style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>만 {f.age}세 · {f.record}</Text>
                  <View style={{ flexDirection: 'row', gap: 5, marginTop: 6 }}>
                    <Pill label={f.level} color={LC[f.level]} />
                    <View style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 }}><Text style={{ fontSize: 10, color: C.muted }}>{f.style}</Text></View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Sheet visible={showForm} onClose={() => setShowForm(false)}>
        <ScrollView style={{ maxHeight: 560 }} showsVerticalScrollIndicator={false}>
          <View style={{ padding: 18 }}>
            <Text style={{ color: C.text, fontWeight: '800', fontSize: 17, marginBottom: 18 }}>새 스파링 이벤트</Text>
            {[['이벤트 제목 *', 'title', '예) 5월 오픈 스파링 데이'], ['날짜 *', 'date', '예) 2026.05.03 (일)'], ['시간 *', 'time', '예) 14:00'], ['최대 인원', 'slots', '10']].map(([label, key, ph]) => (
              <View key={key} style={{ marginBottom: 14 }}>
                <Text style={{ fontSize: 11, color: '#666', fontWeight: '600', marginBottom: 6 }}>{label}</Text>
                <TextInput value={form[key]} onChangeText={v => setForm(p => ({ ...p, [key]: v }))} placeholder={ph} placeholderTextColor="#2a2a3e"
                  style={{ backgroundColor: '#0d0d18', borderWidth: 1, borderColor: C.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: C.text, fontSize: 13 }} />
              </View>
            ))}
            <View style={{ marginBottom: 14 }}>
              <Text style={{ fontSize: 11, color: '#666', fontWeight: '600', marginBottom: 6 }}>체급</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {['전체', '~60kg', '60~70kg', '70~80kg', '80kg+'].map(o => (
                  <TouchableOpacity key={o} onPress={() => setForm(p => ({ ...p, weightClass: o }))} style={{ paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: form.weightClass === o ? C.red : '#2a2a3e', backgroundColor: form.weightClass === o ? '#ff3d3d1a' : 'transparent' }}>
                    <Text style={{ fontSize: 12, color: form.weightClass === o ? C.red : C.muted }}>{o}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={{ marginBottom: 14 }}>
              <Text style={{ fontSize: 11, color: '#666', fontWeight: '600', marginBottom: 6 }}>레벨</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {['전체', '입문', '아마추어', '중급', '고급'].map(o => {
                  const ac = LC[o] || C.red;
                  return (
                    <TouchableOpacity key={o} onPress={() => setForm(p => ({ ...p, level: o }))} style={{ paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: form.level === o ? ac : '#2a2a3e', backgroundColor: form.level === o ? ac + '1a' : 'transparent' }}>
                      <Text style={{ fontSize: 12, color: form.level === o ? ac : C.muted }}>{o}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 11, color: '#666', fontWeight: '600', marginBottom: 6 }}>이벤트 설명</Text>
              <TextInput value={form.desc} onChangeText={v => setForm(p => ({ ...p, desc: v }))} placeholder="이벤트 안내사항을 입력하세요..." placeholderTextColor="#2a2a3e" multiline numberOfLines={3}
                style={{ backgroundColor: '#0d0d18', borderWidth: 1, borderColor: C.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: C.text, fontSize: 13, minHeight: 80 }} />
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity onPress={() => setShowForm(false)} style={{ flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center', backgroundColor: '#1c1c28', borderWidth: 1, borderColor: '#2a2a3e' }}>
                <Text style={{ color: '#666', fontWeight: '700' }}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={create} style={{ flex: 2, borderRadius: 12, paddingVertical: 14, alignItems: 'center', backgroundColor: (form.title && form.date && form.time) ? '#ff5500' : '#1c1c28' }}>
                <Text style={{ fontWeight: '700', fontSize: 14, color: (form.title && form.date && form.time) ? '#fff' : '#444' }}>이벤트 개설</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Sheet>
    </View>
  );
}

// ── 메인 앱 ──────────────────────────────────────────
function Main() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('events');
  const [admin, setAdmin] = useState(false);
  const [events, setEvents] = useState(INIT_EVENTS);

  if (admin) return <AdminScreen events={events} setEvents={setEvents} onBack={() => setAdmin(false)} />;

  return (
    <View style={[{ flex: 1, backgroundColor: C.bg }, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 12, backgroundColor: '#160808', borderBottomWidth: 1, borderBottomColor: C.border }}>
        <View>
          <Text style={{ fontSize: 24, fontWeight: '900', color: C.accent, letterSpacing: 2, lineHeight: 26 }}>SPARTNER</Text>
          <Text style={{ fontSize: 9, color: '#444', letterSpacing: 1.5, marginTop: 1 }}>OPEN SPARRING NETWORK</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {ME.isGymOwner && (
            <TouchableOpacity onPress={() => setAdmin(true)} style={{ backgroundColor: '#1a1a2e', borderWidth: 1, borderColor: C.border, borderRadius: 10, paddingHorizontal: 11, paddingVertical: 6 }}>
              <Text style={{ fontSize: 11, color: '#888', fontWeight: '600' }}>관리 ›</Text>
            </TouchableOpacity>
          )}
          <View style={{ width: 36, height: 36, backgroundColor: '#2a1010', borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#ff3d3d33' }}>
            <Text style={{ fontSize: 18 }}>{ME.avatar}</Text>
          </View>
        </View>
      </View>

      {/* Tab bar */}
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: C.border }}>
        {[{ k: 'events', l: '이벤트', i: '📅' }, { k: 'match', l: '매칭', i: '⚡' }, { k: 'gyms', l: '체육관', i: '🏟' }].map(t => (
          <TouchableOpacity key={t.k} onPress={() => setTab(t.k)} style={{ flex: 1, paddingVertical: 11, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: tab === t.k ? C.red : 'transparent' }}>
            <Text style={{ fontSize: 13, color: tab === t.k ? C.red : '#444', fontWeight: tab === t.k ? '700' : '400' }}>{t.i} {t.l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View style={{ flex: 1, paddingBottom: insets.bottom }}>
        {tab === 'events' && <EventsTab events={events} setEvents={setEvents} />}
        {tab === 'match'  && <MatchTab />}
        {tab === 'gyms'   && <GymsTab events={events} />}
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Main />
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, paddingHorizontal: 15, paddingTop: 18 },
  card: { backgroundColor: '#111118', borderWidth: 1, borderColor: '#1c1c28', borderRadius: 16, padding: 16, marginBottom: 11 },
  cardTitle: { color: '#f0f0f0', fontWeight: '700', fontSize: 15, marginBottom: 2 },
  cardSub: { color: '#555', fontSize: 12 },
  sheetTitle: { color: '#f0f0f0', fontWeight: '800', fontSize: 17, marginBottom: 3 },
});
