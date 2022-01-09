// 헤더 버튼
const backButton = document.querySelector('.main-header__back');
const menuButton = document.querySelector('.main-header__button');

// 프로필 버튼
const followersButton = document.querySelector('.profile__follow-info--followers');
const followingsButton = document.querySelector('.profile__follow-info--followings');
const followButton = document.querySelector('.profile__button--follow');
const unfollowButton = document.querySelector('.profile__button--unfollow');
const modifyButton = document.querySelector('.profile__button--follow');
const registerButton = document.querySelector('.profile__button--follow');

// 피드 버튼
const feedForm = document.querySelector('.feed__button');
const feedList = document.querySelector('.feed-list');
const feedAlbum = document.querySelector('.feed-album');
const feedButtons = feedForm.querySelectorAll('input');
const feedLabels = document.querySelectorAll('.feed__label');

// 모달
const modal = document.querySelector('.modal');
const modalWindows = document.querySelectorAll('.modal-window');
const settingModal = document.querySelector('.modal-bottom__setting');
const logoutModal = document.querySelector('.modal-logout');
const settingButtons = settingModal.querySelectorAll('.modal-bottom__button');
const logoutButtons = logoutModal.querySelectorAll('.modal-confirm__button');

// const loadData = async () => {
//   
// };
// 
// const render = () => {
// 
// };

const goBack = () => {
  window.history.back();
};

const showModal = (type) => {
  modal.classList.add('is-modal-active');
  switch (type) {
    case 'setting':
      settingModal.classList.add('is-modal-active');
      logoutModal.classList.remove('is-modal-active');
      break;
    case 'logout':
      settingModal.classList.remove('is-modal-active');
      logoutModal.classList.add('is-modal-active');
      break;
  }
};

const hideModal = (e) => {
  if (e.target !== e.currentTarget) return;
  modal.classList.remove('is-modal-active');
  modalWindows.forEach(modal => modal.classList.remove('is-modal-active'));
};

const gotoPage = (page, type) => {
  location.href = page;
  localStorage.setItem('type', type);
};

const follow = () => {
  followButton.classList.remove('is-active');
  unfollowButton.classList.add('is-active');
};

const unfollow = () => {
  unfollowButton.classList.remove('is-active');
  followButton.classList.add('is-active');
};

const switchFeed = () => {
  const { id } = [...feedButtons].find(btn => btn.checked);
  if (id === 'list-type') {
    feedList.classList.add('list-checked');
    feedAlbum.classList.remove('album-checked');
    feedLabels[0].classList.add('feed__label-list--on');
    feedLabels[1].classList.remove('feed__label-album--on');
  } else if (id === 'album-type') {
    feedAlbum.classList.add('album-checked');
    feedList.classList.remove('list-checked');
    feedLabels[0].classList.remove('feed__label-list--on');
    feedLabels[1].classList.add('feed__label-album--on');
  }
};

//document.addEventListener('load', loadData);
backButton.addEventListener('click', goBack);
menuButton.addEventListener('click', () => showModal('setting'));
followersButton.addEventListener('click', () => gotoPage('followList.html', 'followers'));
followingsButton.addEventListener('click', () => gotoPage('followList.html', 'followings'));
followButton.addEventListener('click', follow);
unfollowButton.addEventListener('click', unfollow);
feedForm.addEventListener('change', switchFeed);
modal.addEventListener('click', hideModal);
settingButtons[1].addEventListener('click', () => showModal('logout'));
logoutButtons[0].addEventListener('click', () => showModal('setting'));