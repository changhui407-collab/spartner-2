import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Modal, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors, ME, FIGHTERS, INIT_GYMS, levelColors, getF } from '../data';
import { Avatar, LevelPill, FillBar, FilterChip, Pill } from '../components/UI';

const myGym = INIT_GYMS.find(g => g.id === ME.ownedGymId);
const myMembers = FIGHTERS.filter(f => f.gym === ME.gym);

export default function AdminScreen({ events, setEvents, onBack }) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('overview');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', time: '', slots: '10', weightClass: '전체', level: '전체', desc: '' });

  const myEvents = events.filter(e => e.gymId === ME.ownedGymId);
  const totalPax = myEvents.reduce((a, e) => a + e.participants.length, 0);
  const totalCmt = myEvents.reduce((a, e) => a + e.comments.length, 0);

  const createEvent = () => {
    if (!form.title || !form.date || !form.time) return;
    const ev = {
      id: Date.now(), title: form.title, gymId: ME.ownedGymId, gym: myGym.name,
      date: form.date, time: form.time, slots: parseInt(form.slots) || 10,
      weightClass: form.weightClass, level: form.level, desc: form.desc,
      participants: [], comments: [],
    };
    setEvents(prev => [...prev, ev]);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowForm(false);
    setForm({ title: '', date: '', time: '', slots: '10', weightClass: '전체', level: '전체', desc: '' });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={{ color: '#888', fontSize: 20 }}>‹</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>관리자 대시보드</Text>
          <Text style={styles.headerSub}>{myGym?.name}</Text>
        </View>
        <View style={styles.onlineDot} />
      </View>

      {/* Sub tabs */}
      <View style={styles.tabRow}>
        {[{ k: 'overview', l: '개요' }, { k: 'events', l: '이벤트' }, { k: 'members', l: '회원' }].map(t => (
          <TouchableOpacity key={t.k} onPress={() => setTab(t.k)} style={[styles.tab, tab === t.k && styles.tabActive]}>
            <Text style={[styles.tabText, tab === t.k && styles.tabTextActive]}>{t.l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <View>
            <View style={styles.gymCard}>
              <LinearGradient colors={['#160808', '#0c0818']} style={StyleSheet.absoluteFill} />
              <View style={styles.gymCardTop}>
                <View>
                  <Text style={styles.gymCardName}>{myGym?.name}</Text>
                  <Text style={styles.gymCardLoc}>{myGym?.location}</Text>
                </View>
                <Pill label="운영중" color="#4ade80" bg="#4ade8022" />
              </View>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {myGym?.sports.map(s => <Pill key={s} label={s} color="#ff8c00" bg="#ff3d3d12" />)}
              </View>
            </View>

            <View style={styles.statsGrid}>
              {[
                ['👥', '총 회원', myMembers.length, '명', Colors.blue],
                ['📅', '진행 이벤트', myEvents.length, '개', Colors.accent],
                ['⚡', '누적 참가자', totalPax, '명', Colors.green],
                ['💬', '전체 댓글', totalCmt, '개', Colors.purple],
              ].map(([ic, label, val, unit, color]) => (
                <View key={label} style={styles.statCard}>
                  <Text style={{ fontSize: 20, marginBottom: 8 }}>{ic}</Text>
                  <Text style={[styles.statVal, { color }]}>{val}<Text style={styles.statUnit}>{unit}</Text></Text>
                  <Text style={styles.statLabel}>{label}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionLabel}>최근 이벤트</Text>
            {myEvents.slice(0, 2).map(ev => (
              <View key={ev.id} style={styles.miniEvent}>
                <View>
                  <Text style={styles.miniEventTitle}>{ev.title}</Text>
                  <Text style={styles.miniEventSub}>{ev.date} · {ev.time}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.miniEventCount, { color: Colors.accent }]}>{ev.participants.length}<Text style={{ color: Colors.muted, fontSize: 10 }}>/{ev.slots}</Text></Text>
                  <Text style={styles.miniEventSub}>참가자</Text>
                </View>
              </View>
            ))}

            <TouchableOpacity activeOpacity={0.85} onPress={() => setTab('events')} style={{ borderRadius: 12, overflow: 'hidden', marginTop: 4 }}>
              <LinearGradient colors={['#ff3d3d', '#ff8c00']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.bigBtn}>
                <Text style={styles.bigBtnText}>＋ 새 이벤트 개설하기</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* EVENTS */}
        {tab === 'events' && (
          <View>
            <TouchableOpacity activeOpacity={0.85} onPress={() => setShowForm(true)} style={{ borderRadius: 14, overflow: 'hidden', marginBottom: 18 }}>
              <LinearGradient colors={['#ff3d3d', '#ff8c00']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.bigBtn}>
                <Text style={styles.bigBtnText}>＋ 새 이벤트 개설하기</Text>
              </LinearGradient>
            </TouchableOpacity>

            {myEvents.length === 0 && <Text style={{ textAlign: 'center', color: '#2a2a3e', paddingTop: 40 }}>등록된 이벤트가 없습니다</Text>}

            {myEvents.map(ev => {
              const fill = Math.round((ev.participants.length / ev.slots) * 100);
              return (
                <View key={ev.id} style={styles.eventCard}>
                  <View style={styles.eventCardTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.eventCardTitle}>{ev.title}</Text>
                      <Text style={styles.eventCardSub}>{ev.date} · {ev.time}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      <TouchableOpacity style={styles.editBtn}><Text style={styles.editBtnText}>수정</Text></TouchableOpacity>
                      <TouchableOpacity style={styles.deleteBtn}><Text style={styles.deleteBtnText}>삭제</Text></TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.innerBox}>
                    <View style={styles.slotRow}>
                      <Text style={{ fontSize: 11, color: Colors.muted }}>참가자 현황</Text>
                      <Text style={[styles.slotCount, { color: fill >= 80 ? Colors.red : Colors.accent }]}>{ev.participants.length}/{ev.slots}명</Text>
                    </View>
                    <FillBar pct={fill} warn={fill >= 80} />
                    {ev.participants.length > 0 && (
                      <View style={{ marginTop: 10 }}>
                        {ev.participants.map(pid => {
                          const f = getF(pid);
                          return (
                            <View key={pid} style={styles.paxRow}>
                              <Avatar emoji={f?.avatar} size={28} />
                              <View style={{ flex: 1 }}>
                                <Text style={styles.paxName}>{f?.name}</Text>
                                <Text style={styles.paxSub}>{f?.gym} · {f?.weight}</Text>
                              </View>
                              <LevelPill level={f?.level} />
                            </View>
                          );
                        })}
                      </View>
                    )}
                  </View>

                  {ev.comments.length > 0 && (
                    <View style={[styles.innerBox, { marginTop: 10 }]}>
                      <Text style={{ fontSize: 11, color: Colors.muted, marginBottom: 8 }}>💬 댓글 {ev.comments.length}개</Text>
                      {ev.comments.slice(-2).map(c => {
                        const f = getF(c.userId);
                        return (
                          <View key={c.id} style={{ flexDirection: 'row', gap: 7, marginBottom: 6 }}>
                            <Text style={{ fontSize: 13 }}>{f?.avatar}</Text>
                            <Text style={{ fontSize: 11, color: Colors.textSub, marginRight: 6 }}>{f?.name}</Text>
                            <Text style={{ fontSize: 12, color: '#bbb', flex: 1 }}>{c.text}</Text>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* MEMBERS */}
        {tab === 'members' && (
          <View>
            <View style={styles.memberStats}>
              {[['전체 회원', myMembers.length, Colors.blue], ['이번달 활동', Math.floor(myMembers.length * 0.7), Colors.green], ['평균 평점', '4.8', Colors.accent]].map(([label, val, color]) => (
                <View key={label} style={styles.memberStatCard}>
                  <Text style={[styles.memberStatVal, { color }]}>{val}</Text>
                  <Text style={styles.memberStatLabel}>{label}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.sectionLabel}>회원 목록 ({myMembers.length}명)</Text>
            {myMembers.map(f => (
              <View key={f.id} style={styles.memberCard}>
                <Avatar emoji={f.avatar} size={44} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.memberName}>{f.name}</Text>
                    <Text style={styles.memberWeight}>{f.weight}</Text>
                  </View>
                  <Text style={styles.memberSub}>만 {f.age}세 · {f.record}</Text>
                  <View style={{ flexDirection: 'row', gap: 5, marginTop: 6 }}>
                    <LevelPill level={f.level} />
                    <View style={styles.stylePill}><Text style={styles.styleText}>{f.style}</Text></View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* New event form modal */}
      <Modal visible={showForm} animationType="slide" transparent onRequestClose={() => setShowForm(false)}>
        <Pressable style={styles.backdrop} onPress={() => setShowForm(false)}>
          <Pressable onPress={e => e.stopPropagation()}>
            <View style={[styles.formSheet, { paddingBottom: insets.bottom + 24 }]}>
              <View style={styles.handle} />
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ padding: 18 }}>
                  <Text style={styles.formTitle}>새 스파링 이벤트</Text>
                  {[['이벤트 제목 *', 'title', '예) 5월 오픈 스파링 데이'],
                    ['날짜 *', 'date', '예) 2026.05.03 (일)'],
                    ['시간 *', 'time', '예) 14:00'],
                    ['최대 인원', 'slots', '10']].map(([label, key, ph]) => (
                    <View key={key} style={styles.field}>
                      <Text style={styles.fieldLabel}>{label}</Text>
                      <TextInput
                        value={form[key]}
                        onChangeText={v => setForm(p => ({ ...p, [key]: v }))}
                        placeholder={ph}
                        placeholderTextColor="#2a2a3e"
                        style={styles.fieldInput}
                      />
                    </View>
                  ))}
                  <View style={styles.field}>
                    <Text style={styles.fieldLabel}>체급</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                      {['전체', '~60kg', '60~70kg', '70~80kg', '80kg+'].map(o => (
                        <FilterChip key={o} label={o} active={form.weightClass === o} onPress={() => setForm(p => ({ ...p, weightClass: o }))} />
                      ))}
                    </View>
                  </View>
                  <View style={styles.field}>
                    <Text style={styles.fieldLabel}>레벨</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                      {['전체', '입문', '아마추어', '중급', '고급'].map(o => (
                        <FilterChip key={o} label={o} active={form.level === o} onPress={() => setForm(p => ({ ...p, level: o }))} activeColor={levelColors[o] || Colors.accentRed} />
                      ))}
                    </View>
                  </View>
                  <View style={styles.field}>
                    <Text style={styles.fieldLabel}>이벤트 설명</Text>
                    <TextInput
                      value={form.desc}
                      onChangeText={v => setForm(p => ({ ...p, desc: v }))}
                      placeholder="이벤트 안내사항을 입력하세요..."
                      placeholderTextColor="#2a2a3e"
                      multiline
                      numberOfLines={3}
                      style={[styles.fieldInput, { minHeight: 80 }]}
                    />
                  </View>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity onPress={() => setShowForm(false)} style={[styles.formBtn, styles.formBtnGhost]}>
                      <Text style={{ color: '#666', fontWeight: '700' }}>취소</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={createEvent}
                      style={{ flex: 2, borderRadius: 12, overflow: 'hidden' }}
                      activeOpacity={form.title && form.date && form.time ? 0.85 : 1}
                    >
                      {form.title && form.date && form.time
                        ? <LinearGradient colors={['#ff3d3d', '#ff8c00']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.formBtnInner}>
                            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>이벤트 개설</Text>
                          </LinearGradient>
                        : <View style={[styles.formBtnInner, { backgroundColor: '#1c1c28' }]}>
                            <Text style={{ color: '#444', fontWeight: '700', fontSize: 14 }}>이벤트 개설</Text>
                          </View>
                      }
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#1c1c28', backgroundColor: '#160808' },
  backBtn: { width: 34, height: 34, backgroundColor: '#1a1a2e', borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#1c1c28' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#ff8c00' },
  headerSub: { fontSize: 10, color: '#555' },
  onlineDot: { width: 8, height: 8, backgroundColor: '#4ade80', borderRadius: 4 },
  tabRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#1c1c28' },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#ff3d3d' },
  tabText: { fontSize: 13, color: '#444' },
  tabTextActive: { color: '#ff3d3d', fontWeight: '700' },
  scroll: { flex: 1, paddingHorizontal: 15, paddingTop: 18 },
  gymCard: { borderRadius: 16, padding: 16, marginBottom: 18, borderWidth: 1, borderColor: '#ff3d3d22', overflow: 'hidden' },
  gymCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  gymCardName: { color: '#f0f0f0', fontWeight: '800', fontSize: 17 },
  gymCardLoc: { color: '#555', fontSize: 12, marginTop: 2 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 18 },
  statCard: { backgroundColor: '#111118', borderWidth: 1, borderColor: '#1c1c28', borderRadius: 14, padding: 14, width: '47%' },
  statVal: { fontSize: 26, fontWeight: '800', lineHeight: 30 },
  statUnit: { fontSize: 12, fontWeight: '400', color: '#555' },
  statLabel: { fontSize: 11, color: '#555', marginTop: 4 },
  sectionLabel: { fontSize: 12, color: '#555', fontWeight: '600', marginBottom: 10 },
  miniEvent: { backgroundColor: '#111118', borderWidth: 1, borderColor: '#1c1c28', borderRadius: 12, padding: 13, marginBottom: 9, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  miniEventTitle: { color: '#f0f0f0', fontWeight: '600', fontSize: 13, marginBottom: 3 },
  miniEventSub: { fontSize: 11, color: '#555' },
  miniEventCount: { fontSize: 13, fontWeight: '700' },
  bigBtn: { paddingVertical: 14, alignItems: 'center', borderRadius: 14 },
  bigBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  eventCard: { backgroundColor: '#111118', borderWidth: 1, borderColor: '#1c1c28', borderRadius: 16, padding: 16, marginBottom: 12 },
  eventCardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  eventCardTitle: { color: '#f0f0f0', fontWeight: '700', fontSize: 15, marginBottom: 2 },
  eventCardSub: { fontSize: 11, color: '#555' },
  editBtn: { backgroundColor: '#1a1a2e', borderWidth: 1, borderColor: '#1c1c28', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  editBtnText: { fontSize: 11, color: '#888' },
  deleteBtn: { backgroundColor: '#2a1010', borderWidth: 1, borderColor: '#3a1515', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  deleteBtnText: { fontSize: 11, color: Colors.red },
  innerBox: { backgroundColor: '#0d0d18', borderRadius: 10, padding: 10 },
  slotRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  slotCount: { fontSize: 11, fontWeight: '700' },
  paxRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 7 },
  paxName: { fontSize: 12, fontWeight: '600', color: '#f0f0f0' },
  paxSub: { fontSize: 10, color: '#555' },
  memberStats: { flexDirection: 'row', gap: 8, marginBottom: 18 },
  memberStatCard: { flex: 1, backgroundColor: '#111118', borderWidth: 1, borderColor: '#1c1c28', borderRadius: 12, padding: 12, alignItems: 'center' },
  memberStatVal: { fontSize: 22, fontWeight: '800' },
  memberStatLabel: { fontSize: 10, color: '#555', marginTop: 3 },
  memberCard: { backgroundColor: '#111118', borderWidth: 1, borderColor: '#1c1c28', borderRadius: 14, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 9 },
  memberName: { color: '#f0f0f0', fontWeight: '700', fontSize: 14 },
  memberWeight: { fontSize: 12, color: '#888' },
  memberSub: { fontSize: 11, color: '#555', marginTop: 1 },
  stylePill: { backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  styleText: { fontSize: 10, color: '#555' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  formSheet: { backgroundColor: '#13131f', borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth: 1, borderColor: '#1c1c28', maxHeight: '90%' },
  handle: { width: 36, height: 4, backgroundColor: '#2a2a3e', borderRadius: 2, alignSelf: 'center', marginVertical: 12 },
  formTitle: { color: '#f0f0f0', fontWeight: '800', fontSize: 17, marginBottom: 18 },
  field: { marginBottom: 14 },
  fieldLabel: { fontSize: 11, color: '#666', fontWeight: '600', marginBottom: 6 },
  fieldInput: { backgroundColor: '#0d0d18', borderWidth: 1, borderColor: '#1c1c28', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: '#f0f0f0', fontSize: 13 },
  formBtn: { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  formBtnGhost: { backgroundColor: '#1c1c28', borderWidth: 1, borderColor: '#2a2a3e' },
  formBtnInner: { paddingVertical: 14, alignItems: 'center', borderRadius: 12 },
});
