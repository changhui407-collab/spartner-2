import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors, ME, INIT_GYMS } from '../data';
import { Pill } from '../components/UI';

export default function GymsScreen({ events }) {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState(null);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Search bar */}
        <View style={styles.searchBar}>
          <Text style={{ color: '#333', fontSize: 16 }}>🔍</Text>
          <Text style={{ color: '#2a2a3e', fontSize: 13 }}>체육관 검색...</Text>
        </View>

        {INIT_GYMS.map(gym => (
          <TouchableOpacity
            key={gym.id}
            activeOpacity={0.85}
            onPress={() => { setSelected(gym); Haptics.selectionAsync(); }}
            style={[styles.card, gym.id === ME.ownedGymId && { borderColor: '#ff3d3d33' }]}
          >
            <View style={styles.gymIcon}>
              <Text style={{ fontSize: 24 }}>🏟</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.nameRow}>
                <Text style={styles.gymName}>{gym.name}</Text>
                {gym.verified && <Text style={{ fontSize: 12 }}>✅</Text>}
                {gym.id === ME.ownedGymId && <Pill label="내 짐" color="#ff8c00" bg="#ff3d3d12" />}
              </View>
              <Text style={styles.gymLocation}>{gym.location} · {gym.distance}</Text>
              <View style={styles.sportsRow}>
                {gym.sports.map(s => (
                  <View key={s} style={styles.sportChip}>
                    <Text style={styles.sportText}>{s}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.statsRow}>
                <Text style={styles.stat}>⭐ {gym.rating} ({gym.reviews})</Text>
                <Text style={styles.stat}>👥 {gym.members}명</Text>
              </View>
            </View>
            <Text style={{ fontSize: 14, color: '#333', marginTop: 4 }}>›</Text>
          </TouchableOpacity>
        ))}

        {/* Register CTA */}
        <View style={styles.registerCard}>
          <Text style={{ fontSize: 22, marginBottom: 8 }}>🏋️</Text>
          <Text style={styles.registerTitle}>내 체육관을 등록하세요</Text>
          <Text style={styles.registerSub}>회원들과 오픈 스파링 이벤트를 쉽게 열어보세요</Text>
          <TouchableOpacity activeOpacity={0.85} style={{ borderRadius: 10, overflow: 'hidden', marginTop: 14, alignSelf: 'center' }}>
            <LinearGradient colors={['#ff3d3d', '#ff8c00']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.registerBtn}>
              <Text style={styles.registerBtnText}>체육관 등록하기</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Gym detail modal */}
      <Modal visible={!!selected} animationType="slide" transparent onRequestClose={() => setSelected(null)}>
        <Pressable style={styles.backdrop} onPress={() => setSelected(null)}>
          <Pressable onPress={e => e.stopPropagation()}>
            <View style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
              <View style={styles.handle} />
              <ScrollView showsVerticalScrollIndicator={false}>
                {selected && (
                  <View style={{ padding: 18 }}>
                    <View style={styles.gymDetailHeader}>
                      <View style={styles.gymDetailIcon}><Text style={{ fontSize: 28 }}>🏟</Text></View>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                          <Text style={styles.gymDetailName}>{selected.name}</Text>
                          {selected.verified && <Text>✅</Text>}
                        </View>
                        <Text style={styles.gymDetailLocation}>{selected.location}</Text>
                        <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
                          <Text style={styles.stat}>⭐ {selected.rating}</Text>
                          <Text style={{ fontSize: 12, color: Colors.muted }}>({selected.reviews}개 리뷰)</Text>
                          <Text style={styles.stat}>👥 {selected.members}명</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.sportsRow}>
                      {selected.sports.map(s => <Pill key={s} label={s} color="#ff8c00" bg="#ff3d3d12" />)}
                    </View>

                    <View style={styles.introBox}>
                      <Text style={styles.introText}>{selected.intro}</Text>
                    </View>

                    {[['⏰', '운영시간', selected.open], ['📞', '전화번호', selected.phone], ['📍', '주소', selected.location]].map(([ic, label, val]) => (
                      <View key={label} style={styles.infoRow}>
                        <Text style={{ fontSize: 14, marginTop: 1 }}>{ic}</Text>
                        <View>
                          <Text style={styles.infoLabel}>{label}</Text>
                          <Text style={styles.infoVal}>{val}</Text>
                        </View>
                      </View>
                    ))}

                    <View style={styles.divider} />
                    <Text style={[styles.infoLabel, { marginBottom: 10 }]}>예정 이벤트</Text>
                    {events.filter(ev => ev.gymId === selected.id).length === 0
                      ? <Text style={{ textAlign: 'center', color: '#2a2a3e', fontSize: 13, paddingVertical: 12 }}>예정된 이벤트가 없습니다</Text>
                      : events.filter(ev => ev.gymId === selected.id).map(ev => (
                        <View key={ev.id} style={styles.eventMini}>
                          <View>
                            <Text style={styles.eventMiniTitle}>{ev.title}</Text>
                            <Text style={styles.eventMiniSub}>{ev.date} · {ev.time}</Text>
                          </View>
                          <Text style={{ fontSize: 11, color: Colors.textSub }}>{ev.participants.length}/{ev.slots}명 ›</Text>
                        </View>
                      ))
                    }

                    <TouchableOpacity activeOpacity={0.85} style={{ borderRadius: 12, overflow: 'hidden', marginTop: 8 }}>
                      <LinearGradient colors={['#ff3d3d', '#ff8c00']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.joinBtn}>
                        <Text style={styles.joinBtnText}>초대 요청 보내기</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, paddingHorizontal: 15, paddingTop: 18 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#111118', borderWidth: 1, borderColor: '#1c1c28', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 16 },
  card: { backgroundColor: '#111118', borderWidth: 1, borderColor: '#1c1c28', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  gymIcon: { width: 50, height: 50, backgroundColor: '#1a1a2e', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 2 },
  gymName: { color: '#f0f0f0', fontWeight: '700', fontSize: 14 },
  gymLocation: { color: '#555', fontSize: 11, marginBottom: 8 },
  sportsRow: { flexDirection: 'row', gap: 5, flexWrap: 'wrap', marginBottom: 8 },
  sportChip: { backgroundColor: '#1a1a2e', borderWidth: 1, borderColor: '#1c1c28', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  sportText: { fontSize: 10, color: '#888' },
  statsRow: { flexDirection: 'row', gap: 12 },
  stat: { fontSize: 11, color: '#888' },
  registerCard: { marginTop: 14, backgroundColor: '#0a0a18', borderWidth: 1, borderColor: '#2a2a4e', borderStyle: 'dashed', borderRadius: 14, padding: 20, alignItems: 'center' },
  registerTitle: { color: '#f0f0f0', fontWeight: '700', fontSize: 14, marginBottom: 6 },
  registerSub: { color: '#555', fontSize: 12, textAlign: 'center' },
  registerBtn: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10 },
  registerBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#13131f', borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth: 1, borderColor: '#1c1c28' },
  handle: { width: 36, height: 4, backgroundColor: '#2a2a3e', borderRadius: 2, alignSelf: 'center', marginVertical: 12 },
  gymDetailHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 16 },
  gymDetailIcon: { width: 56, height: 56, backgroundColor: '#1a1a2e', borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#1c1c28' },
  gymDetailName: { color: '#f0f0f0', fontWeight: '800', fontSize: 18 },
  gymDetailLocation: { color: '#666', fontSize: 12 },
  introBox: { backgroundColor: '#0d0d18', borderRadius: 12, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#161624' },
  introText: { color: '#bbb', fontSize: 13, lineHeight: 21 },
  infoRow: { flexDirection: 'row', gap: 10, marginBottom: 12, alignItems: 'flex-start' },
  infoLabel: { fontSize: 11, color: '#555', marginBottom: 2 },
  infoVal: { fontSize: 13, color: '#ccc' },
  divider: { height: 1, backgroundColor: '#1c1c28', marginVertical: 16 },
  eventMini: { backgroundColor: '#111118', borderWidth: 1, borderColor: '#1c1c28', borderRadius: 12, padding: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eventMiniTitle: { color: '#f0f0f0', fontWeight: '600', fontSize: 13, marginBottom: 3 },
  eventMiniSub: { color: '#555', fontSize: 11 },
  joinBtn: { paddingVertical: 14, alignItems: 'center', borderRadius: 12 },
  joinBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
