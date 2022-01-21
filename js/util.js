// 쿼리 스트링의 값들을 담은 NAME_SPACE 반환
const getNameSpace = () => {
  const params = new URLSearchParams(location.search);
  const NAME_SPACE = {};
  params.forEach((value, key) => NAME_SPACE[key] = value);
  return NAME_SPACE;
};

// 헤더의 뒤로 가기 버튼
const goBack = () => {
  window.history.back();
};

// 팔로워/팔로잉 페이지, 상품 등록 및 수정, 프로필 수정, 게시글 수정, 댓글 달기 페이지로 이동할 때
// 변경되어야 할 값들을 items에 담아서 NAME_SPACE를 변경함
// query에 넘어갈 페이지의 URL에 붙일 쿼리스트링의 key를 받음
// 1. items의 값들로 NAME_SPACE를 변경함
// 2. url 뒤에 key=NAME_SPACE[key]의 형태로 쿼리스트링을 붙여줌
// 3. 해당 url 페이지로 이동
const gotoPage = (url, items = {}, query = []) => {
  Object
    .entries(items)
    .forEach(([ key, value ]) => NAME_SPACE[key] = value);
  if (query.length) {
    const qs = query.map(key => `${key}=${NAME_SPACE[key]}`).join('&');
    location.href = `${url}?${qs}`;
  } else {
    location.href = url;
  }
};

// 세 자리씩 쉼표로 끊은 가격으로 변환 (70000 => 70,000)
const getFormattedPrice = (price) => {
  return (+price).toLocaleString();
};

// 이미지 가로 스크롤
const horizontalScroll = (e) => {
  const { wheelDelta, currentTarget } = e;
  const { offsetWidth, scrollLeft, scrollWidth } = currentTarget
  if (offsetWidth + scrollLeft >= scrollWidth && wheelDelta < 0) return;
  if (scrollLeft === 0 && wheelDelta > 0) return;
  e.preventDefault();
  currentTarget.scrollLeft -= wheelDelta / 2;
};

// 반복되는 fetch의 두 번째 매개변수
const reqData = (method = 'GET', body) => {
  return {
    method,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
};