const goSearch = document.querySelector('.header__btn-search');
const NAME_SPACE = getNameSpace();

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

const deletePost = () => {
    fetch(`${API}/post/${NAME_SPACE.postId}`, reqData('DELETE'))
      .then(() => {
        gotoPage('main.html');
      });
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
})
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

// 메인
const homeMain = document.querySelector('.home-main');

if(localStorage.getItem("token")) {
    getFeed();
} else {
    location.href = './pages/login.html';
}

async function getFeed() {
    async function getFeed() {
        const res = await fetch(`${API}/post/feed/?limit=100&skip=0`, reqData())
        const json = await res.json();
        const posts = json.posts;

        if( posts.length == 0 ) {
            homeMain.innerHTML = `
                <div class = "main-content">
                <img src="./images/symbol-logo.svg" class="main__logo">
                <p class="main__txt">유저를 검색해 팔로우 해보세요!</p>
                <a href="./pages/search.html" class="main__btn">검색하기</a>
                </div>
            `
        } else {
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
        }
    }
    getFeed()
}


// 모달 dimmed
modal.addEventListener('click', hideModal);

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
    gotoPage('pages/profile.html', { user: localStorage.getItem('accountname') }, [ 'user' ]);
  });