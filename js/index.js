const goSearch = document.querySelector('.header__btn-search');

const showModal = (type, ...args) => {
  modal.classList.add('is-modal-active');
  switch (type) {
    case 'post':
      postModal.classList.add('is-modal-active');
  }
};

const hideModal = (e) => {
  if (e.target !== e.currentTarget) return;
  modal.classList.remove('is-modal-active');
  modalWindows.forEach((modal) => modal.classList.remove('is-modal-active'));
};

const fetchOneFeed = (id, elem) => {
  fetch(`${API}/post/${id}`, reqData())
    .then(res => res.json())
    .then(({ post }) => {
      const { hearted, heartCount } = post;
      elem.innerHTML = `
        <img src="../images/icon-heart${hearted ? '-active' : ''}.svg" alt="post-like" class="article-heart__btn">
        <span class="article-num article-heart__num">${heartCount}</span>
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

goSearch.addEventListener('click', () => {
  location.href = './pages/search.html'
})

// 모달 - setting
const modal = document.querySelector('.modal');
const modalWindows = document.querySelectorAll('.modal-window');
const settingModal = document.querySelector('.modal-bottom__setting');
const logoutModal = document.querySelector('.modal-logout');
const settingButtons = settingModal.querySelectorAll('.modal-bottom__button');
const logoutButtons = logoutModal.querySelectorAll('.modal-confirm__button');

// 모달 - post
const postModal = document.querySelector('.modal-bottom__post');
const postButtons = postModal.querySelectorAll('.modal-bottom__button');

// 메인
const homeMain = document.querySelector('.home-main');

async function getFeed() {
  const { feedSkip } = NAME_SPACE;
  const res = await fetch(`${API}/post/feed/?limit=${feedSkip >= 10 ? 30 : 10}&skip=${feedSkip >= 10 ? feedSkip - 10 : feedSkip}`, reqData());
  const json = await res.json();
  const posts = json.posts;

  if (posts.length) {
    const { prevFeed } = NAME_SPACE;
    let uniquePost;
    if (prevFeed.length) {
      const prevId = prevFeed.map(({ id }) => id);
      uniquePost = posts
        .filter(({ id }) => !prevId.includes(id) && id < prevFeed[0].id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10);
      NAME_SPACE.feedSkip += uniquePost.length;
    } else {
      uniquePost = [...posts];
      NAME_SPACE.feedSkip += posts.length;
    }
    if (uniquePost.length) {
      renderFeed(uniquePost);
      NAME_SPACE.prevFeed = uniquePost;
      return false;
    } else {
      unobserveLastItem(homeMain, 'feed');
      return true;
    }
  } else {
    homeMain.innerHTML = `
      <div class = "main-content">
      <img src="./images/symbol-logo.svg" class="main__logo">
      <p class="main__txt">유저를 검색해 팔로우 해보세요!</p>
      <a href="./pages/search.html" class="main__btn">검색하기</a>
      </div>
    `;
  }
};

const renderFeed = (posts) => {
  const fragment = document.createDocumentFragment();
  posts.forEach(post => {
    const authorImage = post.author.image;
    const id = post.id;
    const authorAccount = post.author.accountname;
    const authorName = post.author.username;
    const commentCount = post.commentCount;
    const content = post.content;
    const heartCount = post.heartCount;
    const hearted = post.hearted;
    const updateDate = "" + post.updatedAt;
    const contentImage = post.image?.split(',');
    let imageHTML = '';
    if (contentImage) {
        if(contentImage.length === 1 && contentImage[0]) {
            imageHTML = `<img src="${contentImage[0]}" alt="post-image" onerror ="this.src='../images/full-logo.svg'" class="article-post__img">`
        } else if (contentImage.length > 1) {
            const arr = [];
            contentImage.forEach(image => {
                arr.push(`<li><img src="${image}" alt="post-image" onerror ="this.src='../images/full-logo.svg'" class="article-post__img--small"></li>`)
            });
            imageHTML = `<ul class="article-post__img-list">${arr.join('')}</ul>`;
        }
    }
    
    const year = updateDate.substring(0, 4);
    const month = updateDate.substring(5, 7);
    const day = updateDate.substring(8, 10);

    const article = document.createElement('article');
    article.classList.add('main-article');

    article.innerHTML = `
    <img src="${authorImage}" alt="profile__img" onerror ="this.src='../images/basic-profile.svg'" class="article-profile">
    <div class="article-container">
        <strong class="article-nickname">${authorName}</strong>
        <strong class="article-id">@ ${authorAccount}</strong>
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
        <strong class="article-date">${year}년 ${month}월 ${day}일</strong>
    </div>
    <button type="button" class="feed-article__button">
        <strong class="sr-only">메뉴</strong>
    </button>   
    `;

    ['profile', 'nickname', 'id']
    .forEach(key => {
    article
        .querySelector(`.article-${key}`)
        .addEventListener('click', () => {
        gotoPage('./pages/profile.html', { user: post.author.accountname }, [ 'user' ]);
        });
    });

    article
        .querySelector('.article-post__img-list')
        ?.addEventListener('mousewheel', horizontalScroll);
    article
        .querySelector('.btn-heart')
        .addEventListener('click', toggleHeart);
    article
        .querySelector('.btn-comment')
        .addEventListener('click', () => {
        gotoPage('./pages/postpage.html', { postId: id }, [ 'postId' ]);
    });
    

    ['cont', 'post__img', 'post__img-list']
    .forEach(key => {
    article
        .querySelector(`.article-${key}`)
        ?.addEventListener('click', () => {
        gotoPage('./pages/postpage.html', { postId: id }, [ 'postId' ]);
        });
    });

    article
    .querySelector('.article-post__img')
    ?.addEventListener('click', () => {
    gotoPage('./pages/postpage.html', { postId: id }, [ 'postId' ]);
    });

    const accountname = localStorage.getItem('accountname');
    const { user } = NAME_SPACE;
    if (user === accountname) {
        article
        .querySelector('.feed-article__button')
        .addEventListener('click', () => showModal('myPost', id));
    } else {
        article
        .querySelector('.feed-article__button')
        .addEventListener('click', () => showModal('post'));
    }
    fragment.appendChild(article);  
  });
  homeMain.appendChild(fragment);
};

const initPage = () => {
  fetch(`${API}/user/checktoken`, reqData())
    .then(res => res.json())
    .then(async ({ isValid }) => {
      if (isValid) {
        NAME_SPACE.feedSkip = 0;
        NAME_SPACE.prevFeed = [];
        NAME_SPACE.feedObserver = new IntersectionObserver(getIoCallback(homeMain, 'feed', getFeed), { threshold: 0.1 });
        await getFeed();
        observeLastItem(homeMain, 'feed');
      }
      else {
        location.href = './pages/login.html';
      }
    });
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


// 모달 dimmed
modal.addEventListener('click', hideModal);

// 피드 게시물 메뉴 누를 때 뜨는 모달 버튼
postButtons[0].addEventListener('click', hideModal);

// 하단 네비게이션 바 - 프로필 페이지 이동
document
  .querySelector('.nav-profile')
  .addEventListener('click', () => {
    gotoPage('pages/profile.html', { user: localStorage.getItem('accountname') }, [ 'user' ]);
  });

const NAME_SPACE = getNameSpace();
initPage();