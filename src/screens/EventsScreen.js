import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Modal, KeyboardAvoidingView, Platform, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors, FIGHTERS, getF } from '../data';
import { Avatar, FillBar, PrimaryButton, Pill, Divider } from '../components/UI';

export default function EventsScreen({ events, setEvents }) {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState(null);
  const [commentText, setCommentText] = useState('');
  const ME_ID = 1;

  const isParticipant = (ev) => ev.participants.includes(ME_ID);

  const toggleJoin = (eventId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const upd = (ev) => {
      if (ev.id !== eventId) return ev;
      const has = ev.participants.includes(ME_ID);
      return { ...ev, participants: has ? ev.participants.filter(p => p !== ME_ID) : [...ev.participants, ME_ID] };
    };
    setEvents(prev => prev.map(upd));
    setSelected(prev => prev ? upd(prev) : null);
  };

  const addComment = (eventId) => {
    if (!commentText.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const nc = { id: Date.now(), userId: ME_ID, text: commentText.trim(), time: '방금' };
    const upd = (ev) => ev.id === eventId ? { ...ev, comments: [...ev.comments, nc] } : ev;
    setEvents(prev => prev.map(upd));
    setSelected(prev => prev ? upd(prev) : null);
    setCommentText('');
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Create event CTA */}
        <TouchableOpacity activeOpacity={0.85} style={{ marginBottom: 18, borderRadius: 14, overflow: 'hidden' }}>
          <LinearGradient colors={['#ff3d3d', '#ff8c00']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.createBtn}>
            <Text style={styles.createBtnText}>＋ 스파링 이벤트 개설하기</Text>
          </LinearGradient>
        </TouchableOpacity>

        {events.map((ev) => {
          const joined = isParticipant(ev);
          const fill = Math.round((ev.participants.length / ev.slots) * 100);
          return (
            <TouchableOpacity
              key={ev.id}
              activeOpacity={0.85}
              onPress={() => { setSelected(ev); Haptics.selectionAsync(); }}
              style={[styles.card, joined && { borderColor: '#ff3d3d33' }]}
            >
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{ev.title}</Text>
                  <Text style={styles.cardGym}>{ev.gym}</Text>
                </View>
                {joined && <Pill label="참가중" color="#ff8c00" bg="#ff3d3d12" />}
              </View>

              <View style={styles.metaRow}>
                {[['📅', ev.date], ['⏰', ev.time], ['⚖️', ev.weightClass], ['🥋', ev.level]].map(([ic, v]) => (
                  <View key={ic} style={styles.metaItem}>
                    <Text style={styles.metaText}>{ic} {v}</Text>
                  </View>
                ))}
              </View>

              <View style={{ marginBottom: 10 }}>
                <View style={styles.slotRow}>
                  <Text style={styles.slotLabel}>참가자</Text>
                  <Text style={styles.slotCount}>{ev.participants.length}/{ev.slots}명</Text>
                </View>
                <FillBar pct={fill} warn={fill >= 80} />
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.avatarStack}>
                  {ev.participants.slice(0, 5).map((pid, i) => (
                    <View key={pid} style={[styles.stackAvatar, { marginLeft: i > 0 ? -7 : 0, zIndex: 5 - i }]}>
                      <Text style={{ fontSize: 12 }}>{getF(pid)?.avatar}</Text>
                    </View>
                  ))}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  {ev.comments.length > 0 && (
                    <Text style={{ fontSize: 11, color: Colors.muted }}>💬 {ev.comments.length}</Text>
                  )}
                  <Text style={{ fontSize: 16, color: '#333' }}>›</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Event detail modal */}
      <Modal visible={!!selected} animationType="slide" transparent onRequestClose={() => setSelected(null)}>
        <Pressable style={styles.backdrop} onPress={() => setSelected(null)}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%' }}>
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
                <View style={styles.sheetHandle} />

                <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: '85%' }}>
                  <View style={{ padding: 18 }}>
                    {selected && (
                      <>
                        <Text style={styles.sheetTitle}>{selected.title}</Text>
                        <Text style={styles.sheetGym}>{selected.gym}</Text>

                        <View style={styles.metaRow}>
                          {[['📅', selected.date], ['⏰', selected.time], ['⚖️', selected.weightClass], ['🥋', selected.level]].map(([ic, v]) => (
                            <View key={ic} style={styles.metaBadge}>
                              <Text style={{ fontSize: 11, color: '#777' }}>{ic} {v}</Text>
                            </View>
                          ))}
                        </View>

                        <Text style={styles.desc}>{selected.desc}</Text>

                        {/* Participants */}
                        <Text style={[styles.slotLabel, { marginBottom: 6 }]}>참가자 {selected.participants.length}/{selected.slots}명</Text>
                        <FillBar pct={Math.round((selected.participants.length / selected.slots) * 100)} />
                        <View style={styles.participantRow}>
                          {selected.participants.map(pid => {
                            const f = getF(pid); const mine = pid === 1;
                            return (
                              <View key={pid} style={[styles.participantChip, mine && { borderColor: '#ff3d3d2a', backgroundColor: '#ff3d3d12' }]}>
                                <Text style={{ fontSize: 13 }}>{f?.avatar}</Text>
                                <Text style={[styles.participantName, mine && { color: Colors.accent }]}>{f?.name}{mine ? ' (나)' : ''}</Text>
                              </View>
                            );
                          })}
                        </View>

                        <TouchableOpacity
                          activeOpacity={0.85}
                          style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}
                          onPress={() => toggleJoin(selected.id)}
                        >
                          {isParticipant(selected)
                            ? <View style={styles.ghostBtn}><Text style={styles.ghostBtnText}>참가 취소</Text></View>
                            : <LinearGradient colors={['#ff3d3d', '#ff8c00']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.joinBtn}>
                                <Text style={styles.joinBtnText}>⚡ 참가 신청</Text>
                              </LinearGradient>
                          }
                        </TouchableOpacity>

                        <Divider />

                        {/* Comments */}
                        <View style={{ paddingTop: 16 }}>
                          <Text style={styles.commentHeader}>
                            💬 댓글 {selected.comments.length}
                            {!isParticipant(selected) && <Text style={{ color: '#333', fontWeight: '400', fontSize: 11 }}> — 참가자만 작성 가능</Text>}
                          </Text>

                          {selected.comments.length === 0 && (
                            <Text style={{ textAlign: 'center', color: '#2a2a3e', fontSize: 13, paddingVertical: 20 }}>첫 댓글을 남겨보세요</Text>
                          )}

                          {selected.comments.map(c => {
                            const f = getF(c.userId); const mine = c.userId === 1;
                            return (
                              <View key={c.id} style={styles.commentRow}>
                                <View style={[styles.commentAvatar, mine && { borderColor: '#ff3d3d33' }]}>
                                  <Text style={{ fontSize: 14 }}>{f?.avatar}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                  <View style={styles.commentMeta}>
                                    <Text style={[styles.commentName, mine && { color: Colors.accent }]}>{f?.name}{mine ? ' (나)' : ''}</Text>
                                    <Text style={styles.commentTime}>{c.time}</Text>
                                  </View>
                                  <View style={styles.commentBubble}>
                                    <Text style={styles.commentText}>{c.text}</Text>
                                  </View>
                                </View>
                              </View>
                            );
                          })}
                        </View>
                      </>
                    )}
                  </View>
                </ScrollView>

                {/* Comment input */}
                {selected && (
                  <View style={[styles.inputRow, { paddingHorizontal: 16, paddingTop: 10 }]}>
                    {isParticipant(selected) ? (
                      <>
                        <View style={styles.meAvatar}><Text style={{ fontSize: 14 }}>🥊</Text></View>
                        <View style={styles.inputBox}>
                          <TextInput
                            value={commentText}
                            onChangeText={setCommentText}
                            placeholder="댓글 입력..."
                            placeholderTextColor="#333"
                            style={styles.input}
                            multiline
                          />
                          <TouchableOpacity onPress={() => addComment(selected.id)} activeOpacity={0.8}
                            style={[styles.sendBtn, commentText.trim() && styles.sendBtnActive]}>
                            <Text style={[styles.sendText, commentText.trim() && { color: '#fff' }]}>전송</Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    ) : (
                      <Text style={{ textAlign: 'center', color: '#333', fontSize: 12, flex: 1, paddingVertical: 8 }}>참가 신청 후 댓글을 남길 수 있습니다</Text>
                    )}
                  </View>
                )}
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, paddingHorizontal: 15, paddingTop: 18 },
  createBtn: { paddingVertical: 14, alignItems: 'center', borderRadius: 14 },
  createBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  card: { backgroundColor: '#111118', borderWidth: 1, borderColor: '#1c1c28', borderRadius: 16, padding: 16, marginBottom: 11 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  cardTitle: { color: '#f0f0f0', fontWeight: '700', fontSize: 15, marginBottom: 2 },
  cardGym: { color: '#555', fontSize: 12 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 11 },
  metaItem: {},
  metaText: { fontSize: 11, color: '#666' },
  metaBadge: { backgroundColor: '#1a1a2e', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20 },
  slotRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  slotLabel: { fontSize: 11, color: '#555' },
  slotCount: { fontSize: 11, fontWeight: '700', color: '#f0f0f0' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  avatarStack: { flexDirection: 'row' },
  stackAvatar: { width: 24, height: 24, backgroundColor: '#1a1a2e', borderRadius: 12, borderWidth: 2, borderColor: '#09090f', alignItems: 'center', justifyContent: 'center' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#13131f', borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth: 1, borderColor: '#1c1c28' },
  sheetHandle: { width: 36, height: 4, backgroundColor: '#2a2a3e', borderRadius: 2, alignSelf: 'center', marginVertical: 12 },
  sheetTitle: { color: '#f0f0f0', fontWeight: '800', fontSize: 17, marginBottom: 3 },
  sheetGym: { color: '#555', fontSize: 12, marginBottom: 12 },
  desc: { color: '#888', fontSize: 13, lineHeight: 22, marginBottom: 16 },
  participantRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10, marginBottom: 14 },
  participantChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#1a1a2e', borderWidth: 1, borderColor: '#2a2a3e', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  participantName: { fontSize: 12, color: '#bbb' },
  joinBtn: { paddingVertical: 14, alignItems: 'center', borderRadius: 12 },
  joinBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  ghostBtn: { paddingVertical: 14, alignItems: 'center', borderRadius: 12, backgroundColor: '#1c1c28', borderWidth: 1, borderColor: '#2a2a3e' },
  ghostBtnText: { color: '#666', fontWeight: '700', fontSize: 14 },
  commentHeader: { fontSize: 12, color: '#555', fontWeight: '600', marginBottom: 12 },
  commentRow: { flexDirection: 'row', gap: 9, marginBottom: 14 },
  commentAvatar: { width: 30, height: 30, backgroundColor: '#1a1a2e', borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#2a2a3e' },
  commentMeta: { flexDirection: 'row', gap: 6, alignItems: 'center', marginBottom: 4 },
  commentName: { fontSize: 12, fontWeight: '700', color: '#ccc' },
  commentTime: { fontSize: 10, color: '#333' },
  commentBubble: { backgroundColor: '#0d0d18', padding: 10, borderRadius: 2, borderTopRightRadius: 12, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, borderWidth: 1, borderColor: '#161624' },
  commentText: { fontSize: 13, color: '#bbb', lineHeight: 20 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  meAvatar: { width: 30, height: 30, backgroundColor: '#2a1010', borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#ff3d3d22' },
  inputBox: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', backgroundColor: '#0d0d18', borderRadius: 12, borderWidth: 1, borderColor: '#1c1c28', paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  input: { flex: 1, color: '#f0f0f0', fontSize: 13, maxHeight: 80 },
  sendBtn: { backgroundColor: '#1c1c28', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 },
  sendBtnActive: { backgroundColor: '#ff5500' },
  sendText: { fontSize: 12, fontWeight: '700', color: '#444' },
});
