# Conceptualization Report

## 1. Project Title and Student Information

- Project Title: 뉴스한입
- Student No: 22212059
- Name: 김명섭
- E-mail: eigfid@naver.com

---

## 2. Revision History

| Revision date | Version # | Description | Author |

| 2026-03-25 | 1.0 | First draft | 김명섭 |

---

## 3. Business Purpose

과제 주제를 고민하던 중, 문득 요즘 젊은 세대는 뉴스에 대한 관심이 예전 세대보다 많이 줄어든 것 같다고 생각했다.

나도 MZ세대로 살아가면서 휴대폰에 많이 의지하고 살아가는데, 그러한 휴대폰에는 너무나 많은 콘텐츠들이 존재하다 보니 자연스럽게 딱딱한 뉴스에는 크게 손이 가지 않게 된다.
이로 인해 결국 세상이 돌아가는 일에는 크게 관심을 가지지 않게 되어 사회에서 무슨 일이 있었는지 늦게 알게 되거나, 모르고 살아가게 되었다. 
또한 단순히 사회에 대한 무관심이 늘어날 뿐만 아니라 뉴스를 보는 사람과의 소통 어려움, 배경지식 부족 등 여러 문제와도 직결된다는 것을 직접 경험하기도 했다.

그래서 사용자가 직접 뉴스를 찾지 않아도, 매일 아침 전날 있었던 주요 뉴스들을 짧게 요약해서 알림으로 알려주는 서비스를 생각하게 되었다.  
이 프로젝트를 통해 사용자들은 아침에 출근하거나 등교하는 시간을 활용하여 짧은 시간만 투자해도 중요한 이슈를 확인할 수 있고, 
자연스럽게 뉴스와 사회 문제에 대한 관심도 높일 수 있을 것이라고 생각한다.

이 어플리케이션의 이름은 '뉴스한입'이고, 말 그대로 뉴스를 길게 다 읽는 것이 아니라 핵심만 한입처럼 가볍게 볼 수 있게 하여 현대인들이 뉴스에 관심을 가지게 하고 
더 나아가 사회에 관심을 가지게 하는 것이 목적이다.

https://www.journalist.or.kr/news/article.html?no=57770

---

## 4. System Context Diagram

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
|        User          |             |   뉴스한입 System    |             | Android Notification |
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

