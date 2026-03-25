import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, ME, FIGHTERS, levelColors } from '../data';
import { Avatar, LevelPill, Tag, FilterChip } from '../components/UI';

const WEIGHT_OPTIONS = ['전체', '~60kg', '60~70kg', '70~80kg'];
const LEVEL_OPTIONS = ['전체', '입문', '아마추어', '중급'];

export default function MatchScreen() {
  const [fw, setFw] = useState('전체');
  const [fl, setFl] = useState('전체');

  const fighters = FIGHTERS.filter(f => {
    if (f.id === ME.id) return false;
    const wt = parseFloat(f.weight);
    const wm = fw === '전체' || (fw === '~60kg' && wt <= 60) || (fw === '60~70kg' && wt > 60 && wt <= 70) || (fw === '70~80kg' && wt > 70);
    return wm && (fl === '전체' || f.level === fl);
  });

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
      {/* My card */}
      <View style={styles.myCard}>
        <LinearGradient colors={['#ff3d3d0a', '#7c3aed0a']} style={StyleSheet.absoluteFill} />
        <Text style={styles.myCardLabel}>내 프로필</Text>
        <View style={styles.myCardRow}>
          <Avatar emoji={ME.avatar} size={50} bg="#2a1010" borderColor="#ff3d3d33" borderWidth={2} />
          <View style={{ flex: 1 }}>
            <Text style={styles.myName}>{ME.name}</Text>
            <Text style={styles.myGym}>{ME.gym} · {ME.weight}</Text>
            <View style={styles.pillRow}>
              <LevelPill level={ME.level} />
              <View style={styles.recordPill}>
                <Text style={styles.recordText}>{ME.record}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Weight filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
        {WEIGHT_OPTIONS.map(o => (
          <FilterChip key={o} label={o} active={fw === o} onPress={() => setFw(o)} />
        ))}
      </ScrollView>

      {/* Level filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.filterScroll, { marginBottom: 16 }]} contentContainerStyle={styles.filterContent}>
        {LEVEL_OPTIONS.map(o => (
          <FilterChip
            key={o}
            label={o}
            active={fl === o}
            onPress={() => setFl(o)}
            activeColor={levelColors[o] || Colors.accentRed}
          />
        ))}
      </ScrollView>

      <Text style={styles.countLabel}>근처 파이터 {fighters.length}명</Text>

      {fighters.map(f => (
        <TouchableOpacity key={f.id} activeOpacity={0.85} style={styles.card}>
          <Avatar emoji={f.avatar} size={46} />
          <View style={{ flex: 1 }}>
            <View style={styles.cardTopRow}>
              <Text style={styles.fighterName}>{f.name}</Text>
              <Text style={styles.fighterWeight}>{f.weight}</Text>
            </View>
            <Text style={styles.fighterSub}>{f.gym} · {f.record}</Text>
            <View style={styles.tagRow}>
              <LevelPill level={f.level} />
              {f.tags.map(t => <Tag key={t} label={t} />)}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, paddingHorizontal: 15, paddingTop: 18 },
  myCard: { borderRadius: 16, padding: 14, marginBottom: 18, borderWidth: 1, borderColor: '#ff3d3d1a', overflow: 'hidden', backgroundColor: '#130c0c' },
  myCardLabel: { fontSize: 9, color: '#ff3d3d', fontWeight: '700', letterSpacing: 1.5, marginBottom: 9 },
  myCardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  myName: { color: '#f0f0f0', fontWeight: '700', fontSize: 16 },
  myGym: { color: '#555', fontSize: 12, marginTop: 1 },
  pillRow: { flexDirection: 'row', gap: 5, marginTop: 7 },
  recordPill: { paddingHorizontal: 9, paddingVertical: 2, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  recordText: { fontSize: 10, color: '#777' },
  filterScroll: { marginBottom: 8 },
  filterContent: { paddingRight: 15, gap: 6, flexDirection: 'row' },
  countLabel: { fontSize: 11, color: '#444', marginBottom: 10 },
  card: { backgroundColor: '#111118', borderWidth: 1, borderColor: '#1c1c28', borderRadius: 14, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 9 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between' },
  fighterName: { color: '#f0f0f0', fontWeight: '700', fontSize: 14 },
  fighterWeight: { color: '#ccc', fontWeight: '700', fontSize: 13 },
  fighterSub: { color: '#555', fontSize: 11, marginTop: 1 },
  tagRow: { flexDirection: 'row', gap: 5, marginTop: 7, flexWrap: 'wrap' },
});
