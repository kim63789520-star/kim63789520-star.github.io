// 플로우잇고 복제 사이트 설정 — 이 파일만 고치면 됩니다.
window.FLOW_CONFIG = {
  SITE_NAME: "플로우잇고",
  // 상담 접수 알림 (텔레그램 봇 → 대표님 채팅). 비어 있으면 카카오톡 상담으로 안내합니다.
  TELEGRAM: {
    token: "",    // ← 보람상조피플 사이트 config.js 의 token 값
    chat_id: ""   // ← 같은 파일의 chat_id 값
  },
  PHONE: "010-8175-7015",
  KAKAO_URL: "http://pf.kakao.com/_xowzxhX/chat",
  // 로그인·파트너·장바구니 등 회원 기능 링크 숨김 (서버가 없어 동작하지 않음)
  HIDE_MEMBER_LINKS: false,
  // 상조가전(월 납입금 상품)에서 '카드할인시' 금액 숨김 — 가전결합+환급+카드할인 한 화면 금지 가드레일
  HIDE_CARD_DISCOUNT_SANGJO: false,
  // 모바일 기기는 /m/ 으로 자동 이동 (원본과 동일). ?pc=1 로 PC 화면 강제
  MOBILE_REDIRECT: true
};
