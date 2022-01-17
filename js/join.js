// 유틸 함수들

const initActive = (handler, elems) => {
  elems.forEach(elem => {
    ['input', 'keyup']
      .forEach(event => elem.addEventListener(event, handler));
  });
};

const isValidEmail = (email) => {
  const emailValidation = /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  return emailValidation.test(email);
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


// join 1 - 이메일로 회원가입

const idInput = document.getElementById('login_id');
const pwInput = document.getElementById('login_pw');
const nextBtn = document.getElementById('next_btn');
const error1 = document.getElementById('error1');
const error2 = document.getElementById('error2');

const activateJoin = () => {
  const idValue = idInput.value;
  const pwValue = pwInput.value;

  if (
    idValue &&
    pwValue.length >= 6 &&
    isValidEmail(idValue) &&
    NAME_SPACE.isUniqueEmail
  ) {
    nextBtn.disabled = false;
    nextBtn.style.opacity = 1;
    nextBtn.style.cursor = 'pointer';
    nextBtn.addEventListener('click', gotoNext);
  } else {
    nextBtn.disabled = true;
    nextBtn.style.opacity = .3;
    nextBtn.style.cursor = 'default';
    nextBtn.removeEventListener('click', gotoNext);
  }
};

const validateEmail = ({ currentTarget: { value } }) => {
  NAME_SPACE.isUniqueEmail = false;
  if (isValidEmail(value)) {
    fetch(`${API}/user/emailvalid`, reqData('POST', {
      user: {
        email: value
      }
    }))
      .then(res => res.json())
      .then(json => {
        const { message } = json;
        if (message === '이미 가입된 이메일 주소 입니다.') {
          showMsg(error1, message);
        } else {
          showMsg(error1, '사용 가능한 이메일입니다.', false);
          NAME_SPACE.isUniqueEmail = true;
        }
        activateJoin();
      });
  } else {
    showMsg(error1, '올바른 이메일 형식이 아닙니다.');
  }
};

const validatePassword = ({ currentTarget: { value } }) => {
  if (value.length >= 6) return;
  showMsg(error2, '비밀번호는 6자 이상이어야 합니다.');
};

const gotoNext = () => {
  document.querySelector('.join-form').style.display = "none";
  document.querySelector('.profile-form').style.display = "block";
};

// 이메일 유효성 검사
idInput.addEventListener('blur', validateEmail);
idInput.addEventListener('focus', () => hideMsg(error1));

// 비밀번호 유효성 검사
pwInput.addEventListener('blur', validatePassword);
pwInput.addEventListener('focus', () => hideMsg(error2));

// 모든 input이 유효하면 다음 버튼 활성화
initActive(activateJoin, [idInput, pwInput]);


// join 2 - 프로필 설정

const nameInput = document.getElementById('name');
const joinIdInput = document.getElementById('join_id');
const introInput = document.getElementById('introduce');
const startBtn = document.getElementById('start_btn');
const fileInput = document.getElementById('file');
const profileImage = document.querySelector('.profile-img');
const error3 = document.getElementById('error3');
const error4 = document.getElementById('error4');

const activateStart = () => {
  const nameValue = nameInput.value;
  const joinIdValue = joinIdInput.value;
  const introValue = introInput.value;

  if (
    nameValue.length >= 2 &&
    isValidId(joinIdValue) &&
    NAME_SPACE.isUniqueId &&
    introValue
  ) {
    startBtn.disabled = false;
    startBtn.style.opacity = 1;
    startBtn.style.cursor = 'pointer';
    startBtn.addEventListener('click', joinEmail);
  }
  else {
    startBtn.disabled = true;
    startBtn.style.opacity = .3;
    startBtn.style.cursor = 'default';
    startBtn.removeEventListener('click', joinEmail);
  }
};

const setThumbnail = ({ currentTarget: { files } }) => {
  if (!files.length) return;
  const reader = new FileReader();
  reader.onload = e => {
    profileImage.src = e.target.result;
  };
  reader.readAsDataURL(files[0]);
};

const validateName = ({ currentTarget: { value } }) => {
  if (value.length >= 2) return;
  showMsg(error3, '이름은 2자 이상이어야 합니다.');
};

const validateId = ({ currentTarget: { value } }) => {
  NAME_SPACE.isUniqueId = false;
  if (isValidId(value)) {
    if (!value.length) return;
    fetch(`${API}/user`, reqData())
      .then(res => res.json())
      .then(json => {
        if (json.find(({ accountname }) => accountname === value)) {
          showMsg(error4, '이미 사용 중인 ID입니다.');
        } else {
          showMsg(error4, '사용 가능한 ID입니다.', false);
          NAME_SPACE.isUniqueId = true;
        }
        activateStart();
      });
  } else {
    showMsg(error4, '영문, 숫자, 밑줄 및 마침표만 사용할 수 있습니다.');
  }
};

const getFileName = async () => {
  if (fileInput.files.length) {
    const formData = new FormData();
    formData.append('image', fileInput.files[0]);
    let res = await fetch(`${API}/image/uploadfile`, {
      method: 'POST',
      body: formData
    });
    let json = await res.json();
    const { filename } = json;
    return filename
  } else {
    return "Ellipse.png"
  }
};

const joinEmail = async () => {
  const filename = await getFileName();

  res = await fetch(`${API}/user`, reqData('POST', {
    user: {
      email: idInput.value,
      password: pwInput.value,
      username: nameInput.value,
      accountname: joinIdInput.value,
      intro: introInput.value,
      image: `${API}/${filename}`
    }
  }));
  json = await res.json();

  let { user } = json;
  if (!user) return;

  res = await fetch(`${API}/user/login`, reqData('POST', {
    user: {
      email: idInput.value,
      password: pwInput.value
    }
  }));
  json = await res.json();

  const { _id, accountname, token } = json.user;
  localStorage.setItem("userid", _id);
  localStorage.setItem("accountname", accountname);
  localStorage.setItem("token", token);
  location.href = "../index.html";
};

// 이미지 썸네일
fileInput.addEventListener('change', setThumbnail);

// 이름 유효성 검사
nameInput.addEventListener('blur', validateName);
nameInput.addEventListener('focus', () => hideMsg(error3));

// 아이디 유효성 검사
joinIdInput.addEventListener('blur', validateId);
joinIdInput.addEventListener('focus', () => hideMsg(error4));

// 모든 input이 유효하면 시작 버튼 활성화
initActive(activateStart, [nameInput, joinIdInput, introInput]);

const NAME_SPACE = getNameSpace();