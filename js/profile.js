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
  NAME_SPACE.productObserver = new IntersectionObserver(getIoCallback(onSale, 'product', fetchProduct), { threshold: 0.1 });
  NAME_SPACE.feedObserver = new IntersectionObserver(getIoCallback(feedList, 'feed', fetchFeedList), { threshold: 0.1 });
  NAME_SPACE.albumObserver = new IntersectionObserver(getIoCallback(feedAlbum, 'album', fetchFeedAlbum), { threshold: 0.8 });
  NAME_SPACE.productSkip = 0;
  NAME_SPACE.feedSkip = 0;
  NAME_SPACE.albumSkip = 0;
  fetchProfile();
  await fetchProduct();
  switchFeed();
  await fetchFeedList();
  await fetchFeedAlbum();
  observeLastItem(onSale, 'product');
  observeLastItem(feedList, 'feed');
  observeLastItem(feedAlbum, 'album');
};

const observeLastItem = (item, observer) => {
  const lastChild = item.lastElementChild;
  if (!lastChild) return;
  NAME_SPACE[`${observer}LastChild`] = lastChild;
  NAME_SPACE[`${observer}Observer`].observe(lastChild);
};

const unobserveLastItem = (item, observer) => {
  const lastChild = item.lastElementChild;
  if (!lastChild) return;
  NAME_SPACE[`${observer}Observer`].unobserve(lastChild);
};

const getIoCallback = (target, observer, fetchFunc) => {
  return (entries, io) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        io.unobserve(entry.target);
        fetchFunc()
          .then(isLast => {
            if (!isLast) observeLastItem(target, observer);
          });
      }
    });
  };
};

const logout = () => {
  localStorage.clear();
  location.href = '../pages/splashScreen.html';
};

const fetchFeed = () => {
  if (isFeedList()) fetchFeedList();
  else fetchFeedAlbum();
};

const fetchProfile = () => {
  fetch(`${API}/profile/${NAME_SPACE.user}`, reqData())
  .then(res => res.json())
  .then(json => renderProfile(json));
};

const fetchProduct = (count = 5) => {
  const { user, productSkip } = NAME_SPACE;
  return fetch(`${API}/product/${user}/?limit=${productSkip >= 5 ? 15 : 5}&skip=${productSkip >= 5 ? productSkip - 5 : productSkip}`, reqData())
  .then(res => res.json())
  .then(json => {
    const { prevProduct } = NAME_SPACE;
    let uniquePost;
    if (prevProduct.length) {
      const prevId = prevProduct.map(({ id }) => id);
      uniquePost = json.product
        .filter(({ id }) => !prevId.includes(id) && id < prevProduct[0].id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, count);
      NAME_SPACE.productSkip += uniquePost.length;
    } else {
      uniquePost = [...json.product];
      NAME_SPACE.productSkip += json.product.length;
    }
    if (uniquePost.length) {
      renderProduct(uniquePost);
      NAME_SPACE.prevProduct = uniquePost;
      return false;
    } else {
      unobserveLastItem(onSale, 'product');
      return true;
    }
  });
};

const fetchFeedList = (count = 10) => {
  const { user, feedSkip } = NAME_SPACE;
  return fetch(`${API}/post/${user}/userpost/?limit=${feedSkip >= 10 ? 30 : 10}&skip=${feedSkip >= 10 ? feedSkip - 10 : feedSkip}`, reqData())
  .then(res => res.json())
  .then(json => {
    const { prevFeed } = NAME_SPACE;
    let uniquePost;
    if (prevFeed.length) {
      const prevId = prevFeed.map(({ id }) => id);
      uniquePost = json.post
        .filter(({ id }) => !prevId.includes(id) && id < prevFeed[0].id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, count);
      NAME_SPACE.feedSkip += uniquePost.length;
    } else {
      uniquePost = [...json.post];
      NAME_SPACE.feedSkip += json.post.length;
    }
    if (uniquePost.length) {
      renderFeed(uniquePost);
      NAME_SPACE.prevFeed = uniquePost;
      return false;
    } else {
      unobserveLastItem(feedList, 'feed');
      return true;
    }
  });
};

const fetchFeedAlbum = () => {
  const { user, albumSkip } = NAME_SPACE;
  return fetch(`${API}/post/${user}/userpost/?limit=${albumSkip >= 10 ? 30 : 10}&skip=${albumSkip >= 10 ? albumSkip - 10 : albumSkip}`, reqData())
  .then(res => res.json())
  .then(json => {
    const { prevAlbum } = NAME_SPACE;
    let uniquePost;
    if (prevAlbum.length) {
      const prevId = prevAlbum.map(({ id }) => id);
      uniquePost = json.post
        .filter(({ id, image }) => !prevId.includes(id) && id < prevAlbum[0].id && image?.split(',').every(imgName => imgName))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10);
      NAME_SPACE.albumSkip += uniquePost.length;
    } else {
      uniquePost = [...json.post].filter(({ image }) => image?.split(',').every(imgName => imgName));
      NAME_SPACE.albumSkip += json.post.length;
    }

    if (uniquePost.length) {
      renderFeed(uniquePost, false);
      NAME_SPACE.prevAlbum = uniquePost;
      return false;
    } else {
      unobserveLastItem(feedAlbum, 'album');
      return true;
    }
  });
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
  const { user } = NAME_SPACE;

  profileButtons.forEach(btn => {
    btn.classList.remove('is-active');
  });
  if (user === accountname) {
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

const renderProduct = (product) => {
  const fragment = document.createDocumentFragment();
  if (!product.length) return;
  const accountname = localStorage.getItem('accountname');
  const { user } = NAME_SPACE;
  if (user === accountname) {
    product.forEach(({ id, link, itemImage, itemName, price }) => {
      const item = document.createElement('li');
      item.innerHTML = `
      <button type="button" class="products__button">
        <article class="products__info">
          <img src="${itemImage}" alt="감귤 사진" onerror="this.src='../images/full-logo.svg'" class="products__img">
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
        .addEventListener('click', () => showModal('product', id, link, item));
    });
  } else {
    product.forEach(({ link, itemImage, itemName, price }) => {
      const item = document.createElement('li');
      item.innerHTML = `
      <a href="${link}">
        <article class="products__info">
          <img src="${itemImage}" alt="감귤 사진" onerror="this.src='../images/full-logo.svg'" class="products__img">
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

const renderFeed = (post, isList = true) => {
  if (!post.length) return;
  const fragment = document.createDocumentFragment();
  if (isList) {
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
  const images = image?.split(',');
  let imageHTML = '';
  if (images) {
    if (images.length === 1 && images[0]) {
      imageHTML = `<img src="${images[0]}" alt="감귤 사진" onerror="this.src='../images/full-logo.svg'" class="article-post__img">`;
    } else if (images.length > 1) {
      const arr = [];
      images.forEach(image => {
        arr.push(`<li><img src="${image}" alt="감귤 사진" onerror="this.src='../images/full-logo.svg'" class="article-post__img--small"></li>`);
      });
      imageHTML = `<ul class="article-post__img-list">${arr.join('')}</ul>`;
    }
  }
  const year = createdAt.slice(0, 4);
  const month = createdAt.slice(5, 7);
  const day = createdAt.slice(8, 10);
  const item = document.createElement('li');
  item.innerHTML = `
  <article class="feed-article">
    <a href="profile.html?user=${author.accountname}">
      <img src="${author.image}" onerror="this.src='../images/Ellipse 1.svg'" alt="profile__img" 
      onerror="this.src='../images/basic-profile-img-.svg'" class="article-profile">
    </a>
    <div class="article-container">
      <p class="article-nickname">
        <a href="profile.html?user=${author.accountname}"> ${author.username}</a>
      </p>
      <p class="article-id">
        <a href="profile.html?user=${author.accountname}"> @ ${author.accountname}</a>
      </p>
      <p class="article-cont">${content}</p>
      ${imageHTML}
      <button type="button" data-hearted="${hearted ? 1 : 0}" data-id="${id}" class="btn-heart">
        <img src="../images/icon-heart${hearted ? '-active' : ''}.svg" alt="post-like" class="article-heart__btn">
        <span class="article-num article-heart__num">${heartCount}</span>
      </button>
      <button type="button" class="btn-comment">
        <img src="../images/icon-comment.svg" alt="post-comment" class="article-comment__btn">
        <span class="article-num article-comment__num">${commentCount}</span>
      </button>
      <p class="article-date">${year}년 ${month}월 ${day}일</p>
    </div>
    <button type="button" class="feed-article__button">
      <strong class="sr-only">메뉴</strong>
    </button>
  </article>
  `;
  item
    .querySelector('.article-post__img-list')
    ?.addEventListener('mousewheel', horizontalScroll);
  item
    .querySelector('.btn-heart')
    .addEventListener('click', toggleHeart);
  ['article-cont', 'btn-comment', 'article-post__img', 'article-post__img--small']
    .forEach(cls => {
      item
        .querySelectorAll(`.${cls}`)
        .forEach(elem => {
          elem.addEventListener('click', () => gotoPage('postpage.html', { postId: id }, [ 'postId' ]));
        });
    });
  const accountname = localStorage.getItem('accountname');
  const { user } = NAME_SPACE;
  if (user === accountname) {
    item
      .querySelector('.feed-article__button')
      .addEventListener('click', () => showModal('myPost', id, item));
  } else {
    item
      .querySelector('.feed-article__button')
      .addEventListener('click', () => showModal('post'));
  }
  return item;
};

const getAlbumItem = ({ id, image }) => {
  const images = image?.split(',').filter(img => img !== '');
  if (!images || !images.length) return;
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
  item.addEventListener('click', () => gotoPage('postpage.html', { postId: id }, [ 'postId' ]));
  return item;
};

const showModal = (type, ...args) => {
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
    case 'product':
      productModal.classList.add('is-modal-active');
      deleteProductModal.classList.remove('is-modal-active');
      if (!args.length) return;
      NAME_SPACE.productId = args[0];
      NAME_SPACE.productLink = args[1];
      NAME_SPACE.productElement = args[2];
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
      NAME_SPACE.postId = args[0];
      NAME_SPACE.feedElement = args[1];
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
  const { productId, productElement } = NAME_SPACE;
  fetch(`${API}/product/${productId}`, reqData('DELETE'))
  .then(() => {
    let count = 1;
    while (!productElement.nextElementSibling) {
      onSale.removeChild(productElement.nextElementSibling);
      count++;
    }
    onSale.removeChild(productElement);
    NAME_SPACE.productSkip = onSale.children.length;
    fetchProduct(count);
    modal.classList.remove('is-modal-active');
    modalWindows.forEach(modal => modal.classList.remove('is-modal-active'));
  });
};

const fetchFollow = () => {
  fetch(`${API}/profile/${NAME_SPACE.user}/follow`, reqData('POST'))
  .then(() => fetchProfile());
};

const follow = () => {
  fetchFollow();
  followButton.classList.remove('is-active');
  unfollowButton.classList.add('is-active');
};

const fetchUnfollow = () => {
  fetch(`${API}/profile/${NAME_SPACE.user}/unfollow`, reqData('DELETE'))
  .then(() => fetchProfile());
};

const unfollow = () => {
  fetchUnfollow();
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
    fetchFeed();
  } else if (id === 'album-type') {
    feedAlbum.classList.add('album-checked');
    feedList.classList.remove('list-checked');
    feedLabels[0].classList.remove('feed__label-list--on');
    feedLabels[1].classList.add('feed__label-album--on');
    fetchFeed();
  }
};

const isFeedList = () => {
  return [...feedButtons].find(btn => btn.checked).id === 'list-type';
};

const deletePost = () => {
  const { postId, feedElement } = NAME_SPACE;
  fetch(`${API}/post/${postId}`, reqData('DELETE'))
  .then(() => {
    let count = 1;
    while (!feedElement.nextElementSibling) {
      feedList.removeChild(feedElement.nextElementSibling);
      count++;
    }
    feedList.removeChild(feedElement);
    NAME_SPACE.feedSkip = feedList.children.length;
    fetchFeedList(count);
    modal.classList.remove('is-modal-active');
    modalWindows.forEach(modal => modal.classList.remove('is-modal-active'));
  });
};

const fetchOneFeed = (id, elem) => {
  fetch(`${API}/post/${id}`, reqData())
  .then(res => res.json())
  .then(({ post }) => {
    const { hearted, heartCount } = post;
    elem.innerHTML = `
    <img src="../images/icon-heart${hearted ? '-active' : ''}.svg" alt="post-like" class="article-heart__btn">
    <span class="article-num">${heartCount}</span>
    `;
    elem.setAttribute('data-hearted', hearted ? 1 : 0);
  });
};

const toggleHeart = ({ currentTarget }) => {
  const { hearted, id } = currentTarget.dataset;
  if (+hearted) {
    fetch(`${API}/post/${id}/unheart`, reqData('DELETE'))
    .then(() => {
      fetchOneFeed(id, currentTarget);
    });
  } else {
    fetch(`${API}/post/${id}/heart`, reqData('POST'))
    .then(() => {
      fetchOneFeed(id, currentTarget);
    });
  }
};

// 헤더 버튼
backButton.addEventListener('click', goBack);
menuButton.addEventListener('click', () => showModal('setting'));

// 프로필 버튼
followersButton.addEventListener('click', () => {
  gotoPage('followList.html', { page: 'followers' }, [ 'user', 'page' ]);
});
followingsButton.addEventListener('click', () => {
  gotoPage('followList.html', { page: 'followings' }, [ 'user', 'page' ]);
});
followButton.addEventListener('click', follow);
unfollowButton.addEventListener('click', unfollow);
modifyButton.addEventListener('click', () => {
  gotoPage('modifyProfile.html');
});
registerButton.addEventListener('click', () => {
  gotoPage('modifyProduct.html', { page: 'addProduct' }, [ 'page' ]);
});

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
productButtons[1].addEventListener('click', () => {
  gotoPage('modifyProduct.html', { page: 'modifyProduct' }, [ 'page', 'productId' ]);
});
productButtons[2].addEventListener('click', () => gotoPage(NAME_SPACE.productLink));
deleteProductButtons[0].addEventListener('click', () => showModal('product'));
deleteProductButtons[1].addEventListener('click', deleteProduct);

// 내 피드 게시물 메뉴 누를 때 뜨는 모달 버튼
postButtons[0].addEventListener('click', hideModal);
myPostButtons[0].addEventListener('click', () => showModal('deletePost'));
myPostButtons[1].addEventListener('click', () => {
  gotoPage('upload.html', { page: 'modifyPost' }, [ 'page', 'postId' ]);
});
deletePostButtons[0].addEventListener('click', () => showModal('myPost'));
deletePostButtons[1].addEventListener('click', deletePost);

// 하단 네비게이션 바 - 프로필 페이지 이동
document
  .querySelector('.nav-profile')
  .addEventListener('click', () => {
    gotoPage('profile.html', { user: localStorage.getItem('accountname') }, [ 'user' ]);
  });

const NAME_SPACE = getNameSpace();
NAME_SPACE.prevProduct = [];
NAME_SPACE.prevFeed = [];
NAME_SPACE.prevAlbum = [];
renderPage();