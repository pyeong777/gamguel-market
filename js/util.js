// 헤더의 뒤로 가기 버튼
// 로컬 스토리지의 prev에서 이전 상태로 다른 로컬 스토리지 값들을 복구하고 페이지 이동
const goBack = () => {
  const prev = JSON.parse(localStorage.getItem('prev'));
  Object
    .entries(prev.pop())
    .forEach(([ key, value ]) => localStorage.setItem(key, value));
  localStorage.setItem('prev', JSON.stringify(prev));
  window.history.back();
};

// 팔로워/팔로잉 페이지, 상품 등록 및 수정, 프로필 수정, 게시글 수정, 댓글 달기 페이지로 이동할 때
// 현재 상태의 로컬 스토리지 값들을 로컬 스토리지의 prev에 저장하고 해당 페이지로 이동
// 페이지로 이동하면서 변경해야 할 로컬 스토리지 값들은 items에 담아서 전달받음
// 1. 현 상태의 값들을 prev에 저장
// 2. items의 값들로 로컬 스토리지의 값들을 변경함
// 3. 해당 페이지로 이동함
const gotoPage = (url, items = {}) => {
  const prevStorage = {};
  ['page', 'selectedUser', 'productId', 'postId']
    .forEach(key => prevStorage[key] = localStorage.getItem(key));
  const prev = JSON.parse(localStorage.getItem('prev'));
  prev.push(prevStorage);
  localStorage.setItem('prev', JSON.stringify(prev));
  Object
    .entries(items)
    .forEach(([ key, value ]) => localStorage.setItem(key, value));
  location.href = url;
};

// 세 자리씩 쉼표로 끊은 가격으로 변환 (70000 => 70,000)
const getFormattedPrice = (price) => {
  const strPrice = '' + price;
  if (strPrice.length <= 3) return strPrice;
  return [...strPrice]
    .map((v, i) => {
      if ((strPrice.length - i) % 3 === 0 && i !== 0) return ',' + v;
      return v;
    })
    .join('');
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