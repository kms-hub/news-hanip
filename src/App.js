import React, {useEffect, useMemo, useState} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {NEWS, DEFAULT_KEYWORDS} from './data/mockNews';
import {
  NativeStore,
  cancelMorningNotification,
  openArticleUrl,
  requestNotificationPermission,
  scheduleMorningNotification,
} from './storage';
import {colors} from './theme';

const STORAGE_KEYS = {
  profile: 'profile',
  keywords: 'keywords',
  favorites: 'favorites',
  notification: 'notification',
};

function Header({title, subtitle, onLogout}) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.appName}>뉴스한입</Text>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle ? <Text style={styles.subText}>{subtitle}</Text> : null}
      </View>
      {onLogout ? (
        <TouchableOpacity style={styles.outlineSmallButton} onPress={onLogout}>
          <Text style={styles.outlineSmallButtonText}>로그아웃</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

function LoginScreen({onLogin}) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('student@yu.ac.kr');
  const [name, setName] = useState('컴공 학생');
  const [password, setPassword] = useState('1234');

  const submit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('입력 확인', '이메일과 비밀번호를 입력해 주세요.');
      return;
    }
    const profile = {email: email.trim(), name: name.trim() || '사용자'};
    await NativeStore.set(STORAGE_KEYS.profile, profile);
    onLogin(profile);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      <ScrollView contentContainerStyle={styles.authWrap}>
        <Text style={styles.logo}>📰</Text>
        <Text style={styles.authTitle}>뉴스한입</Text>
        <Text style={styles.authDesc}>
          매일 아침, 관심 있는 뉴스를 한입 크기로 요약해서 확인하세요.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>이메일</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="이메일"
          />
          {mode === 'register' ? (
            <>
              <Text style={styles.label}>이름</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="이름"
              />
            </>
          ) : null}
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="비밀번호"
          />

          <TouchableOpacity style={styles.primaryButton} onPress={submit}>
            <Text style={styles.primaryButtonText}>
              {mode === 'login' ? '로그인' : '회원가입'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => setMode(mode === 'login' ? 'register' : 'login')}>
            <Text style={styles.linkText}>
              {mode === 'login'
                ? '처음 이용하시나요? 회원가입'
                : '이미 계정이 있나요? 로그인'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function NewsCard({item, isFavorite, onToggleFavorite, onOpen}) {
  return (
    <View style={styles.newsCard}>
      <View style={styles.rowBetween}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.category}</Text>
        </View>
        <TouchableOpacity onPress={onToggleFavorite}>
          <Text style={styles.star}>{isFavorite ? '★' : '☆'}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.newsTitle}>{item.title}</Text>
      <Text style={styles.newsSummary}>{item.summary}</Text>
      <View style={styles.rowBetween}>
        <Text style={styles.source}>{item.source}</Text>
        <TouchableOpacity onPress={onOpen}>
          <Text style={styles.linkText}>상세기사 열기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function HomeScreen({profile, news, favorites, onToggleFavorite, onOpen, onRefresh}) {
  const todayText = new Date().toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <ScrollView contentContainerStyle={styles.screenPad}>
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>{profile.name}님, 오늘의 뉴스입니다</Text>
        <Text style={styles.heroDesc}>{todayText} 기준 관심 키워드 중심 요약</Text>
        <TouchableOpacity style={styles.heroButton} onPress={onRefresh}>
          <Text style={styles.heroButtonText}>요약 새로고침</Text>
        </TouchableOpacity>
      </View>

      {news.map(item => (
        <NewsCard
          key={item.id}
          item={item}
          isFavorite={favorites.includes(item.id)}
          onToggleFavorite={() => onToggleFavorite(item.id)}
          onOpen={() => onOpen(item.url)}
        />
      ))}
    </ScrollView>
  );
}

function KeywordsScreen({keywords, onSave}) {
  const [text, setText] = useState(keywords.join(', '));
  const allKeywords = ['인공지능', '청년', '반도체', '대학생', '미국', '날씨'];

  const toggle = keyword => {
    const current = text
      .split(',')
      .map(v => v.trim())
      .filter(Boolean);
    const next = current.includes(keyword)
      ? current.filter(v => v !== keyword)
      : [...current, keyword];
    setText(next.join(', '));
  };

  const save = () => {
    const next = text
      .split(',')
      .map(v => v.trim())
      .filter(Boolean);
    if (next.length === 0) {
      Alert.alert('키워드 확인', '키워드를 1개 이상 입력해 주세요.');
      return;
    }
    onSave(next);
  };

  return (
    <ScrollView contentContainerStyle={styles.screenPad}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>관심 키워드 설정</Text>
        <Text style={styles.sectionDesc}>
          쉼표로 구분해서 직접 입력하거나 아래 추천 키워드를 선택하세요.
        </Text>
        <TextInput
          value={text}
          onChangeText={setText}
          style={[styles.input, styles.multiInput]}
          multiline
          placeholder="예: 인공지능, 청년, 반도체"
        />
        <View style={styles.chipWrap}>
          {allKeywords.map(keyword => (
            <TouchableOpacity
              key={keyword}
              style={[
                styles.chip,
                text.includes(keyword) ? styles.chipActive : null,
              ]}
              onPress={() => toggle(keyword)}>
              <Text
                style={[
                  styles.chipText,
                  text.includes(keyword) ? styles.chipTextActive : null,
                ]}>
                {keyword}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.primaryButton} onPress={save}>
          <Text style={styles.primaryButtonText}>키워드 저장</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function FavoritesScreen({items, favorites, onToggleFavorite, onOpen}) {
  const favoriteItems = items.filter(item => favorites.includes(item.id));
  return (
    <ScrollView contentContainerStyle={styles.screenPad}>
      <Text style={styles.sectionTitle}>즐겨찾기</Text>
      {favoriteItems.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>저장한 뉴스가 없습니다</Text>
          <Text style={styles.sectionDesc}>홈에서 별표를 눌러 뉴스를 저장하세요.</Text>
        </View>
      ) : (
        favoriteItems.map(item => (
          <NewsCard
            key={item.id}
            item={item}
            isFavorite
            onToggleFavorite={() => onToggleFavorite(item.id)}
            onOpen={() => onOpen(item.url)}
          />
        ))
      )}
    </ScrollView>
  );
}

function SettingsScreen({notification, onSaveNotification, onCancelNotification}) {
  const [enabled, setEnabled] = useState(notification.enabled);
  const [hour, setHour] = useState(String(notification.hour ?? 8));
  const [minute, setMinute] = useState(String(notification.minute ?? 0));

  const save = () => {
    const h = Number(hour);
    const m = Number(minute);
    if (Number.isNaN(h) || h < 0 || h > 23 || Number.isNaN(m) || m < 0 || m > 59) {
      Alert.alert('시간 확인', '시간은 0~23, 분은 0~59 사이로 입력해 주세요.');
      return;
    }
    onSaveNotification({enabled, hour: h, minute: m});
  };

  return (
    <ScrollView contentContainerStyle={styles.screenPad}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>아침 알림 설정</Text>
        <View style={styles.rowBetween}>
          <Text style={styles.labelBig}>매일 알림 받기</Text>
          <Switch value={enabled} onValueChange={setEnabled} />
        </View>
        <View style={styles.timeRow}>
          <View style={styles.timeInputBox}>
            <Text style={styles.label}>시</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={hour}
              onChangeText={setHour}
            />
          </View>
          <View style={styles.timeInputBox}>
            <Text style={styles.label}>분</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={minute}
              onChangeText={setMinute}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.primaryButton} onPress={save}>
          <Text style={styles.primaryButtonText}>알림 저장</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dangerButton} onPress={onCancelNotification}>
          <Text style={styles.dangerButtonText}>알림 취소</Text>
        </TouchableOpacity>
        <Text style={styles.sectionDesc}>
          Android 13 이상에서는 앱 알림 권한을 허용해야 알림이 표시됩니다.
        </Text>
      </View>
    </ScrollView>
  );
}

function BottomNav({tab, setTab}) {
  const tabs = [
    ['home', '홈'],
    ['keywords', '키워드'],
    ['favorites', '즐겨찾기'],
    ['settings', '설정'],
  ];
  return (
    <View style={styles.bottomNav}>
      {tabs.map(([key, label]) => (
        <TouchableOpacity
          key={key}
          style={styles.navItem}
          onPress={() => setTab(key)}>
          <Text style={[styles.navText, tab === key ? styles.navTextActive : null]}>
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function App() {
  const [booted, setBooted] = useState(false);
  const [profile, setProfile] = useState(null);
  const [keywords, setKeywords] = useState(DEFAULT_KEYWORDS);
  const [favorites, setFavorites] = useState([]);
  const [notification, setNotification] = useState({enabled: false, hour: 8, minute: 0});
  const [tab, setTab] = useState('home');
  const [refreshNo, setRefreshNo] = useState(0);

  useEffect(() => {
    const init = async () => {
      const savedProfile = await NativeStore.getJson(STORAGE_KEYS.profile, null);
      const savedKeywords = await NativeStore.getJson(STORAGE_KEYS.keywords, DEFAULT_KEYWORDS);
      const savedFavorites = await NativeStore.getJson(STORAGE_KEYS.favorites, []);
      const savedNotification = await NativeStore.getJson(STORAGE_KEYS.notification, {
        enabled: false,
        hour: 8,
        minute: 0,
      });
      setProfile(savedProfile);
      setKeywords(savedKeywords);
      setFavorites(savedFavorites);
      setNotification(savedNotification);
      setBooted(true);
    };
    init();
  }, []);

  const filteredNews = useMemo(() => {
    const selected = NEWS.filter(item => keywords.includes(item.keyword));
    const base = selected.length > 0 ? selected : NEWS;
    return refreshNo % 2 === 0 ? base : [...base].reverse();
  }, [keywords, refreshNo]);

  const saveKeywords = async next => {
    setKeywords(next);
    await NativeStore.set(STORAGE_KEYS.keywords, next);
    setTab('home');
    Alert.alert('저장 완료', '관심 키워드가 저장되었습니다.');
  };

  const toggleFavorite = async id => {
    const next = favorites.includes(id)
      ? favorites.filter(itemId => itemId !== id)
      : [...favorites, id];
    setFavorites(next);
    await NativeStore.set(STORAGE_KEYS.favorites, next);
  };

  const openUrl = async url => {
    try {
      await openArticleUrl(url);
    } catch (e) {
      Alert.alert('열기 실패', '상세기사 링크를 열 수 없습니다.');
    }
  };

  const saveNotification = async next => {
    setNotification(next);
    await NativeStore.set(STORAGE_KEYS.notification, next);
    if (next.enabled) {
      await requestNotificationPermission();
      await scheduleMorningNotification(
        next.hour,
        next.minute,
        `오늘의 주요 뉴스 ${filteredNews.length}개를 확인해 보세요.`,
      );
      Alert.alert('알림 설정 완료', `${next.hour}시 ${next.minute}분에 알림을 예약했습니다.`);
    } else {
      await cancelMorningNotification();
      Alert.alert('알림 꺼짐', '아침 알림을 사용하지 않습니다.');
    }
  };

  const cancelNotification = async () => {
    const next = {...notification, enabled: false};
    setNotification(next);
    await NativeStore.set(STORAGE_KEYS.notification, next);
    await cancelMorningNotification();
    Alert.alert('알림 취소', '예약된 아침 알림을 취소했습니다.');
  };

  const logout = async () => {
    setProfile(null);
    await NativeStore.set(STORAGE_KEYS.profile, '');
  };

  if (!booted) {
    return (
      <SafeAreaView style={styles.safeCenter}>
        <Text style={styles.authTitle}>뉴스한입 로딩 중...</Text>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return <LoginScreen onLogin={setProfile} />;
  }

  const tabTitle =
    tab === 'home'
      ? '오늘의 요약'
      : tab === 'keywords'
        ? '키워드 설정'
        : tab === 'favorites'
          ? '즐겨찾기'
          : '알림 설정';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      <Header
        title={tabTitle}
        subtitle={`관심 키워드: ${keywords.join(', ')}`}
        onLogout={logout}
      />
      <View style={styles.content}>
        {tab === 'home' ? (
          <HomeScreen
            profile={profile}
            news={filteredNews}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onOpen={openUrl}
            onRefresh={() => setRefreshNo(v => v + 1)}
          />
        ) : null}
        {tab === 'keywords' ? (
          <KeywordsScreen keywords={keywords} onSave={saveKeywords} />
        ) : null}
        {tab === 'favorites' ? (
          <FavoritesScreen
            items={NEWS}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onOpen={openUrl}
          />
        ) : null}
        {tab === 'settings' ? (
          <SettingsScreen
            notification={notification}
            onSaveNotification={saveNotification}
            onCancelNotification={cancelNotification}
          />
        ) : null}
      </View>
      <BottomNav tab={tab} setTab={setTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.bg},
  safeCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg,
  },
  content: {flex: 1},
  authWrap: {padding: 24, justifyContent: 'center', minHeight: '100%'},
  logo: {fontSize: 64, textAlign: 'center'},
  authTitle: {fontSize: 30, fontWeight: '800', color: colors.text, textAlign: 'center'},
  authDesc: {
    color: colors.subText,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginVertical: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  appName: {fontSize: 14, color: colors.primary, fontWeight: '800'},
  headerTitle: {fontSize: 24, fontWeight: '800', color: colors.text, marginTop: 3},
  subText: {color: colors.subText, fontSize: 12, marginTop: 4},
  screenPad: {padding: 16, paddingBottom: 30},
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 8, marginTop: 10},
  labelBig: {fontSize: 16, fontWeight: '700', color: colors.text},
  input: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  multiInput: {height: 90, textAlignVertical: 'top'},
  primaryButton: {
    marginTop: 18,
    backgroundColor: colors.primary,
    borderRadius: 13,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {color: '#fff', fontWeight: '800', fontSize: 16},
  dangerButton: {
    marginTop: 10,
    backgroundColor: '#FEE2E2',
    borderRadius: 13,
    paddingVertical: 14,
    alignItems: 'center',
  },
  dangerButtonText: {color: colors.danger, fontWeight: '800', fontSize: 15},
  linkButton: {paddingVertical: 14, alignItems: 'center'},
  linkText: {color: colors.primary, fontWeight: '700'},
  outlineSmallButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  outlineSmallButtonText: {fontSize: 12, color: colors.subText, fontWeight: '700'},
  heroCard: {
    backgroundColor: colors.primary,
    borderRadius: 22,
    padding: 20,
    marginBottom: 14,
  },
  heroTitle: {fontSize: 21, fontWeight: '800', color: '#fff'},
  heroDesc: {fontSize: 13, color: '#EAF0FF', marginTop: 8},
  heroButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  heroButtonText: {color: colors.primaryDark, fontWeight: '800'},
  newsCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowBetween: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  badge: {backgroundColor: '#EEF2FF', borderRadius: 99, paddingHorizontal: 10, paddingVertical: 5},
  badgeText: {color: colors.primary, fontWeight: '800', fontSize: 12},
  star: {fontSize: 27, color: '#F59E0B'},
  newsTitle: {fontSize: 18, fontWeight: '800', color: colors.text, marginTop: 12, lineHeight: 25},
  newsSummary: {fontSize: 14, color: '#374151', marginTop: 8, lineHeight: 21},
  source: {fontSize: 12, color: colors.subText, marginTop: 12},
  sectionTitle: {fontSize: 21, fontWeight: '800', color: colors.text, marginBottom: 8},
  sectionDesc: {fontSize: 13, color: colors.subText, lineHeight: 20, marginTop: 6},
  chipWrap: {flexDirection: 'row', flexWrap: 'wrap', marginTop: 14},
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: {backgroundColor: colors.primary, borderColor: colors.primary},
  chipText: {fontSize: 13, color: colors.text, fontWeight: '700'},
  chipTextActive: {color: '#fff'},
  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {fontSize: 17, fontWeight: '800', color: colors.text},
  timeRow: {flexDirection: 'row', gap: 12, marginTop: 8},
  timeInputBox: {flex: 1},
  bottomNav: {
    flexDirection: 'row',
    paddingVertical: 9,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  navItem: {flex: 1, alignItems: 'center', paddingVertical: 9},
  navText: {fontSize: 13, color: colors.subText, fontWeight: '700'},
  navTextActive: {color: colors.primary},
});
