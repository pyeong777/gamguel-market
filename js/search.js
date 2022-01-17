const backButton = document.querySelector('.main-header__back');
backButton.addEventListener('click', goBack);

// 하단 네비게이션 바 - 프로필 페이지 이동
document
  .querySelector('.nav-profile')
  .addEventListener('click', () => {
    gotoPage('profile.html', { user: localStorage.getItem('accountname') }, [ 'user' ]);
  });

const NAME_SPACE = getNameSpace();