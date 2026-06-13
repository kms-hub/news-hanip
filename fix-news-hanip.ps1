# fix-news-hanip.ps1
# 실행 위치: C:\Users\SAMSUNG\news-hanip
# PowerShell에서 다음처럼 실행:
# powershell -ExecutionPolicy Bypass -File .\fix-news-hanip.ps1

function Save-File($Path, $Content) {
    $FullPath = Join-Path (Get-Location) $Path
    $Dir = Split-Path $FullPath
    New-Item -ItemType Directory -Force $Dir | Out-Null
    [System.IO.File]::WriteAllText($FullPath, $Content, [System.Text.UTF8Encoding]::new($false))
}

Save-File "android/build.gradle" @'
buildscript {
    ext {
        buildToolsVersion = "35.0.0"
        minSdkVersion = 24
        compileSdkVersion = 35
        targetSdkVersion = 35
        ndkVersion = "26.1.10909125"
        kotlinVersion = "1.9.24"
    }

    repositories {
        google()
        mavenCentral()
    }

    dependencies {
        classpath("com.android.tools.build:gradle:8.7.3")
        classpath("com.facebook.react:react-native-gradle-plugin")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion")
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}
'@

Save-File "android/app/build.gradle" @'
plugins {
    id "com.android.application"
    id "com.facebook.react"
}

react {
    autolinkLibrariesWithApp()

    // debug APK도 Metro 없이 실행되도록 JS bundle을 포함시킨다.
    // 기본값은 ["debug"]라서 debug APK에 bundle이 빠질 수 있다.
    debuggableVariants = []
}

def enableProguardInReleaseBuilds = false
def jscFlavor = "io.github.react-native-community:jsc-android:2026004.+"
def enableHermes = (findProperty("hermesEnabled") ?: "true").toBoolean()

android {
    namespace "com.newshanip"
    compileSdk rootProject.ext.compileSdkVersion

    defaultConfig {
        applicationId "com.newshanip"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 1
        versionName "1.0"
    }

    buildTypes {
        debug {
        }

        release {
            signingConfig signingConfigs.debug
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}

dependencies {
    implementation("com.facebook.react:react-android")
    implementation("androidx.core:core:1.15.0")

    if (enableHermes) {
        implementation("com.facebook.react:hermes-android")
    } else {
        implementation jscFlavor
    }
}
'@

Save-File "android/gradle.properties" @'
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
org.gradle.daemon=false
org.gradle.parallel=false
newArchEnabled=false
hermesEnabled=true
'@

Save-File ".github/workflows/android-apk.yml" @'
name: Build Android APK

on:
  workflow_dispatch:
  push:
    branches: [ main, master ]

jobs:
  build-apk:
    runs-on: ubuntu-latest

    env:
      GRADLE_OPTS: "-Dorg.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m -Dfile.encoding=UTF-8"

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Set up Java
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 17

      - name: Set up Android SDK
        uses: android-actions/setup-android@v3

      - name: Set up Gradle
        uses: gradle/actions/setup-gradle@v4
        with:
          gradle-version: 8.13

      - name: Install npm dependencies
        run: npm install

      - name: Build debug APK
        run: cd android && gradle :app:assembleDebug --no-daemon --stacktrace

      - name: Upload APK artifact
        uses: actions/upload-artifact@v4
        with:
          name: news-hanip-debug-apk
          path: android/app/build/outputs/apk/debug/app-debug.apk
'@

Save-File "android/app/src/main/AndroidManifest.xml" @'
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <application
        android:name=".MainApplication"
        android:allowBackup="false"
        android:icon="@drawable/ic_notification"
        android:label="@string/app_name"
        android:roundIcon="@drawable/ic_notification"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">

        <activity
            android:name=".MainActivity"
            android:configChanges="keyboard|keyboardHidden|orientation|screenLayout|screenSize|smallestScreenSize|uiMode"
            android:exported="true"
            android:label="@string/app_name"
            android:launchMode="singleTask"
            android:windowSoftInputMode="adjustResize">

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

        </activity>

        <receiver
            android:name=".NotificationReceiver"
            android:exported="false" />

    </application>

</manifest>
'@

Save-File "android/app/src/main/res/values/strings.xml" @'
<resources>
    <string name="app_name">뉴스한입</string>
</resources>
'@

Save-File "android/app/src/main/res/values/styles.xml" @'
<resources>
    <style name="AppTheme" parent="android:style/Theme.Material.Light.NoActionBar">
        <item name="android:windowNoTitle">true</item>
        <item name="android:windowActionBar">false</item>
        <item name="android:windowLightStatusBar">true</item>
        <item name="android:statusBarColor">#F8FAFC</item>
        <item name="android:navigationBarColor">#FFFFFF</item>
    </style>
</resources>
'@

Save-File "android/app/src/main/res/drawable/ic_notification.xml" @'
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">

    <path
        android:fillColor="#2563EB"
        android:pathData="M4,4h16a2,2 0,0 1,2 2v11a2,2 0,0 1,-2 2H7l-5,3V6a2,2 0,0 1,2 -2z" />

    <path
        android:fillColor="#FFFFFF"
        android:pathData="M7,8h10v2H7zM7,12h7v2H7z" />
</vector>
'@

Save-File "src/App.js" @'
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
    keyword: '인공지능',
    title: '생성형 AI, 대학생 학습 도구로 확산',
    summary:
      '생성형 AI가 자료 정리, 요약, 코드 학습 등 다양한 학습 보조 도구로 활용되고 있습니다. 뉴스한입은 핵심 내용을 짧게 정리해 매일 아침 확인할 수 있도록 돕습니다.',
    source: '뉴스한입 편집부',
    url: 'https://news.google.com/search?q=%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5',
  },
  {
    id: 'semiconductor-1',
    category: '산업',
    keyword: '반도체',
    title: '반도체 산업, AI 수요와 함께 성장세',
    summary:
      'AI 서버와 고성능 컴퓨팅 수요가 늘면서 반도체 산업의 중요성이 커지고 있습니다. 관련 기업과 기술 동향을 꾸준히 확인하는 것이 중요합니다.',
    source: '뉴스한입 편집부',
    url: 'https://news.google.com/search?q=%EB%B0%98%EB%8F%84%EC%B2%B4',
  },
  {
    id: 'student-1',
    category: '청년',
    keyword: '대학생',
    title: '대학생을 위한 정책 정보 확인 필요',
    summary:
      '장학금, 청년 지원금, 문화패스 등 대학생이 활용할 수 있는 정책이 다양합니다. 관심 키워드를 설정해 필요한 정보를 빠르게 확인할 수 있습니다.',
    source: '뉴스한입 편집부',
    url: 'https://news.google.com/search?q=%EB%8C%80%ED%95%99%EC%83%9D+%EC%A7%80%EC%9B%90%EC%A0%95%EC%B1%85',
  },
  {
    id: 'global-1',
    category: '국제',
    keyword: '미국',
    title: '국제 뉴스, 국내 경제와 기술 산업에 영향',
    summary:
      '미국의 금리, 기술 규제, 산업 정책은 국내 기업과 취업 시장에도 영향을 줄 수 있습니다. 주요 국제 이슈를 짧게 확인해 흐름을 파악할 수 있습니다.',
    source: '뉴스한입 편집부',
    url: 'https://news.google.com/search?q=%EB%AF%B8%EA%B5%AD+%EA%B8%B0%EC%88%A0+%EC%82%B0%EC%97%85',
  },
];

const recommendedKeywords = ['인공지능', '반도체', '대학생', '미국'];

export default function App() {
  const [screen, setScreen] = useState('home');
  const [keywords, setKeywords] = useState(['인공지능', '반도체', '대학생']);
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
      Alert.alert('키워드 확인', '키워드를 1개 이상 입력해 주세요.');
      return;
    }

    setKeywords(next);
    setScreen('home');
    Alert.alert('저장 완료', '관심 키워드가 저장되었습니다.');
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
      Alert.alert('열기 실패', '상세기사 링크를 열 수 없습니다.');
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
          <Text style={styles.appName}>뉴스한입</Text>
          <Text style={styles.title}>
            {screen === 'home'
              ? '오늘의 뉴스 요약'
              : screen === 'keywords'
                ? '키워드 설정'
                : '즐겨찾기'}
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
            <Text style={styles.heroTitle}>매일 아침 뉴스를 한입 크기로</Text>
            <Text style={styles.heroDesc}>
              관심 키워드에 맞는 주요 뉴스를 짧게 요약해 보여주는 Android 앱입니다.
            </Text>
            <TouchableOpacity
              style={styles.whiteButton}
              onPress={() => setRefreshCount(value => value + 1)}>
              <Text style={styles.whiteButtonText}>요약 새로고침</Text>
            </TouchableOpacity>
          </View>
        )}

        {screen === 'keywords' ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>관심 키워드</Text>
            <Text style={styles.description}>
              쉼표로 구분해서 직접 입력하거나 추천 키워드를 선택하세요.
            </Text>
            <TextInput
              value={keywordInput}
              onChangeText={setKeywordInput}
              multiline
              style={styles.input}
              placeholder="예: 인공지능, 반도체, 대학생"
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
              <Text style={styles.primaryButtonText}>키워드 저장</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {newsForScreen.length === 0 ? (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>저장한 뉴스가 없습니다</Text>
                <Text style={styles.description}>
                  홈 화면에서 별표를 눌러 뉴스를 즐겨찾기에 추가하세요.
                </Text>
              </View>
            ) : (
              newsForScreen.map(item => (
                <View key={item.id} style={styles.newsCard}>
                  <View style={styles.row}>
                    <Text style={styles.badge}>{item.category}</Text>
                    <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                      <Text style={styles.star}>
                        {favorites.includes(item.id) ? '★' : '☆'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.newsTitle}>{item.title}</Text>
                  <Text style={styles.newsSummary}>{item.summary}</Text>
                  <Text style={styles.source}>{item.source}</Text>
                  <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => openUrl(item.url)}>
                    <Text style={styles.linkButtonText}>상세기사 열기</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        {[
          ['home', '홈'],
          ['keywords', '키워드'],
          ['favorites', '즐겨찾기'],
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
'@

Write-Host ""
Write-Host "수정 완료. 이제 아래 명령어를 실행하세요:"
Write-Host "git add ."
Write-Host "git commit -m `"Fix Android APK build settings`""
Write-Host "git push"
