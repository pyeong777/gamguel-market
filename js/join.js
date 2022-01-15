// 유틸 함수들

const initActive = (handler, elems) => {
  elems.forEach(elem => {
    elem.addEventListener('input', handler);
    elem.addEventListener('keyup', handler);
  });
};

const isValidEmail = (email) => {
  const emailValidation = /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  return emailValidation.test(email);
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

const isActiveJoin = () => {
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
  } else {
    nextBtn.disabled = true;
    nextBtn.style.opacity = .3;
  }
};

const validateEmail = ({ currentTarget }) => {
  const { value } = currentTarget;
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
      });
  } else {
    showMsg(error1, '올바른 이메일 형식이 아닙니다.');
  }
};

const validatePassword = ({ currentTarget }) => {
  const { value } = currentTarget;
  if (value.length >= 6) return;
  showMsg(error2, '비밀번호는 6자 이상이어야 합니다.');
};

// 이메일 유효성 검사
idInput.addEventListener('blur', validateEmail);
idInput.addEventListener('focus', () => hideMsg(error1));

// 비밀번호 유효성 검사
pwInput.addEventListener('blur', validatePassword);
pwInput.addEventListener('focus', () => hideMsg(error2));

// 다음 버튼
nextBtn.addEventListener('click', () => {
  document.querySelector('.join-membership-container').style.display = "none";
  document.querySelector('.join-membership2-container').style.display = "block";
});

// 모든 input이 유효하면 다음 버튼 활성화
initActive(isActiveJoin, [idInput, pwInput]);


// join 2 - 프로필 설정

const nameInput = document.getElementById('name');
const joinIdInput = document.getElementById('join_id');
const introInput = document.getElementById('introduce');
const startBtn = document.getElementById('start_btn');
const fileInput = document.getElementById('file');

const isActiveStart = () => {
  const nameValue = nameInput.value;
  const joinIdValue = joinIdInput.value;
  const introValue = introInput.value;

  if (
    (nameValue && joinIdValue && introValue) &&
    // 아래는 이미 회원가입 되어 있는 정보라고 가정
    !(joinIdValue == "deepdive123")
  ) {
    startBtn.disabled = false;
    startBtn.style.opacity = 1;
    startBtn.style.cursor = 'pointer';
  }
  else {
    startBtn.disabled = true;
    startBtn.style.opacity = .3;
  }
}

initActive(isActiveStart, [nameInput, joinIdInput, introInput]);


// 유효성 검사
joinIdInput.addEventListener('focus', function () {
  if (this.classList.contains('invalid3')) {
    this.classList.remove('invalid3');
    error3.innerHTML = "";
  }
});

// *영문, 숫자, 밑줄 및 마침표만 사용할 수 있습니다.
joinIdInput.addEventListener('blur', function () {
  let regExp = /[^A-Za-z0-9._]/;

  if (
    regExp.test(joinIdInput.value)
  ) {
    joinIdInput.classList.add('invalid4');
    error4.innerHTML = '*영문, 숫자, 밑줄 및 마침표만 사용할 수 있습니다.';
  } else {
    fetch(`${API}/user`, reqData())
      .then(res => res.json())
      .then(json => {
        if (json.find(({ accountname }) => accountname === joinIdInput.value)) {
          joinIdInput.classList.add('invalid4');
          error4.innerHTML = '*이미 사용 중인 ID입니다.';
        } else {
          joinIdInput.classList.remove('invalid4');
          error4.innerHTML = '';
        }
      });
  }
});

joinIdInput.addEventListener('focus', function () {
  if (this.classList.contains('invalid4')) {
    this.classList.remove('invalid4');
    error4.innerHTML = "";
  }
});





// API 연동
function joinEmail() {
  fetch(`${API}/user`, reqData('POST', {
    user: {
      email: idInput.value,
      password: pwInput.value,
      username: nameInput.value,
      accountname: joinIdInput.value,
      intro: introInput.value,
      image: fileInput.value
    }
  }))
    .then(res => res.json())
    .then(({ user }) => {
      if (!user) return;
      fetch(`${API}/user/login`, reqData('POST', {
        user: {
          email: idInput.value,
          password: pwInput.value
        }
      }))
        .then(res => res.json())
        .then(({ user }) => {
          const { _id, accountname, token } = user;
          localStorage.setItem("token", token);
          localStorage.setItem("userid", _id);
          localStorage.setItem("accountname", accountname);
          location.href = "../index.html";
        });
    });
}

document.querySelector('#start_btn').addEventListener('click', joinEmail);
const NAME_SPACE = getNameSpace();