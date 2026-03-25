# Conceptualization

## 1. Project title and student information

- Project Title: 뉴스한입
- Student No: 22212059
- Name: 김명섭
- E-mail: eigfid@naver.com

---

## 2. Revision history

| Revision date | Version # | Description | Author |

| 2026-03-25 | 1.0 | First draft | 김명섭 |

---

## 3. Business purpose

과제 주제를 고민하던 중, 문득 요즘 젊은 세대는 뉴스에 대한 관심이 예전 세대보다 많이 줄어든 것 같다고 생각했다.

나도 MZ세대로 살아가면서 휴대폰에 많이 의지하고 살아가는데, 그러한 휴대폰에는 너무나 많은 콘텐츠들이 존재하다 보니 자연스럽게 딱딱한 뉴스에는 크게 손이 가지 않게 된다.
이로 인해 결국 세상이 돌아가는 일에는 크게 관심을 가지지 않게 되어 사회에서 무슨 일이 있었는지 늦게 알게 되거나, 모르고 살아가게 되었다. 
또한 단순히 사회에 대한 무관심이 늘어날 뿐만 아니라 뉴스를 보는 사람과의 소통 어려움, 배경지식 부족 등 여러 문제와도 직결된다는 것을 직접 경험하기도 했다.

그래서 사용자가 직접 뉴스를 찾지 않아도, 매일 아침 전날 있었던 주요 뉴스들을 짧게 요약해서 알림으로 알려주는 서비스를 생각하게 되었다.  
이 프로젝트를 통해 사용자들은 아침에 출근하거나 등교하는 시간을 활용하여 짧은 시간만 투자해도 중요한 이슈를 확인할 수 있고, 
자연스럽게 뉴스와 사회 문제에 대한 관심도 높일 수 있을 것이라고 생각한다.

이 어플리케이션의 이름은 '뉴스한입'이고, 말 그대로 뉴스를 길게 다 읽는 것이 아니라 핵심만 한입처럼 가볍게 볼 수 있게 하여 현대인들이 뉴스에 관심을 가지게 하고 
더 나아가 사회에 관심을 가지게 하는 것이 목적이다.

---

## 4. System context diagram

```text
                                    Provide News Articles,
                                    Provide Category Data,
                                    Provide Article Contents
                                    +----------------------+
                                    |   News API Service   |
                                    +----------------------+
Login Result, Sign Up Result,                  |
Personalized Brief News,                       |
Full Article Link,                             v                Send Notification Request,
Saved News List                                                 Schedule Morning Alert        
+----------------------+   < ㅡ ㅡ   +----------------------+   ㅡ ㅡ >   +----------------------+
|        User          |             |       System         |             | Android Notification |
+----------------------+   ㅡ ㅡ >   +----------------------+   < ㅡ ㅡ   +----------------------+
Login, Sign Up, Select News Category,                           Open App by Notification,
Set Notification Time, Check Brief News,       ^                Notification Response
Read Full Article, Check Saved News            |
                                               |
                                    +----------------------+
                                    |   Summary Function   |
                                    +----------------------+
                                        Summarized News,
                                        Extracted Keywords
```
- Login                         로그인
- Sign Up                       회원가입
- Select News Category          뉴스 카테고리 선택
- Set Notification Time         알림 시간 설정
- Check Brief News              요약 뉴스 확인
- Read Full Article             원문 기사 보기
- Check Saved News              저장된 뉴스 확인

- Login Result                  로그인 결과 확인
- Sign Up Result                회원가입 결과 확인
- Personalized Brief News       맞춤형 뉴스 요약 제공
- Full Article Link             원문 기사 링크 제공
- Saved News List               저장된 뉴스 목록 제공

- Provide News Articles         뉴스 기사 제공
- Provide Category Data         뉴스 카테고리 정보 제공
- Provide Article Contents      기사 내용 제공

- Send Notification Request     알림 전송 요청
- Schedule Morning Alert        아침 알림 예약
- Open App by Notification      알림을 통해 앱 실행
- Notification Response         알림 반응 처리

- Summarized News               뉴스 요약 제공
- Extracted Keywords            핵심 키워드 추출

## 5. Use case list

### 1) Sign Up
**Actor** 
User  
**Description**  
뉴스한입 앱을 처음 사용하는 사용자가 회원가입을 한다. 회원가입을 통해 기본 계정을 생성하고, 이후 로그인하여 개인 맞춤 뉴스 서비스를 사용할 수 있다.

### 2) Login
**Actor** 
User  
**Description**  
회원가입이 완료된 사용자가 로그인한다. 로그인한 사용자는 자신의 관심 뉴스 카테고리와 알림 설정을 저장하고 사용할 수 있다.

### 3) Select News Category
**Actor** 
User  
**Description**  
사용자가 정치, 경제, 사회, IT 등 자신이 관심 있는 뉴스 카테고리를 선택한다. 시스템은 이후 선택된 카테고리를 바탕으로 맞춤형 뉴스 요약을 제공한다.

### 4) Set Notification Time
**Actor** 
User  
**Description**  
사용자가 아침 뉴스 알림을 받을 시간을 설정한다. 시스템은 사용자가 설정한 시간에 맞추어 뉴스 요약 알림을 보낸다.

### 5) Check Brief News
**Actor** 
User  
**Description**  
사용자가 앱에서 제공하는 요약 뉴스를 확인한다. 시스템은 뉴스 기사 전체가 아니라 핵심만 짧게 정리한 내용을 보여준다.

### 6) Read Full Article
**Actor** 
User  
**Description**  
사용자가 요약된 뉴스만으로 부족하다고 느낄 경우 원문 기사 링크를 통해 전체 내용을 확인한다.

### 7) Check Saved News
**Actor** 
User  
**Description**  
사용자가 이전에 저장해 둔 뉴스나 다시 보고 싶은 뉴스를 확인한다. 저장된 뉴스는 앱 내에서 다시 열람할 수 있다.

### 8) Receive Morning Notification
**Actor** 
User  
**Description**  
사용자는 아침에 시스템이 전송하는 뉴스 요약 알림을 받는다. 이를 통해 사용자는 직접 뉴스를 찾지 않아도 주요 이슈를 빠르게 확인할 수 있다.

### 9) Request News Data
**Actor** 
System  
**Description**  
시스템은 외부 News API Service에 뉴스 데이터를 요청한다. 요청된 데이터는 최신 기사와 카테고리 정보 등을 포함한다.

### 10) Provide News Articles
**Actor** 
News API Service  
**Description**  
외부 뉴스 API 서비스는 시스템에 뉴스 기사 목록을 제공한다. 시스템은 이를 기반으로 요약 대상 뉴스를 선별한다.

### 11) Provide Category Data
**Actor** 
News API Service  
**Description**  
외부 뉴스 API 서비스는 기사 카테고리 정보를 제공한다. 시스템은 이를 활용해 사용자의 관심 분야와 일치하는 뉴스를 분류한다.

### 12) Provide Article Contents
**Actor** 
News API Service  
**Description**  
외부 뉴스 API 서비스는 뉴스 기사 내용 또는 기사 요약에 필요한 데이터를 시스템에 제공한다.

### 13) Summarized News
**Actor** 
Summary Function  
**Description**  
요약 기능은 시스템이 전달한 기사 데이터를 바탕으로 핵심 내용을 짧게 정리하여 시스템에 반환한다.

### 14) Extracted Keywords
**Actor** 
Summary Function  
**Description**  
요약 기능은 기사에서 중요한 키워드를 추출하여 시스템에 전달한다. 시스템은 이를 통해 뉴스 내용을 더 효과적으로 분류하고 표시할 수 있다.

### 15) Send Notification Request
**Actor** 
System  
**Description**  
시스템은 안드로이드 알림 기능에 뉴스 알림 전송을 요청한다. 이 요청에는 요약 뉴스 내용과 알림 시간이 포함된다.

### 16) Schedule Morning Alert
**Actor** 
System  
**Description**  
시스템은 사용자가 설정한 시간을 기준으로 아침 뉴스 알림을 예약한다.

### 17) Open App by Notification
**Actor** 
Android Notification  
**Description**  
사용자가 뉴스 알림을 누르면 앱이 실행되고, 해당 뉴스 요약 화면으로 이동할 수 있다.

### 18) Notification Response
**Actor** 
Android Notification  
**Description**  
시스템은 사용자의 알림 반응을 처리한다. 사용자가 알림을 확인했는지, 앱으로 이동했는지 등을 바탕으로 필요한 화면을 제공한다.

---

## 6. Concept of operation

### 1) Sign Up
**Purpose**  
앱 사용을 위한 사용자 계정 생성

**Approach**  
사용자는 기본적인 회원 정보를 입력하여 회원가입을 진행한다. 회원가입이 완료되면 앱에서 로그인할 수 있는 계정이 생성된다.

**Dynamics**  
처음으로 앱을 사용하는 사용자가 서비스를 이용하고자 할 경우

**Goals**  
회원가입을 통해 개인 맞춤 뉴스 서비스를 이용할 수 있도록 한다.

### 2) Login
**Purpose**  
등록된 사용자의 시스템 접속

**Approach**  
사용자는 가입한 계정 정보로 로그인한다. 로그인 이후에는 관심 뉴스 카테고리 설정, 알림 시간 설정, 저장 뉴스 확인 등의 기능을 사용할 수 있다.

**Dynamics**  
등록된 사용자가 앱 기능을 이용하고자 할 경우

**Goals**  
로그인한 사용자에게 개인 맞춤형 기능을 제공한다.

### 3) Select News Category
**Purpose**  
사용자 관심 분야 설정

**Approach**  
사용자는 정치, 경제, 사회, IT 등 원하는 뉴스 카테고리를 선택한다. 선택된 정보는 이후 맞춤 뉴스 제공에 활용된다.

**Dynamics**  
사용자가 자신에게 필요한 뉴스만 받아보고 싶을 경우

**Goals**  
사용자의 관심 분야에 맞는 뉴스를 우선적으로 제공한다.

### 4) Set Notification Time
**Purpose**  
뉴스 알림 수신 시간 설정

**Approach**  
사용자는 아침 시간대 중 원하는 알림 시각을 지정한다. 시스템은 지정된 시간에 맞추어 요약 뉴스 알림을 전송한다.

**Dynamics**  
사용자가 원하는 시간에 맞춰 뉴스 알림을 받고자 할 경우

**Goals**  
사용자가 생활 패턴에 맞추어 편리하게 뉴스 알림을 받을 수 있도록 한다.

### 5) Check Brief News
**Purpose**  
짧게 요약된 뉴스 확인

**Approach**  
시스템은 수집된 뉴스 중 주요 내용을 짧게 정리하여 앱 화면에 보여준다. 사용자는 긴 기사 전체를 읽지 않아도 핵심 내용을 확인할 수 있다.

**Dynamics**  
사용자가 짧은 시간 안에 주요 뉴스를 확인하고자 할 경우

**Goals**  
뉴스 접근 부담을 줄이고 핵심 정보 확인을 쉽게 한다.

### 6) Read Full Article
**Purpose**  
원문 기사 내용 확인

**Approach**  
사용자는 요약 뉴스에서 제공되는 링크를 통해 원문 기사로 이동한다. 이를 통해 더 자세한 내용을 확인할 수 있다.

**Dynamics**  
사용자가 특정 뉴스에 대해 더 자세히 알고 싶을 경우

**Goals**  
짧은 요약과 상세 기사 확인을 모두 가능하게 한다.

### 7) Check Saved News
**Purpose**  
저장한 뉴스 재확인

**Approach**  
사용자는 앱에 저장해 둔 뉴스를 다시 불러와 확인한다. 저장 기능을 통해 관심 있는 뉴스를 나중에 다시 볼 수 있다.

**Dynamics**  
사용자가 이전에 본 뉴스를 다시 확인하고자 할 경우

**Goals**  
중요한 뉴스를 반복해서 확인할 수 있도록 한다.

### 8) Receive Morning Notification
**Purpose**  
아침 뉴스 알림 수신

**Approach**  
시스템은 사용자가 설정한 시간에 뉴스 요약 알림을 보낸다. 사용자는 알림을 통해 전날의 주요 이슈를 바로 확인할 수 있다.

**Dynamics**  
아침 시간에 별도로 뉴스를 찾지 않고도 주요 내용을 확인하고자 할 경우

**Goals**  
뉴스를 먼저 찾아보지 않아도 자연스럽게 접하도록 한다.

### 9) Request News Data
**Purpose**  
최신 뉴스 데이터 요청

**Approach**  
시스템은 외부 뉴스 API 서비스에 최신 기사 데이터를 요청한다. 요청된 데이터는 앱에서 사용할 뉴스의 기본 자료가 된다.

**Dynamics**  
새로운 뉴스 데이터를 불러와야 할 경우

**Goals**  
최신 뉴스를 안정적으로 수집한다.

### 10) Provide News Articles
**Purpose**  
기사 목록 제공

**Approach**  
뉴스 API 서비스는 시스템 요청에 따라 기사 목록을 전달한다. 시스템은 전달받은 기사 목록에서 필요한 뉴스를 선택한다.

**Dynamics**  
시스템이 기사 목록이 필요할 경우

**Goals**  
요약 및 분류를 위한 기사 목록을 제공한다.

### 11) Provide Category Data
**Purpose**  
카테고리 정보 제공

**Approach**  
뉴스 API 서비스는 기사와 함께 카테고리 관련 정보를 전달한다. 시스템은 이를 바탕으로 뉴스를 분류한다.

**Dynamics**  
사용자 관심 분야와 맞는 뉴스만 제공해야 할 경우

**Goals**  
뉴스를 효과적으로 카테고리별로 구분한다.

### 12) Provide Article Contents
**Purpose**  
기사 내용 제공

**Approach**  
뉴스 API 서비스는 기사 제목, 요약문, 본문 등 뉴스 내용을 시스템에 전달한다.

**Dynamics**  
시스템이 뉴스 요약을 생성해야 할 경우

**Goals**  
요약 기능에 필요한 기사 내용을 제공한다.

### 13) Summarized News
**Purpose**  
기사 요약 생성

**Approach**  
요약 기능은 기사 내용을 바탕으로 핵심만 짧게 정리한 요약문을 만든다. 생성된 요약문은 시스템에 전달되어 사용자에게 보여진다.

**Dynamics**  
긴 기사 내용을 짧게 줄여야 할 경우

**Goals**  
사용자가 부담 없이 뉴스를 확인할 수 있게 한다.

### 14) Extracted Keywords
**Purpose**  
핵심 키워드 추출

**Approach**  
요약 기능은 기사에서 중요한 단어나 핵심 주제를 추출한다. 이 정보는 뉴스 분류나 요약 이해를 돕는 데 사용된다.

**Dynamics**  
기사 핵심 내용을 더 명확하게 보여줄 필요가 있을 경우

**Goals**  
뉴스의 주제를 빠르게 파악할 수 있게 한다.

### 15) Send Notification Request
**Purpose**  
알림 전송 요청

**Approach**  
시스템은 안드로이드 알림 기능에 뉴스 알림 전송을 요청한다. 요청된 알림은 사용자의 기기에 표시된다.

**Dynamics**  
설정된 시간에 뉴스 알림을 보내야 할 경우

**Goals**  
사용자가 정해진 시간에 뉴스 요약을 받을 수 있도록 한다.

### 16) Schedule Morning Alert
**Purpose**  
아침 알림 예약

**Approach**  
시스템은 사용자가 설정한 알림 시각을 기준으로 아침 뉴스 알림을 예약한다.

**Dynamics**  
매일 반복적으로 같은 시간에 알림을 보내야 할 경우

**Goals**  
사용자에게 규칙적인 뉴스 알림 경험을 제공한다.

### 17) Open App by Notification
**Purpose**  
알림을 통해 앱 실행

**Approach**  
사용자가 뉴스 알림을 누르면 앱이 열리고, 관련 뉴스 화면으로 이동한다.

**Dynamics**  
사용자가 알림을 통해 바로 뉴스를 확인하려고 할 경우

**Goals**  
앱 접근을 빠르고 편리하게 만든다.

### 18) Notification Response
**Purpose**  
알림 반응 처리

**Approach**  
시스템은 사용자가 알림을 눌렀는지 여부를 확인하고, 알림에 맞는 화면을 보여준다.

**Dynamics**  
사용자가 알림에 반응하여 앱에 진입할 경우

**Goals**  
알림과 앱 화면이 자연스럽게 연결되도록 한다.

---

## 7. Problem statement

### 1) Problem #1
뉴스 데이터의 정확성과 안정성이 중요하다. 외부 뉴스 API 서비스에서 불완전하거나 중복된 기사가 제공될 경우 사용자는 잘못된 정보를 받을 수 있다. 따라서 시스템은 뉴스 데이터를 안정적으로 받아오고 필요한 경우 중복을 줄일 수 있어야 한다.

### 2) Problem #2
요약 기능이 항상 정확한 내용을 전달하지 못할 수 있다. 긴 기사를 짧게 줄이는 과정에서 중요한 맥락이 빠질 가능성이 있다. 따라서 요약 기능은 핵심 내용을 유지하면서도 지나치게 왜곡되지 않도록 해야 한다.

### 3) Problem #3
뉴스한입은 안드로이드 환경을 기준으로 구상하고 있기 때문에 다른 운영체제를 사용하는 사용자는 이용에 제한이 있을 수 있다. 따라서 플랫폼 제한이 생길 수 있다는 점도 고려해야 한다.

### 4) Problem #4
사용자가 뉴스 알림을 너무 자주 받거나 관심 없는 뉴스가 반복되면 오히려 앱 사용을 중단할 수 있다. 따라서 뉴스한입은 필요한 뉴스만 적절한 시점에 전달하는 방향으로 구성되어야 한다.

---

## 8. Glossary

| Terms | Description |

| User | 뉴스한입 앱을 사용하는 일반 사용자 |
| News API Service | 외부 뉴스 데이터를 제공하는 서비스 |
| Summary Function | 기사 내용을 짧게 요약하고 핵심 키워드를 추출하는 기능 |
| Android Notification | 안드로이드 기기에서 뉴스 알림을 표시하는 기능 |
| Brief News | 긴 기사 대신 핵심만 짧게 정리한 뉴스 |
| Full Article | 요약 뉴스와 연결되는 원문 기사 |
| News Category | 정치, 경제, 사회, IT 등 뉴스 분야 |
| Notification Time | 사용자가 설정한 뉴스 알림 수신 시간 |
| Saved News | 사용자가 저장해 둔 뉴스 목록 |
| Personalized Brief News | 사용자 관심 분야에 맞게 제공되는 뉴스 요약 |

---

## 9. References

Business purpose의 그림 : https://www.journalist.or.kr/news/article.html?no=57770
