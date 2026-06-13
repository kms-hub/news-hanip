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

const ko = {
  appName: '\uB274\uC2A4\uD55C\uC785',
  homeTitle: '\uC624\uB298\uC758 \uB274\uC2A4 \uC694\uC57D',
  keywordTitle: '\uD0A4\uC6CC\uB4DC \uC124\uC815',
  favoriteTitle: '\uC990\uACA8\uCC3E\uAE30',
  heroTitle: '\uB9E4\uC77C \uC544\uCE68 \uB274\uC2A4\uB97C \uD55C\uC785 \uD06C\uAE30\uB85C',
  heroDesc: '\uAD00\uC2EC \uD0A4\uC6CC\uB4DC\uC5D0 \uB9DE\uB294 \uC8FC\uC694 \uB274\uC2A4\uB97C \uC9E7\uAC8C \uC694\uC57D\uD574 \uBCF4\uC5EC\uC8FC\uB294 Android \uC571\uC785\uB2C8\uB2E4.',
  refresh: '\uC694\uC57D \uC0C8\uB85C\uACE0\uCE68',
  keywords: '\uAD00\uC2EC \uD0A4\uC6CC\uB4DC',
  keywordDesc: '\uC27C\uD45C\uB85C \uAD6C\uBD84\uD574\uC11C \uC9C1\uC811 \uC785\uB825\uD558\uAC70\uB098 \uCD94\uCC9C \uD0A4\uC6CC\uB4DC\uB97C \uC120\uD0DD\uD558\uC138\uC694.',
  placeholder: '\uC608: \uC778\uACF5\uC9C0\uB2A5, \uBC18\uB3C4\uCCB4, \uB300\uD559\uC0DD',
  saveKeyword: '\uD0A4\uC6CC\uB4DC \uC800\uC7A5',
  noFavorite: '\uC800\uC7A5\uD55C \uB274\uC2A4\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4',
  noFavoriteDesc: '\uD648 \uD654\uBA74\uC5D0\uC11C \uBCC4\uD45C\uB97C \uB20C\uB7EC \uB274\uC2A4\uB97C \uC990\uACA8\uCC3E\uAE30\uC5D0 \uCD94\uAC00\uD558\uC138\uC694.',
  openArticle: '\uC0C1\uC138\uAE30\uC0AC \uC5F4\uAE30',
  home: '\uD648',
  keyword: '\uD0A4\uC6CC\uB4DC',
  favorite: '\uC990\uACA8\uCC3E\uAE30',
  saveDoneTitle: '\uC800\uC7A5 \uC644\uB8CC',
  saveDoneMsg: '\uAD00\uC2EC \uD0A4\uC6CC\uB4DC\uAC00 \uC800\uC7A5\uB418\uC5C8\uC2B5\uB2C8\uB2E4.',
  checkKeywordTitle: '\uD0A4\uC6CC\uB4DC \uD655\uC778',
  checkKeywordMsg: '\uD0A4\uC6CC\uB4DC\uB97C 1\uAC1C \uC774\uC0C1 \uC785\uB825\uD574 \uC8FC\uC138\uC694.',
  openFailTitle: '\uC5F4\uAE30 \uC2E4\uD328',
  openFailMsg: '\uC0C1\uC138\uAE30\uC0AC \uB9C1\uD06C\uB97C \uC5F4 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.',
};

const allNews = [
  {
    id: 'ai-1',
    category: 'AI',
    keyword: '\uC778\uACF5\uC9C0\uB2A5',
    title: '\uC0DD\uC131\uD615 AI, \uB300\uD559\uC0DD \uD559\uC2B5 \uB3C4\uAD6C\uB85C \uD655\uC0B0',
    summary:
      '\uC0DD\uC131\uD615 AI\uAC00 \uC790\uB8CC \uC815\uB9AC, \uC694\uC57D, \uCF54\uB4DC \uD559\uC2B5 \uB4F1 \uB2E4\uC591\uD55C \uD559\uC2B5 \uBCF4\uC870 \uB3C4\uAD6C\uB85C \uD65C\uC6A9\uB418\uACE0 \uC788\uC2B5\uB2C8\uB2E4.',
    source: '\uB274\uC2A4\uD55C\uC785 \uD3B8\uC9D1\uBD80',
    url: 'https://news.google.com/search?q=AI',
  },
  {
    id: 'semiconductor-1',
    category: '\uC0B0\uC5C5',
    keyword: '\uBC18\uB3C4\uCCB4',
    title: '\uBC18\uB3C4\uCCB4 \uC0B0\uC5C5, AI \uC218\uC694\uC640 \uD568\uAED8 \uC131\uC7A5\uC138',
    summary:
      'AI \uC11C\uBC84\uC640 \uACE0\uC131\uB2A5 \uCEF4\uD4E8\uD305 \uC218\uC694\uAC00 \uB298\uBA74\uC11C \uBC18\uB3C4\uCCB4 \uC0B0\uC5C5\uC758 \uC911\uC694\uC131\uC774 \uCEE4\uC9C0\uACE0 \uC788\uC2B5\uB2C8\uB2E4.',
    source: '\uB274\uC2A4\uD55C\uC785 \uD3B8\uC9D1\uBD80',
    url: 'https://news.google.com/search?q=semiconductor',
  },
  {
    id: 'student-1',
    category: '\uCCAD\uB144',
    keyword: '\uB300\uD559\uC0DD',
    title: '\uB300\uD559\uC0DD\uC744 \uC704\uD55C \uC815\uCC45 \uC815\uBCF4 \uD655\uC778 \uD544\uC694',
    summary:
      '\uC7A5\uD559\uAE08, \uCCAD\uB144 \uC9C0\uC6D0\uAE08, \uBB38\uD654\uD328\uC2A4 \uB4F1 \uB300\uD559\uC0DD\uC774 \uD65C\uC6A9\uD560 \uC218 \uC788\uB294 \uC815\uCC45\uC744 \uBE60\uB974\uAC8C \uD655\uC778\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.',
    source: '\uB274\uC2A4\uD55C\uC785 \uD3B8\uC9D1\uBD80',
    url: 'https://news.google.com/search?q=student+policy',
  },
  {
    id: 'global-1',
    category: '\uAD6D\uC81C',
    keyword: '\uBBF8\uAD6D',
    title: '\uAD6D\uC81C \uB274\uC2A4, \uAD6D\uB0B4 \uACBD\uC81C\uC640 \uAE30\uC220 \uC0B0\uC5C5\uC5D0 \uC601\uD5A5',
    summary:
      '\uBBF8\uAD6D\uC758 \uAE08\uB9AC, \uAE30\uC220 \uADDC\uC81C, \uC0B0\uC5C5 \uC815\uCC45\uC740 \uAD6D\uB0B4 \uAE30\uC5C5\uACFC \uCDE8\uC5C5 \uC2DC\uC7A5\uC5D0\uB3C4 \uC601\uD5A5\uC744 \uC904 \uC218 \uC788\uC2B5\uB2C8\uB2E4.',
    source: '\uB274\uC2A4\uD55C\uC785 \uD3B8\uC9D1\uBD80',
    url: 'https://news.google.com/search?q=us+technology+industry',
  },
];

const recommendedKeywords = [
  '\uC778\uACF5\uC9C0\uB2A5',
  '\uBC18\uB3C4\uCCB4',
  '\uB300\uD559\uC0DD',
  '\uBBF8\uAD6D',
];

export default function App() {
  const [screen, setScreen] = useState('home');
  const [keywords, setKeywords] = useState([
    '\uC778\uACF5\uC9C0\uB2A5',
    '\uBC18\uB3C4\uCCB4',
    '\uB300\uD559\uC0DD',
  ]);
  const [keywordInput, setKeywordInput] = useState(keywords.join(', '));
  const [favorites, setFavorites] = useState([]);
  const [refreshCount, setRefreshCount] = useState(0);

  const visibleNews = useMemo(() => {
    const filtered = allNews.filter(item => keywords.includes(item.keyword));
    const list = filtered.length > 0 ? filtered : allNews;
    return refreshCount % 2 === 0 ? list : [...list].reverse();
  }, [keywords, refreshCount]);

  const title =
    screen === 'home'
      ? ko.homeTitle
      : screen === 'keywords'
        ? ko.keywordTitle
        : ko.favoriteTitle;

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
      Alert.alert(ko.checkKeywordTitle, ko.checkKeywordMsg);
      return;
    }

    setKeywords(next);
    setScreen('home');
    Alert.alert(ko.saveDoneTitle, ko.saveDoneMsg);
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
      Alert.alert(ko.openFailTitle, ko.openFailMsg);
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
          <Text style={styles.appName}>{ko.appName}</Text>
          <Text style={styles.title}>{title}</Text>
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
            <Text style={styles.heroTitle}>{ko.heroTitle}</Text>
            <Text style={styles.heroDesc}>{ko.heroDesc}</Text>
            <TouchableOpacity
              style={styles.whiteButton}
              onPress={() => setRefreshCount(value => value + 1)}>
              <Text style={styles.whiteButtonText}>{ko.refresh}</Text>
            </TouchableOpacity>
          </View>
        )}

        {screen === 'keywords' ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>{ko.keywords}</Text>
            <Text style={styles.description}>{ko.keywordDesc}</Text>
            <TextInput
              value={keywordInput}
              onChangeText={setKeywordInput}
              multiline
              style={styles.input}
              placeholder={ko.placeholder}
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
              <Text style={styles.primaryButtonText}>{ko.saveKeyword}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {newsForScreen.length === 0 ? (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>{ko.noFavorite}</Text>
                <Text style={styles.description}>{ko.noFavoriteDesc}</Text>
              </View>
            ) : (
              newsForScreen.map(item => (
                <View key={item.id} style={styles.newsCard}>
                  <View style={styles.row}>
                    <Text style={styles.badge}>{item.category}</Text>
                    <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                      <Text style={styles.star}>
                        {favorites.includes(item.id) ? '*' : '+'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.newsTitle}>{item.title}</Text>
                  <Text style={styles.newsSummary}>{item.summary}</Text>
                  <Text style={styles.source}>{item.source}</Text>
                  <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => openUrl(item.url)}>
                    <Text style={styles.linkButtonText}>{ko.openArticle}</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        {[
          ['home', ko.home],
          ['keywords', ko.keyword],
          ['favorites', ko.favorite],
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
  star: {fontSize: 26, color: '#F59E0B', fontWeight: '900'},
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