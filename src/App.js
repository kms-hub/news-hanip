import React, {useMemo, useState} from 'react';
import {
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const allNews = [
  {
    id: 'ai-1',
    category: 'AI',
    keyword: '?멸났吏??,
    title: '?앹꽦??AI, ??숈깮 ?숈뒿 ?꾧뎄濡??뺤궛',
    summary:
      '?앹꽦??AI媛 ?먮즺 ?뺣━, ?붿빟, 肄붾뱶 ?숈뒿 ???ㅼ뼇???숈뒿 蹂댁“ ?꾧뎄濡??쒖슜?섍퀬 ?덉뒿?덈떎. ?댁뒪?쒖엯? ?듭떖 ?댁슜??吏㏐쾶 ?뺣━??留ㅼ씪 ?꾩묠 ?뺤씤?????덈룄濡??뺤뒿?덈떎.',
    source: '?댁뒪?쒖엯 ?몄쭛遺',
    url: 'https://news.google.com/search?q=%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5',
  },
  {
    id: 'semiconductor-1',
    category: '?곗뾽',
    keyword: '諛섎룄泥?,
    title: '諛섎룄泥??곗뾽, AI ?섏슂? ?④퍡 ?깆옣??,
    summary:
      'AI ?쒕쾭? 怨좎꽦??而댄벂???섏슂媛 ?섎㈃??諛섎룄泥??곗뾽??以묒슂?깆씠 而ㅼ?怨??덉뒿?덈떎. 愿??湲곗뾽怨?湲곗닠 ?숉뼢??袁몄????뺤씤?섎뒗 寃껋씠 以묒슂?⑸땲??',
    source: '?댁뒪?쒖엯 ?몄쭛遺',
    url: 'https://news.google.com/search?q=%EB%B0%98%EB%8F%84%EC%B2%B4',
  },
  {
    id: 'student-1',
    category: '泥?뀈',
    keyword: '??숈깮',
    title: '??숈깮???꾪븳 ?뺤콉 ?뺣낫 ?뺤씤 ?꾩슂',
    summary:
      '?ν븰湲? 泥?뀈 吏?먭툑, 臾명솕?⑥뒪 ????숈깮???쒖슜?????덈뒗 ?뺤콉???ㅼ뼇?⑸땲?? 愿???ㅼ썙?쒕? ?ㅼ젙???꾩슂???뺣낫瑜?鍮좊Ⅴ寃??뺤씤?????덉뒿?덈떎.',
    source: '?댁뒪?쒖엯 ?몄쭛遺',
    url: 'https://news.google.com/search?q=%EB%8C%80%ED%95%99%EC%83%9D+%EC%A7%80%EC%9B%90%EC%A0%95%EC%B1%85',
  },
  {
    id: 'global-1',
    category: '援?젣',
    keyword: '誘멸뎅',
    title: '援?젣 ?댁뒪, 援?궡 寃쎌젣? 湲곗닠 ?곗뾽???곹뼢',
    summary:
      '誘멸뎅??湲덈━, 湲곗닠 洹쒖젣, ?곗뾽 ?뺤콉? 援?궡 湲곗뾽怨?痍⑥뾽 ?쒖옣?먮룄 ?곹뼢??以????덉뒿?덈떎. 二쇱슂 援?젣 ?댁뒋瑜?吏㏐쾶 ?뺤씤???먮쫫???뚯븙?????덉뒿?덈떎.',
    source: '?댁뒪?쒖엯 ?몄쭛遺',
    url: 'https://news.google.com/search?q=%EB%AF%B8%EA%B5%AD+%EA%B8%B0%EC%88%A0+%EC%82%B0%EC%97%85',
  },
];

const recommendedKeywords = ['?멸났吏??, '諛섎룄泥?, '??숈깮', '誘멸뎅'];

export default function App() {
  const [screen, setScreen] = useState('home');
  const [keywords, setKeywords] = useState(['?멸났吏??, '諛섎룄泥?, '??숈깮']);
  const [keywordInput, setKeywordInput] = useState(keywords.join(', '));
  const [favorites, setFavorites] = useState([]);
  const [refreshCount, setRefreshCount] = useState(0);

  const visibleNews = useMemo(() => {
    const filtered = allNews.filter(item => keywords.includes(item.keyword));
    const list = filtered.length > 0 ? filtered : allNews;
    return refreshCount % 2 === 0 ? list : [...list].reverse();
  }, [keywords, refreshCount]);

  const toggleKeyword = keyword => {
    const next = keywords.includes(keyword)
      ? keywords.filter(item => item !== keyword)
      : [...keywords, keyword];
    setKeywords(next);
    setKeywordInput(next.join(', '));
  };

  const saveKeywords = () => {
    const next = keywordInput
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);

    if (next.length === 0) {
      Alert.alert('?ㅼ썙???뺤씤', '?ㅼ썙?쒕? 1媛??댁긽 ?낅젰??二쇱꽭??');
      return;
    }

    setKeywords(next);
    setScreen('home');
    Alert.alert('????꾨즺', '愿???ㅼ썙?쒓? ??λ릺?덉뒿?덈떎.');
  };

  const toggleFavorite = id => {
    setFavorites(current =>
      current.includes(id) ? current.filter(item => item !== id) : [...current, id],
    );
  };

  const openUrl = async url => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('?닿린 ?ㅽ뙣', '?곸꽭湲곗궗 留곹겕瑜??????놁뒿?덈떎.');
    }
  };

  const newsForScreen =
    screen === 'favorites'
      ? allNews.filter(item => favorites.includes(item.id))
      : visibleNews;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>?댁뒪?쒖엯</Text>
          <Text style={styles.title}>
            {screen === 'home'
              ? '?ㅻ뒛???댁뒪 ?붿빟'
              : screen === 'keywords'
                ? '?ㅼ썙???ㅼ젙'
                : '利먭꺼李얘린'}
          </Text>
        </View>
        <Text style={styles.dateText}>
          {new Date().toLocaleDateString('ko-KR', {
            month: 'long',
            day: 'numeric',
            weekday: 'short',
          })}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {screen === 'home' && (
          <View style={styles.heroCard}>
            <Text style={styles.heroTitle}>留ㅼ씪 ?꾩묠 ?댁뒪瑜??쒖엯 ?ш린濡?/Text>
            <Text style={styles.heroDesc}>
              愿???ㅼ썙?쒖뿉 留욌뒗 二쇱슂 ?댁뒪瑜?吏㏐쾶 ?붿빟??蹂댁뿬二쇰뒗 Android ?깆엯?덈떎.
            </Text>
            <TouchableOpacity
              style={styles.whiteButton}
              onPress={() => setRefreshCount(value => value + 1)}>
              <Text style={styles.whiteButtonText}>?붿빟 ?덈줈怨좎묠</Text>
            </TouchableOpacity>
          </View>
        )}

        {screen === 'keywords' ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>愿???ㅼ썙??/Text>
            <Text style={styles.description}>
              ?쇳몴濡?援щ텇?댁꽌 吏곸젒 ?낅젰?섍굅??異붿쿇 ?ㅼ썙?쒕? ?좏깮?섏꽭??
            </Text>
            <TextInput
              value={keywordInput}
              onChangeText={setKeywordInput}
              multiline
              style={styles.input}
              placeholder="?? ?멸났吏?? 諛섎룄泥? ??숈깮"
            />

            <View style={styles.chipWrap}>
              {recommendedKeywords.map(keyword => (
                <TouchableOpacity
                  key={keyword}
                  style={[
                    styles.chip,
                    keywords.includes(keyword) && styles.chipActive,
                  ]}
                  onPress={() => toggleKeyword(keyword)}>
                  <Text
                    style={[
                      styles.chipText,
                      keywords.includes(keyword) && styles.chipTextActive,
                    ]}>
                    {keyword}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={saveKeywords}>
              <Text style={styles.primaryButtonText}>?ㅼ썙?????/Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {newsForScreen.length === 0 ? (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>??ν븳 ?댁뒪媛 ?놁뒿?덈떎</Text>
                <Text style={styles.description}>
                  ???붾㈃?먯꽌 蹂꾪몴瑜??뚮윭 ?댁뒪瑜?利먭꺼李얘린??異붽??섏꽭??
                </Text>
              </View>
            ) : (
              newsForScreen.map(item => (
                <View key={item.id} style={styles.newsCard}>
                  <View style={styles.row}>
                    <Text style={styles.badge}>{item.category}</Text>
                    <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                      <Text style={styles.star}>
                        {favorites.includes(item.id) ? '?? : '??}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.newsTitle}>{item.title}</Text>
                  <Text style={styles.newsSummary}>{item.summary}</Text>
                  <Text style={styles.source}>{item.source}</Text>
                  <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => openUrl(item.url)}>
                    <Text style={styles.linkButtonText}>?곸꽭湲곗궗 ?닿린</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        {[
          ['home', '??],
          ['keywords', '?ㅼ썙??],
          ['favorites', '利먭꺼李얘린'],
        ].map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={styles.navItem}
            onPress={() => setScreen(key)}>
            <Text style={[styles.navText, screen === key && styles.navTextActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#F8FAFC'},
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appName: {fontSize: 14, fontWeight: '800', color: '#2563EB'},
  title: {fontSize: 24, fontWeight: '800', color: '#111827', marginTop: 4},
  dateText: {fontSize: 12, color: '#6B7280'},
  content: {padding: 16, paddingBottom: 32},
  heroCard: {
    backgroundColor: '#2563EB',
    borderRadius: 22,
    padding: 20,
    marginBottom: 14,
  },
  heroTitle: {fontSize: 22, fontWeight: '800', color: '#FFFFFF'},
  heroDesc: {fontSize: 14, color: '#E0EAFF', lineHeight: 21, marginTop: 8},
  whiteButton: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
  },
  whiteButtonText: {fontSize: 15, fontWeight: '800', color: '#1D4ED8'},
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {fontSize: 20, fontWeight: '800', color: '#111827'},
  description: {fontSize: 14, color: '#6B7280', lineHeight: 21, marginTop: 8},
  input: {
    marginTop: 14,
    minHeight: 90,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F3F4F6',
    padding: 14,
    fontSize: 15,
    textAlignVertical: 'top',
  },
  chipWrap: {flexDirection: 'row', flexWrap: 'wrap', marginTop: 14},
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: {backgroundColor: '#2563EB', borderColor: '#2563EB'},
  chipText: {fontSize: 13, fontWeight: '700', color: '#374151'},
  chipTextActive: {color: '#FFFFFF'},
  primaryButton: {
    marginTop: 12,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {color: '#FFFFFF', fontWeight: '800', fontSize: 15},
  newsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  row: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  badge: {
    backgroundColor: '#EEF2FF',
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  star: {fontSize: 28, color: '#F59E0B'},
  newsTitle: {fontSize: 18, fontWeight: '800', color: '#111827', marginTop: 10},
  newsSummary: {fontSize: 14, color: '#374151', lineHeight: 21, marginTop: 8},
  source: {fontSize: 12, color: '#6B7280', marginTop: 10},
  linkButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  linkButtonText: {color: '#2563EB', fontWeight: '800'},
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 8,
  },
  navItem: {flex: 1, alignItems: 'center', paddingVertical: 9},
  navText: {fontSize: 13, color: '#6B7280', fontWeight: '700'},
  navTextActive: {color: '#2563EB'},
});