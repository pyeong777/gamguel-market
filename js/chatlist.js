// 채팅 목록 첫번째
const chat = document.querySelector('.chat');
// 헤더 버튼
const backButton = document.querySelector('.main-header__back');
const menuButton = document.querySelector('.main-header__button');

// 모달 - setting
const modal = document.querySelector('.modal');
const modalWindows = document.querySelectorAll('.modal-window');
const settingModal = document.querySelector('.modal-bottom__setting');
const logoutModal = document.querySelector('.modal-logout');
const settingButtons = settingModal.querySelectorAll('.modal-bottom__button');
const logoutButtons = logoutModal.querySelectorAll('.modal-confirm__button');

const showModal = (type, ...args) => {
  modal.classList.add('is-modal-active');
  const [id, link] = args;
  switch (type) {
    case 'setting':
      settingModal.classList.add('is-modal-active');
      logoutModal.classList.remove('is-modal-active');
      break;
    case 'logout':
      settingModal.classList.remove('is-modal-active');
      logoutModal.classList.add('is-modal-active');
      break;
    case 'product':
      productModal.classList.add('is-modal-active');
      deleteProductModal.classList.remove('is-modal-active');
      if (!args.length) return;
      NAME_SPACE.productId = id;
      NAME_SPACE.productLink = link;
      break;
    case 'deleteProduct':
      productModal.classList.remove('is-modal-active');
      deleteProductModal.classList.add('is-modal-active');
      break;
    case 'post':
      postModal.classList.add('is-modal-active');
      break;
    case 'myPost':
      myPostModal.classList.add('is-modal-active');
      deletePostModal.classList.remove('is-modal-active');
      if (!args.length) return;
      NAME_SPACE.postId = id;
      break;
    case 'deletePost':
      myPostModal.classList.remove('is-modal-active');
      deletePostModal.classList.add('is-modal-active');
  }
};

const hideModal = (e) => {
  if (e.target !== e.currentTarget) return;
  modal.classList.remove('is-modal-active');
  modalWindows.forEach((modal) => modal.classList.remove('is-modal-active'));
};

const logout = () => {
  localStorage.clear();
  location.href = '../pages/splashScreen.html';
};

// 채팅룸 이동
chat.addEventListener('click', () => {
  gotoPage('chatRoom.html');
});

// 헤더 버튼
backButton.addEventListener('click', goBack);
menuButton.addEventListener('click', () => showModal('setting'));

// 상단 메뉴 버튼 누른 후 뜨는 모달 버튼
settingButtons[0].addEventListener('click', hideModal);
settingButtons[1].addEventListener('click', () => showModal('logout'));
logoutButtons[0].addEventListener('click', () => showModal('setting'));
logoutButtons[1].addEventListener('click', logout);

// 모달 dimmed
modal.addEventListener('click', hideModal);

// 하단 네비게이션 바 - 프로필 페이지 이동
document
  .querySelector('.nav-profile')
  .addEventListener('click', () => {
    gotoPage('profile.html', { user: localStorage.getItem('accountname') }, [ 'user' ]);
  });

const NAME_SPACE = getNameSpace();