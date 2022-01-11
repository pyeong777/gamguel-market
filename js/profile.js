// 헤더 버튼
const backButton = document.querySelector('.main-header__back');
const menuButton = document.querySelector('.main-header__button');

// 프로필 버튼
const profileButtons = document.querySelectorAll('.profile__button');
const followersButton = document.querySelector('.profile__follow-info--followers');
const followingsButton = document.querySelector('.profile__follow-info--followings');
const followButton = document.querySelector('.profile__button--follow');
const unfollowButton = document.querySelector('.profile__button--unfollow');
const modifyButton = document.querySelector('.profile__button--modify');
const registerButton = document.querySelector('.profile__button--register');

// 프로필 이미지
const profileImage = document.querySelector('.profile__user-img');

// 판매 중인 상품
const products = document.querySelector('.products');
const onSale = document.querySelector('.products__on-sale');

// 피드
const feed = document.querySelector('.feed');
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

// 상수
const API = 'http://146.56.183.55:5050';


const renderPage = async () => {
  // 로그인
  login();
  
  const accountname = localStorage.getItem('accountname');
  localStorage.setItem('selectedUser', accountname); // 여기 값을 바꿔서 어떤 유저의 프로필을 볼 건지 변경 가능
  const selectedUser = localStorage.getItem('selectedUser');

  // 프로필 버튼
  if (selectedUser === accountname) {
    profileButtons.forEach(btn => {
      btn.classList.remove('is-active');
    });
    modifyButton.classList.add('is-active');
    registerButton.classList.add('is-active');
  }

  // 프로필 정보
  fetchProfile();

  // 상품 목록
  fetchProduct();

  // 피드 목록
  fetchFeed();
};

const login = () => {
  fetch(`${API}/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user: {
        email: 'test@test.com',
        password: 'test001'
      }
    })
  })
  .then(res => res.json())
  .then(({ user }) => {
    localStorage.setItem('token', user.token);
    localStorage.setItem('accountname', user.accountname);
  });
};

const fetchProfile = () => {
  const selectedUser = localStorage.getItem('selectedUser');
  const token = localStorage.getItem('token');
  fetch(`${API}/profile/${selectedUser}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .then(json => renderProfile(json));
};

const fetchProduct = () => {
  const selectedUser = localStorage.getItem('selectedUser');
  const token = localStorage.getItem('token');
  fetch(`${API}/product/${selectedUser}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .then(json => renderProduct(json));
};

const fetchFeed = () => {
  const selectedUser = localStorage.getItem('selectedUser');
  const token = localStorage.getItem('token');
  fetch(`${API}/post/${selectedUser}/userpost`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .then(json => renderFeed(json));
};

const renderProfile = (json) => {
  const { profile } = json;
  const userName = document.querySelector('.profile-info__user-name');
  const accountName = document.querySelector('.profile-info__user-account-name');
  const intro = document.querySelector('.profile-info__user-desc');
  const followers = document.querySelector('.profile__follow-value--followers');
  const followings = document.querySelector('.profile__follow-value--followings');
  profileImage.src = profile.image;
  userName.textContent = profile.username;
  accountName.textContent = `@ ${profile.accountname}`;
  intro.textContent = profile.intro;
  followers.textContent = profile.followerCount;
  followings.textContent = profile.followingCount;
};

const renderProduct = (json) => {
  const { product } = json;
  const fragment = document.createDocumentFragment();
  if (!product.length) return;
  product.forEach(({ link, itemImage, itemName, price }) => {
    const item = document.createElement('li');
    item.innerHTML = `
    <a href="${link}">
      <article class="products__info">
        <img src="${API}/${itemImage}" alt="감귤 사진" class="products__img">
        <dl>
          <dt class="sr-only">상품명</dt>
          <dd class="products__name ellipsis">${itemName}</dd>
          <dt class="sr-only">가격</dt>
          <dd class="products__price">${price}</dd>
        </dl>
      </article>
    </a>
    `;
    fragment.appendChild(item);
  });
  onSale.appendChild(fragment);
  products.classList.add('has-products');
};

const renderFeed = (json) => {
  const { post } = json;
  if (!post.length) return;
  const fragment = document.createDocumentFragment();
  if (isFeedList()) {
    post.forEach(posting => {
      const item = getListItem(posting);
      fragment.appendChild(item);
    });
    feedList.appendChild(fragment);
  } else {
    post.forEach((posting, index) => {
      const item = getAlbumItem(posting, index);
      if (item) fragment.appendChild(item);
    });
    feedAlbum.appendChild(fragment);
  }
  feed.classList.add('has-feed');
};

const getListItem = ({ content, image, createdAt, heartCount, commentCount, author }) => {
  const images = image.split(',');
  let imageHTML = '';
  if (images.length === 1 && images[0]) {
    imageHTML = `<img src="${API}/${images[0]}" alt="감귤 사진" class="article-post__img">`;
  } else if (images.length > 1) {
    const arr = [];
    images.forEach(image => {
      arr.push(`<li><img src="${API}/${image}" alt="감귤 사진" class="article-post__img--small"></li>`);
    });
    imageHTML = `<ul class="article-post__img-list">${arr.join('')}</ul>`;
  }
  const date = new Date(Date.parse(createdAt));
  const [ year, month, day ] = [ date.getFullYear(), date.getMonth() + 1, date.getDate() ];
  const item = document.createElement('li');
  item.innerHTML = `
  <article class="feed-article">
    <img src="../images/Ellipse 1.svg" alt="profile__img" 
    onerror="this.src='../images/basic-profile-img-.svg'" class="article-profile">
    <div class="article-container">
      <p class="article-nickname">${author.username}</p>
      <p class="article-id">@ ${author.accountname}</p>
      <p class="article-cont">${content}</p>
      ${imageHTML}
      <img src="../images/icon-heart.svg" alt="post-like" class="article-heart__btn">
      <span class="article-num">${heartCount}</span>
      <img src="../images/icon-comment.svg" alt="post-comment" class="article-comment__btn">
      <span class="article-num">${commentCount}</span>
      <p class="article-date">${year}년 ${month}월 ${day}일</p>
    </div>
    <button type="button" class="feed-article__button">
      <strong class="sr-only">메뉴</strong>
    </button>
  </article>
  `;
  item.querySelector('.article-post__img-list')?.addEventListener('mousewheel', horizontalScroll);
  return item;
};

const getAlbumItem = ({ image }, index) => {
  const images = image.split(',').filter(img => img !== '');
  if (!images.length) return;
  let multiHTML = '';
  if (images.length > 1) multiHTML = 'feed-album__item--multi';
  const item = document.createElement('li');
  item.innerHTML = `
  <button type="button" class="feed-album__button">
    <img src="${API}/${images[0]}" alt="피드 이미지"
    onerror="this.src='../images/full-logo.svg'" class="feed-album__picture">
  </button>
  `;
  item.setAttribute('class', `feed-album__item ${multiHTML}`);
  item.setAttribute('style', `order:${index}`);
  return item;
};

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

const horizontalScroll = (e) => {
  const { wheelDelta, currentTarget } = e;
  e.preventDefault();
  currentTarget.scrollLeft -= wheelDelta / 2;
}

const switchFeed = () => {
  const { id } = [...feedButtons].find(btn => btn.checked);
  if (id === 'list-type') {
    feedList.classList.add('list-checked');
    feedAlbum.classList.remove('album-checked');
    feedLabels[0].classList.add('feed__label-list--on');
    feedLabels[1].classList.remove('feed__label-album--on');
    feedList.innerHTML = '';
    fetchFeed(localStorage.getItem('selectedUser'), localStorage.getItem('token'));
  } else if (id === 'album-type') {
    feedAlbum.classList.add('album-checked');
    feedList.classList.remove('list-checked');
    feedLabels[0].classList.remove('feed__label-list--on');
    feedLabels[1].classList.add('feed__label-album--on');
    feedAlbum.innerHTML = '';
    fetchFeed(localStorage.getItem('selectedUser'), localStorage.getItem('token'));
  }
};

const isFeedList = () => {
  return [...feedButtons].find(btn => btn.checked).id === 'list-type';
};

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

onSale.addEventListener('mousewheel', horizontalScroll);

renderPage();