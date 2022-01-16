// 헤더 버튼
const backButton = document.querySelector('.main-header__back');
const menuButton = document.querySelector('.main-header__button');

// 모달 - setting
const modal = document.querySelector('.modal');
const modalWindows = document.querySelectorAll('.modal-window');
const settingModal = document.querySelector('.modal-bottom__setting');
const logoutModal = document.querySelector('.modal-logout');
const reportModal = document.querySelector('.modal-report');
const settingButtons = settingModal.querySelectorAll('.modal-bottom__button');
const logoutButtons = logoutModal.querySelectorAll('.modal-confirm__button');

// 모달 - post
const postModal = document.querySelector('.modal-bottom__post');
const postButtons = postModal.querySelectorAll('.modal-bottom__button');

// 모달 - myPost
const myPostModal = document.querySelector('.modal-bottom__post--my-account');
const deletePostModal = document.querySelector('.modal-delete-posting');
const myPostButtons = myPostModal.querySelectorAll('.modal-bottom__button');
const deletePostButtons = deletePostModal.querySelectorAll('.modal-confirm__button');

// 모달 - myComment
const commentModal = document.querySelector('.modal-bottom__comment--my-account');
const commentButton = commentModal.querySelector('.modal-bottom__button');
const deleteCommentModal = document.querySelector('.modal-delete-comment');
const deleteCommentButtons = deleteCommentModal.querySelectorAll('.modal-confirm__button');

// 댓글
const postBtn = document.querySelector('.post-btn');
const postInput = document.querySelector('.post-input');
const postProfile = document.querySelector('.post-profile');

const logout = () => {
  localStorage.clear();
  location.href = '../pages/splashScreen.html';
};

const showModal = (type, ...args) => {
  modal.classList.add('is-modal-active');
  const [id] = args;
  switch (type) {
    case 'setting':
      settingModal.classList.add('is-modal-active');
      logoutModal.classList.remove('is-modal-active');
      break;
    case 'logout':
      settingModal.classList.remove('is-modal-active');
      logoutModal.classList.add('is-modal-active');
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
      break;
    case 'comment':
      commentModal.classList.add('is-modal-active');
      deleteCommentModal.classList.remove('is-modal-active');
      if (!args.length) return;
      NAME_SPACE.commentId = id;
      break;
    case 'deleteComment':
      commentModal.classList.remove('is-modal-active');
      deleteCommentModal.classList.add('is-modal-active');
  }
};

const hideModal = (e) => {
  if (e.target !== e.currentTarget) return;
  modal.classList.remove('is-modal-active');
  modalWindows.forEach((modal) => modal.classList.remove('is-modal-active'));
};

const fetchFeed = () => {
  fetch(`${API}/post/${NAME_SPACE.postId}`, reqData())
    .then((res) => res.json())
    .then((json) => renderFeed(json));
};

const renderFeed = (json) => {
  const { post } = json;

  const {
    id,
    content,
    image,
    createdAt,
    hearted,
    heartCount,
    commentCount,
    author,
  } = post;
  const images = image.split(',');
  let imageHTML = '';
  if (images.length === 1 && images[0]) {
    imageHTML = `<img src="${images[0]}" alt="감귤 사진" class="article-post__img">`;
  } else if (images.length > 1) {
    const arr = [];
    images.forEach((image) => {
      arr.push(
        `<li><img src="${image}" alt="감귤 사진" class="article-post__img--small"></li>`
      );
    });
    imageHTML = `<ul class="article-post__img-list">${arr.join('')}</ul>`;
  }
  const year = createdAt.slice(0, 4);
  const month = createdAt.slice(5, 7);
  const day = createdAt.slice(8, 10);
  const item = document.querySelector('.main-article');
  item.innerHTML = `  
  <img src="${
    author.image
  }" alt="profile__img" onerror="this.src='../images/Ellipse 1.svg'" class="article-profile">
  <div class="article-container">
      <p class="article-nickname">${author.username}</p>
      <p class="article-id">${author.accountname}</p>
      <p class="article-cont">
      ${content}
      </p>
      ${imageHTML}
      <button type="button" data-hearted="${
        hearted ? 1 : 0
      }" data-id="${id}" class="btn-heart">
        <img src="../images/icon-heart${
          hearted ? '-active' : ''
        }.svg" alt="post-like" class="article-heart__btn">
        <span class="article-heart__num">${heartCount}</span>
      </button>
      <img src="../images/icon-comment.svg" alt="post-comment" class="article-comment__btn">
      <span class="article-comment__num">${commentCount}</span>
      <p class="article-date">${year}년 ${month}월 ${day}일</p>
      <button type="button" class="feed-article__button">
      <strong class="sr-only">메뉴</strong>
      </button>
  </div>`;

  item
    .querySelector('.article-post__img-list')
    ?.addEventListener('mousewheel', horizontalScroll);
  item.querySelector('.btn-heart').addEventListener('click', toggleHeart);

  const accountname = localStorage.getItem('accountname');
  if (NAME_SPACE.user === accountname) {
    item
      .querySelector('.feed-article__button')
      .addEventListener('click', () => showModal('myPost', id));
  } else {
    item
      .querySelector('.feed-article__button')
      .addEventListener('click', () => showModal('post'));
  }
};

const deletePost = () => {
  fetch(`${API}/post/${NAME_SPACE.postId}`, reqData('DELETE'))
    .then(() => {
      gotoPage('main.html');
    });
};

const fetchOneFeed = (id, elem) => {
  fetch(`${API}/post/${id}`, reqData())
    .then((res) => res.json())
    .then(({ post }) => {
      const { hearted, heartCount } = post;
      elem.innerHTML = `
    <img src="../images/icon-heart${
      hearted ? '-active' : ''
    }.svg" alt="post-like" class="article-heart__btn">
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

const fetchComment = () => {
  fetch(`${API}/post/${NAME_SPACE.postId}/comments`, reqData())
    .then((res) => res.json())
    .then((json) => renderComment(json));
};

const renderComment = (json) => {
  const { comments } = json;
  const commentList = document.querySelector('.comment-list');
  const fragment = document.createDocumentFragment();
  commentList.innerHTML = '';
  comments.reverse().forEach(({ id, content, createdAt, author }) => {
    const item = document.createElement('li');
    item.innerHTML = `  
    <img src="${
      author.image
    }" alt="Customer__img" onerror="this.src='../images/Ellipse 1.svg'" class="user-img">
    <div class="comment-content">
      <div class="comment-author">
        <h2 class="user-name">${author.username}</h2>
        <span> · ${getElapsedTime(createdAt)} 전</span>
      </div>
      <button type="button" class="comment-btn">
        <img src="../images/s-icon-more-vertical.svg" alt="신고 모달창">
      </button>
      <p>${content}</p>
    </div>`;
    item.classList.add('comment');
    fragment.appendChild(item);
    item
      .querySelector('.user-img')
      .addEventListener('click', () => {
        gotoPage('profile.html', { user: author.accountname }, [ 'user' ]);
      });
    item
      .querySelector('.user-name')
      .addEventListener('click', () => {
        gotoPage('profile.html', { user: author.accountname }, [ 'user' ]);
      });
    const accountname = localStorage.getItem('accountname');
    if (author.accountname === accountname) {
      item
        .querySelector('.comment-btn')
        .addEventListener('click', () => showModal('comment', id));
    } else {
      item
        .querySelector('.comment-btn')
        .addEventListener('click', () => showModal('post'));
    }
  });
  commentList.appendChild(fragment);
};

const fetchCommentImage = () => {
  const accountname = localStorage.getItem('accountname');
  fetch(`${API}/profile/${accountname}`, reqData())
    .then((res) => res.json())
    .then(({ profile }) => (postProfile.src = profile.image));
};

const deleteComment = () => {
  const { postId, commentId } = NAME_SPACE;
  fetch(`${API}/post/${postId}/comments/${commentId}`, reqData('DELETE'))
    .then(() => {
      fetchComment();
      modal.classList.remove('is-modal-active');
      modalWindows.forEach((modal) => modal.classList.remove('is-modal-active'));
    });
};

const getElapsedTime = (time) => {
  const ms = Date.parse(time);
  const now = Date.now();
  const diff = (now - ms) / 1000;
  if (diff < MINUTE) return `${parseInt(diff)}초`;
  else if (diff < HOUR) return `${parseInt(diff / MINUTE)}분`;
  else if (diff < DAY) return `${parseInt(diff / HOUR)}시간`;
  else if (diff < MONTH) return `${parseInt(diff / DAY)}일`;
  else return `${parseInt(diff / MONTH)}달`;
};

const addComment = () => {
  const { value } = postInput;
  if (value === '') return;
  fetch(`${API}/post/${NAME_SPACE.postId}/comments`, reqData('POST', {
    comment: {
      content: value,
    },
  }))
    .then(() => {
      postInput.value = '';
      fetchComment();
    });
};

// 헤더 버튼
backButton.addEventListener('click', goBack);
menuButton.addEventListener('click', () => showModal('setting'));

// 모달 dimmed
modal.addEventListener('click', hideModal);

// 상단 메뉴 버튼 누른 후 뜨는 모달 버튼
settingButtons[0].addEventListener('click', hideModal);
settingButtons[1].addEventListener('click', () => showModal('logout'));
logoutButtons[0].addEventListener('click', () => showModal('setting'));
logoutButtons[1].addEventListener('click', logout);

// 내 피드 게시물 메뉴 누를 때 뜨는 모달 버튼
postButtons[0].addEventListener('click', hideModal);
myPostButtons[0].addEventListener('click', () => showModal('deletePost'));
myPostButtons[1].addEventListener('click', () => {
  gotoPage('upload.html', { page: 'modifyPost' }, [ 'page', 'postId' ]);
});
deletePostButtons[0].addEventListener('click', () => showModal('myPost'));
deletePostButtons[1].addEventListener('click', deletePost);

// 내 댓글 모달 버튼
commentButton.addEventListener('click', () => showModal('deleteComment'));
deleteCommentButtons[0].addEventListener('click', () => showModal('comment'));
deleteCommentButtons[1].addEventListener('click', deleteComment);

// 댓글
postInput.addEventListener('keydown', () => {
  if (postInput.value === '') postBtn.classList.remove('on');
  else postBtn.classList.add('on');
});

postBtn.addEventListener('click', addComment);

const NAME_SPACE = getNameSpace();
fetchFeed();
fetchComment();
fetchCommentImage();