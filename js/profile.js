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
const messageButton = document.querySelector('.profile__button--message');
const shareButton = document.querySelector('.profile__button--share');

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

// 모달 - setting
const modal = document.querySelector('.modal');
const modalWindows = document.querySelectorAll('.modal-window');
const settingModal = document.querySelector('.modal-bottom__setting');
const logoutModal = document.querySelector('.modal-logout');
const settingButtons = settingModal.querySelectorAll('.modal-bottom__button');
const logoutButtons = logoutModal.querySelectorAll('.modal-confirm__button');

// 모달 - product
const productModal = document.querySelector('.modal-bottom__product--my-account');
const deleteProductModal = document.querySelector('.modal-delete-product');
const productButtons = productModal.querySelectorAll('.modal-bottom__button');
const deleteProductButtons = deleteProductModal.querySelectorAll('.modal-confirm__button');

// 모달 - post
const postModal = document.querySelector('.modal-bottom__post');
const postButtons = postModal.querySelectorAll('.modal-bottom__button');

// 모달 - myPost
const myPostModal = document.querySelector('.modal-bottom__post--my-account');
const deletePostModal = document.querySelector('.modal-delete-posting');
const myPostButtons = myPostModal.querySelectorAll('.modal-bottom__button');
const deletePostButtons = deletePostModal.querySelectorAll('.modal-confirm__button');


const renderPage = async () => {
  // 로그인이 되어 있어야 프로필 화면도 접속할 수 있어서
  // 여기서 임시로 로그인하고 토큰을 받아 옴
  login();

  // 여기 값을 바꿔서 어떤 유저의 프로필을 볼 건지 변경 가능
  localStorage.setItem('selectedUser', 'hey_binky'); 

  fetchProfile();
  fetchProduct();
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
    localStorage.setItem('userid', user._id);
    localStorage.setItem('accountname', user.accountname);
  });
};

const logout = () => {
  localStorage.clear();
  location.href = '../pages/splashScreen.html';
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

  const userid = localStorage.getItem('userid');
  const accountname = localStorage.getItem('accountname');
  const selectedUser = localStorage.getItem('selectedUser');

  profileButtons.forEach(btn => {
    btn.classList.remove('is-active');
  });
  if (selectedUser === accountname) {
    modifyButton.classList.add('is-active');
    registerButton.classList.add('is-active');
  } else {
    if (profile.follower.includes(userid)) {
      unfollowButton.classList.add('is-active');
    } else {
      followButton.classList.add('is-active');
    }
    messageButton.classList.add('is-active');
    shareButton.classList.add('is-active');
  }
};

const renderProduct = (json) => {
  const { product } = json;
  const fragment = document.createDocumentFragment();
  if (!product.length) return;
  onSale.innerHTML = '';
  const accountname = localStorage.getItem('accountname');
  const selectedUser = localStorage.getItem('selectedUser');
  if (accountname === selectedUser) {
    product.forEach(({ id, link, itemImage, itemName, price }) => {
      const item = document.createElement('li');
      item.innerHTML = `
      <button type="button" class="products__button">
        <article class="products__info">
          <img src="${itemImage}" alt="감귤 사진" class="products__img">
          <dl>
            <dt class="sr-only">상품명</dt>
            <dd class="products__name ellipsis">${itemName}</dd>
            <dt class="sr-only">가격</dt>
            <dd class="products__price">${getFormattedPrice(price)}</dd>
          </dl>
        </article>
      </button>
      `;
      fragment.appendChild(item);
      item
        .querySelector('.products__button')
        .addEventListener('click', () => showModal('product', id, link));
    });
  } else {
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
            <dd class="products__price">${getFormattedPrice(price)}</dd>
          </dl>
        </article>
      </a>
      `;
      fragment.appendChild(item);
    });
  }

  onSale.appendChild(fragment);
  products.classList.add('has-products');
};

const renderFeed = (json) => {
  const { post } = json;
  if (!post.length) return;
  feedList.innerHTML = '';
  feedAlbum.innerHTML = '';
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

const getListItem = ({ id, content, image, createdAt, hearted, heartCount, commentCount, author }) => {
  const images = image.split(',');
  let imageHTML = '';
  if (images.length === 1 && images[0]) {
    imageHTML = `<img src="${images[0]}" alt="감귤 사진" class="article-post__img">`;
  } else if (images.length > 1) {
    const arr = [];
    images.forEach(image => {
      arr.push(`<li><img src="${image}" alt="감귤 사진" class="article-post__img--small"></li>`);
    });
    imageHTML = `<ul class="article-post__img-list">${arr.join('')}</ul>`;
  }
  const date = new Date(Date.parse(createdAt));
  const [ year, month, day ] = [ date.getFullYear(), date.getMonth() + 1, date.getDate() ];
  const item = document.createElement('li');
  item.innerHTML = `
  <article class="feed-article">
    <img src="${author.image}" onerror="this.src='../images/Ellipse 1.svg'" alt="profile__img" 
    onerror="this.src='../images/basic-profile-img-.svg'" class="article-profile">
    <div class="article-container">
      <p class="article-nickname">${author.username}</p>
      <p class="article-id">@ ${author.accountname}</p>
      <p class="article-cont">${content}</p>
      ${imageHTML}
      <button type="button" data-hearted="${hearted ? 1 : 0}" data-id="${id}" class="btn-heart">
        <img src="../images/icon-heart${hearted ? '-active' : ''}.svg" alt="post-like" class="article-heart__btn">
        <span class="article-num">${heartCount}</span>
        </button>
      <button type="button" class="btn-comment">
        <img src="../images/icon-comment.svg" alt="post-comment" class="article-comment__btn">
        <span class="article-num">${commentCount}</span>
      </button>
      <p class="article-date">${year}년 ${month}월 ${day}일</p>
    </div>
    <button type="button" class="feed-article__button">
      <strong class="sr-only">메뉴</strong>
    </button>
  </article>
  `;
  item.querySelector('.article-post__img-list')?.addEventListener('mousewheel', horizontalScroll);
  item.querySelector('.btn-heart').addEventListener('click', toggleHeart);
  item.querySelector('.btn-comment').addEventListener('click', () => gotoPage('postpage.html', 'readPost'));
  const selectedUser = localStorage.getItem('selectedUser');
  const accountname = localStorage.getItem('accountname');
  if (selectedUser === accountname) {
    item.querySelector('.feed-article__button').addEventListener('click', () => showModal('myPost', id));
  } else {
    item.querySelector('.feed-article__button').addEventListener('click', () => showModal('post'));
  }
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
    <img src="${images[0]}" alt="피드 이미지"
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

const showModal = (type, ...args) => {
  modal.classList.add('is-modal-active');
  const [ id, link ] = args;
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
      localStorage.setItem('productId', id);
      localStorage.setItem('productLink', link);
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
      localStorage.setItem('postId', id);
      break;
    case 'deletePost':
      myPostModal.classList.remove('is-modal-active');
      deletePostModal.classList.add('is-modal-active');
  }
};

const hideModal = (e) => {
  if (e.target !== e.currentTarget) return;
  modal.classList.remove('is-modal-active');
  modalWindows.forEach(modal => modal.classList.remove('is-modal-active'));
};

const deleteProduct = () => {
  const id = localStorage.getItem('productId');
  const token = localStorage.getItem('token');
  fetch(`${API}/product/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(() => {
    fetchProduct();
    modal.classList.remove('is-modal-active');
    modalWindows.forEach(modal => modal.classList.remove('is-modal-active'));
  });
};

const gotoPage = (page, type) => {
  location.href = page;
  localStorage.setItem('type', type);
};

const fetchFollow = () => {
  const selectedUser = localStorage.getItem('selectedUser');
  const token = localStorage.getItem('token');
  fetch(`${API}/profile/${selectedUser}/follow`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(() => fetchProfile());
};

const follow = () => {
  fetchFollow();
  followButton.classList.remove('is-active');
  unfollowButton.classList.add('is-active');
};

const fetchUnfollow = () => {
  const selectedUser = localStorage.getItem('selectedUser');
  const token = localStorage.getItem('token');
  fetch(`${API}/profile/${selectedUser}/unfollow`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(() => fetchProfile());
};

const unfollow = () => {
  fetchUnfollow();
  unfollowButton.classList.remove('is-active');
  followButton.classList.add('is-active');
};

const horizontalScroll = (e) => {
  const { wheelDelta, currentTarget } = e;
  const { offsetWidth, scrollLeft, scrollWidth } = currentTarget
  if (offsetWidth + scrollLeft >= scrollWidth && wheelDelta < 0) return;
  if (scrollLeft === 0 && wheelDelta > 0) return;
  e.preventDefault();
  currentTarget.scrollLeft -= wheelDelta / 2;
};

const switchFeed = () => {
  const { id } = [...feedButtons].find(btn => btn.checked);
  if (id === 'list-type') {
    feedList.classList.add('list-checked');
    feedAlbum.classList.remove('album-checked');
    feedLabels[0].classList.add('feed__label-list--on');
    feedLabels[1].classList.remove('feed__label-album--on');
    fetchFeed(localStorage.getItem('selectedUser'), localStorage.getItem('token'));
  } else if (id === 'album-type') {
    feedAlbum.classList.add('album-checked');
    feedList.classList.remove('list-checked');
    feedLabels[0].classList.remove('feed__label-list--on');
    feedLabels[1].classList.add('feed__label-album--on');
    fetchFeed(localStorage.getItem('selectedUser'), localStorage.getItem('token'));
  }
};

const isFeedList = () => {
  return [...feedButtons].find(btn => btn.checked).id === 'list-type';
};

const deletePost = () => {
  const id = localStorage.getItem('postId');
  const token = localStorage.getItem('token');
  fetch(`${API}/post/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(() => {
    fetchFeed();
    modal.classList.remove('is-modal-active');
    modalWindows.forEach(modal => modal.classList.remove('is-modal-active'));
  });
};

const fetchOneFeed = (id, elem) => {
  const token = localStorage.getItem('token');
  fetch(`${API}/post/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .then(({ post }) => {
    const { hearted, heartCount } = post;
    elem.innerHTML = `
    <img src="../images/icon-heart${hearted ? '-active' : ''}.svg" alt="post-like" class="article-heart__btn">
      <span class="article-num">${heartCount}</span>
    </button>
    `;
    elem.setAttribute('data-hearted', hearted ? 1 : 0);
  });
};

const toggleHeart = ({ currentTarget }) => {
  const { hearted, id } = currentTarget.dataset;
  const token = localStorage.getItem('token');
  if (+hearted) {
    fetch(`${API}/post/${id}/unheart`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(() => {
      fetchOneFeed(id, currentTarget);
    });
  } else {
    fetch(`${API}/post/${id}/heart`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(() => {
      fetchOneFeed(id, currentTarget);
    });
  }
};

// 헤더 버튼
backButton.addEventListener('click', goBack);
menuButton.addEventListener('click', () => showModal('setting'));

// 프로필 버튼
followersButton.addEventListener('click', () => gotoPage('followList.html', 'followers'));
followingsButton.addEventListener('click', () => gotoPage('followList.html', 'followings'));
followButton.addEventListener('click', follow);
unfollowButton.addEventListener('click', unfollow);
modifyButton.addEventListener('click', () => gotoPage('modifyProfile.html', 'modifyProfile'));
registerButton.addEventListener('click', () => gotoPage('modifyProduct.html', 'addProduct'));

// 상품 목록 가로 스크롤
onSale.addEventListener('mousewheel', horizontalScroll);

// 피드 목록형 앨범형 전환 버튼
feedForm.addEventListener('change', switchFeed);

// 모달 dimmed
modal.addEventListener('click', hideModal);

// 상단 메뉴 버튼 누른 후 뜨는 모달 버튼
settingButtons[0].addEventListener('click', hideModal);
settingButtons[1].addEventListener('click', () => showModal('logout'));
logoutButtons[0].addEventListener('click', () => showModal('setting'));
logoutButtons[1].addEventListener('click', logout);

// 내 상품 목록 누를 때 뜨는 모달 버튼
productButtons[0].addEventListener('click', () => showModal('deleteProduct'));
productButtons[1].addEventListener('click', () => gotoPage('modifyProduct.html', 'modifyProduct'));
productButtons[2].addEventListener('click', () => gotoPage(localStorage.getItem('productLink')));
deleteProductButtons[0].addEventListener('click', () => showModal('product'));
deleteProductButtons[1].addEventListener('click', deleteProduct);

// 내 피드 게시물 메뉴 누를 때 뜨는 모달 버튼
postButtons[0].addEventListener('click', hideModal);
myPostButtons[0].addEventListener('click', () => showModal('deletePost'));
myPostButtons[1].addEventListener('click', () => gotoPage('upload.html', 'modifyPost'));
deletePostButtons[0].addEventListener('click', () => showModal('myPost'));
deletePostButtons[1].addEventListener('click', deletePost);

renderPage();