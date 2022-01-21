const backButton = document.querySelector('.main-header__back');
backButton.addEventListener('click', goBack);

const userContainer = document.querySelector('.main-content');
let searchInput = document.querySelector('#header__input-search');

async function getUser(searchText) {
  const res = await fetch(`${API}/user/searchuser/?keyword=${searchText}`, reqData());
  const data = await res.json();

  data.forEach(user => {
    console.log(user)
    const authorName = user.username;
    const authorAccount = user.accountname;
    const profileImg = user.image;
    const li = document.createElement('li');
    li.classList.add('user-list')

    const sameAuthorName = authorName.split(searchText).join(`<span class='highlight'>${searchText}</span>`);
    const sameAuthorAccount = authorAccount.split(searchText).join(`<span class='highlight'>${searchText}</span>`);

    li.innerHTML = `
    <img src="${profileImg}" class="article-profile" onerror ="this.src='../images/basic-profile.svg'"></img>
    <div>
      <strong class="article-nickname">${sameAuthorName}</strong>
      <strong class="article-id">@ ${sameAuthorAccount}</strong>
    </div>
    `;

    ['profile', 'nickname', 'id']
    .forEach(key => {
    li
      .querySelector(`.article-${key}`)
      .addEventListener('click', () => {
        gotoPage('/pages/profile.html', { user: user.accountname }, [ 'user' ]);
      });
    });

    userContainer.appendChild(li);
  })
}

searchInput.addEventListener('keyup', (e) => {
  if (e.isComposing && e.keyCode === 229) return;
  if(e.target.value === "") {
    removeAllChilden(userContainer);
  } else {
    removeAllChilden(userContainer);
    getUser(e.target.value);
  }
})

function removeAllChilden(parentNode) {
  while (parentNode.hasChildNodes()) {
    parentNode.removeChild(parentNode.firstChild);
  } 
}

// 하단 네비게이션 바 - 프로필 페이지 이동
document
  .querySelector('.nav-profile')
  .addEventListener('click', () => {
    gotoPage('profile.html', { user: localStorage.getItem('accountname') }, [ 'user' ]);
  });

const NAME_SPACE = getNameSpace();