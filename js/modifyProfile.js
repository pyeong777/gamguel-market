// 헤더 버튼
const backButton = document.querySelector('.main-header__back');
const saveButton = document.querySelector('.main-header__button');

// 프로필 정보
const fileInput = document.getElementById('file');
const nameInput = document.getElementById('name');
const idInput = document.getElementById('id');
const introInput = document.getElementById('introduce');
const profileImage = document.querySelector('.profile-img');

// 에러 메시지
const nameError = document.querySelector('.profile__error--name');
const idError = document.querySelector('.profile__error--id');


const initActive = (handler, elems) => {
  elems.forEach(elem => {
    ['input', 'keyup']
      .forEach(event => elem.addEventListener(event, handler));
  });
};

const isValidId = (id) => {
  const idValidation = /[^A-Za-z0-9._]/;
  return !idValidation.test(id);
};

const showMsg = (elem, msg, isError = true) => {
  if (isError) {
    elem.textContent = '*' + msg;
  } else {
    elem.textContent = msg;
    elem.style.color = 'rgb(52, 188, 97)';
  }
};

const hideMsg = (elem) => {
  if (elem.textContent !== '') {
    elem.textContent = '';
    elem.style.color = 'rgb(255, 0, 0)';
  }
};

const activateSave = () => {
  const nameValue = nameInput.value;
  const idValue = idInput.value;
  const introValue = introInput.value;
  
  if (
    nameValue.length >= 2 &&
    isValidId(idValue) &&
    NAME_SPACE.isUniqueId &&
    introValue
  ) {
    saveButton.disabled = false;
    saveButton.classList.add('main-header__button--active');
    saveButton.addEventListener('click', saveProfile);
  } else {
    saveButton.disabled = true;
    saveButton.classList.remove('main-header__button--active');
    saveButton.removeEventListener('click', saveProfile);
  }
};

const setThumbnail = ({ currentTarget: { files } }) => {
  if (!files.length) return;
  const reader = new FileReader();
  reader.onload = ({ target: { result } }) => {
    profileImage.src = result;
  };
  reader.readAsDataURL(files[0]);
};

const validateName = ({ currentTarget: { value } }) => {
  if (value.length >= 2) return;
  showMsg(nameError, '이름은 2자 이상이어야 합니다.');
};

const validateId = ({ currentTarget: { value } }) => {
  NAME_SPACE.isUniqueId = false;
  const curId = localStorage.getItem('accountname');
  if (value === curId) {
    showMsg(idError, '사용 가능한 ID입니다.', false);
    NAME_SPACE.isUniqueId = true;
    activateSave();
  } else if (isValidId(value)) {
    if (!value.length) return;
    fetch(`${API}/user/accountnamevalid`, reqData('POST', {
      user: { accountname: value }
    }))
      .then(res => res.json())
      .then(({ message }) => {
        if (message === '이미 가입된 계정ID 입니다.') {
          showMsg(idError, '이미 사용 중인 ID입니다.');
        } else {
          showMsg(idError, '사용 가능한 ID입니다.', false);
          NAME_SPACE.isUniqueId = true;
        }
        activateSave();
      });
  } else {
    showMsg(idError, '영문, 숫자, 밑줄 및 마침표만 사용할 수 있습니다.');
  }
};

const getFileName = async () => {
  const formData = new FormData();
  if (fileInput.files.length) {
    formData.append('image', fileInput.files[0]);
    let res = await fetch(`${API}/image/uploadfile`, {
      method: 'POST',
      body: formData
    });
    let json = await res.json();
    const { filename } = json;
    return filename
  } else {
    return profileImage.src.split('/').pop();
  }
};

const saveProfile = async () => {
  const filename = await getFileName();
  fetch(`${API}/user`, reqData('PUT', {
    user: {
      username: nameInput.value,
      accountname: idInput.value,
      intro: introInput.value,
      image: `${API}/${filename}`
    }
  }))
    .then(res => res.json())
    .then(({ user: { accountname } }) => {
      localStorage.setItem('accountname', accountname);
      gotoPage('profile.html', { user: accountname }, [ 'user' ]);
    });
};

const initValues = () => {
  fetch(`${API}/user`, reqData())
    .then(res => res.json())
    .then(json => {
      const { image, username, accountname, intro } = json.find(({ accountname }) => {
        return accountname === localStorage.getItem('accountname');
      });
      profileImage.src = image;
      nameInput.value = username;
      idInput.value = accountname;
      introInput.value = intro;
    });
};

// 헤더 버튼
backButton.addEventListener('click', goBack);
saveButton.addEventListener('click', saveProfile);

// 이미지 썸네일
fileInput.addEventListener('change', setThumbnail);

// 이름 유효성 검사
nameInput.addEventListener('blur', validateName);
nameInput.addEventListener('focus', () => hideMsg(nameError));

// 아이디 유효성 검사
idInput.addEventListener('blur', validateId);
idInput.addEventListener('focus', () => hideMsg(idError));

// 모든 input이 유효하면 시작 버튼 활성화
initActive(activateSave, [nameInput, idInput, introInput]);

const NAME_SPACE = getNameSpace();
initValues();