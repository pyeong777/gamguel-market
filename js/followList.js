// 헤더 버튼
const backButton = document.querySelector('.main-header__back');

// 팔로워 목록
const followList = document.querySelector('.follow__list');

const renderPage = () => {
  if (NAME_SPACE.page === 'followers') {
    fetchFollower();
  } else {
    fetchFollowing();
  }
};

const fetchFollower = () => {
  fetch(`${API}/profile/${NAME_SPACE.user}/follower/?limit=100&skip=0`, reqData())
  .then(res => res.json())
  .then(json => renderList(json));
};

const fetchFollowing = () => {
  fetch(`${API}/profile/${NAME_SPACE.user}/following/?limit=100&skip=0`, reqData())
  .then(res => res.json())
  .then(json => renderList(json));
};

const renderList = (json) => {
  const userid = localStorage.getItem('userid');
  const fragment = document.createDocumentFragment();
  json.reverse().forEach(({ username, accountname, intro, image, follower }) => {
    const item = document.createElement('li');
    const isSelf = localStorage.getItem('accountname') === accountname;
    const isFollowing = follower.includes(userid);
    item.innerHTML = `
    <a href="javascript:void(0)" class="follow__user">
      <img src="${image}" alt="프로필 사진"
      onerror="this.src='../images/Ellipse 1.svg'" class="follow__user-img">
      <p class="follow__user-info">
        <strong class="follow__user-name">${username}</strong>
        <span class="follow__user-desc ellipsis">${intro}</span>
      </p>
    </a>
    <button type="button" data-accountname="${accountname}" class="follow__button follow__button--theme-orange
    ${isSelf ? '' : isFollowing ? '' : 'follow__button--active'} button-follow">팔로우</button>
    <button type="button" data-accountname="${accountname}" class="follow__button follow__button--theme-white
    ${isSelf ? '' : isFollowing ? 'follow__button--active' : ''} button-unfollow">취소</button>
    `;
    item.classList.add('follow__item');
    item
      .querySelector('.follow__user')
      .addEventListener('click', () => {
        gotoPage('profile.html', { user : accountname } , [ 'user' ]);
      });
    item
      .querySelector('.button-follow')
      .addEventListener('click', follow);
    item
      .querySelector('.button-unfollow')
      .addEventListener('click', unfollow);
    fragment.appendChild(item);
  });
  followList.appendChild(fragment);
};

const fetchButton = (elem) => {
  const { parentNode } = elem;
  const followButton = parentNode.querySelector('.button-follow');
  const unfollowButton = parentNode.querySelector('.button-unfollow');
  if (elem === followButton) {
    followButton.classList.remove('follow__button--active');
    unfollowButton.classList.add('follow__button--active');
  } else {
    followButton.classList.add('follow__button--active');
    unfollowButton.classList.remove('follow__button--active');
  }
};

const follow = ({ currentTarget }) => {
  const { accountname } = currentTarget.dataset;
  fetch(`${API}/profile/${accountname}/follow`, reqData('POST'))
  .then(() => fetchButton(currentTarget));
};

const unfollow = ({ currentTarget }) => {
  const { accountname } = currentTarget.dataset;
  fetch(`${API}/profile/${accountname}/unfollow`, reqData('DELETE'))
  .then(() => fetchButton(currentTarget));
};

// 헤더 버튼
backButton.addEventListener('click', goBack);

const NAME_SPACE = getNameSpace();
renderPage();