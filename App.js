import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors, ME, INIT_EVENTS } from './src/data';
import EventsScreen from './src/screens/EventsScreen';
import MatchScreen from './src/screens/MatchScreen';
import GymsScreen from './src/screens/GymsScreen';
import AdminScreen from './src/screens/AdminScreen';

const TABS = [
  { key: 'events', label: '이벤트', icon: '📅' },
  { key: 'match',  label: '매칭',   icon: '⚡' },
  { key: 'gyms',   label: '체육관', icon: '🏟' },
];

function MainApp() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('events');
  const [showAdmin, setShowAdmin] = useState(false);
  const [events, setEvents] = useState(INIT_EVENTS);

  if (showAdmin) {
    return (
      <AdminScreen
        events={events}
        setEvents={setEvents}
        onBack={() => setShowAdmin(false)}
      />
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="light" backgroundColor="#160808" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>SPARTNER</Text>
          <Text style={styles.logoSub}>OPEN SPARRING NETWORK</Text>
        </View>
        <View style={styles.headerRight}>
          {ME.isGymOwner && (
            <TouchableOpacity
              onPress={() => setShowAdmin(true)}
              activeOpacity={0.8}
              style={styles.adminBtn}
            >
              <Text style={styles.adminBtnText}>관리 ›</Text>
            </TouchableOpacity>
          )}
          <View style={styles.meAvatar}>
            <Text style={{ fontSize: 18 }}>{ME.avatar}</Text>
          </View>
        </View>
      </View>

      {/* ── Tab bar (top) ── */}
      <View style={styles.tabBar}>
        {TABS.map(t => (
          <TouchableOpacity
            key={t.key}
            onPress={() => setTab(t.key)}
            activeOpacity={0.7}
            style={[styles.tabItem, tab === t.key && styles.tabItemActive]}
          >
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>
              {t.icon} {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Screen content ── */}
      <View style={{ flex: 1, paddingBottom: insets.bottom }}>
        {tab === 'events' && <EventsScreen events={events} setEvents={setEvents} />}
        {tab === 'match'  && <MatchScreen />}
        {tab === 'gyms'   && <GymsScreen events={events} />}
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MainApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#160808',
    borderBottomWidth: 1,
    borderBottomColor: '#1c1c28',
  },
  logo: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ff8c00',
    letterSpacing: 2,
    lineHeight: 26,
  },
  logoSub: {
    fontSize: 9,
    color: '#444',
    letterSpacing: 1.5,
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  adminBtn: {
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#2a2a3e',
    borderRadius: 10,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  adminBtnText: {
    fontSize: 11,
    color: '#888',
    fontWeight: '600',
  },
  meAvatar: {
    width: 36,
    height: 36,
    backgroundColor: '#2a1010',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ff3d3d33',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#09090f',
    borderBottomWidth: 1,
    borderBottomColor: '#1c1c28',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: '#ff3d3d',
  },
  tabText: {
    fontSize: 13,
    color: '#444',
  },
  tabTextActive: {
    color: '#ff3d3d',
    fontWeight: '700',
  },
});
