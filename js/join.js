// join 1 - 이메일로 회원가입
//id, pw 입력 시 버튼 활성화
const idInput = document.getElementById('login_id');
const pwInput = document.getElementById('login_pw');
const nextBtn = document.getElementById('next_btn');

const isActiveJoin = () => {
  let idValue = idInput.value;
  let pwValue = pwInput.value;

  if (
    (idValue && pwValue) &&
    (pwValue.length >= 6) &&
    (idValue.includes('@')) &&
    // 아래는 이미 회원가입 되어 있는 정보라고 가정
    !(idValue == "deepdive@naver.com")
    // !(pwValue == "123456")
  ) {
    nextBtn.disabled = false;
    nextBtn.style.opacity = 1;
    nextBtn.style.cursor = 'pointer';
  }
  else {
    nextBtn.disabled = true;
    nextBtn.style.opacity = .3;
  }
}

const initJoin = () => {
  idInput.addEventListener('input', isActiveJoin);
  pwInput.addEventListener('input', isActiveJoin);
  idInput.addEventListener('keyup', isActiveJoin);
  pwInput.addEventListener('keyup', isActiveJoin);
}

initJoin();


// 버튼 클릭 시 
nextBtn.addEventListener('click', () => {
  document.querySelector('.join-membership-container').style.display = "none";
  document.querySelector('.join-membership2-container').style.display = "block";
});


// 유효성 검사 (addEventListener로 수정)
// id
idInput.addEventListener('blur', () => {
  const emailValidation = /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  if (emailValidation.test(idInput.value)) {
    fetch('http://146.56.183.55:5050/user/emailvalid', reqData('POST', {
      user: {
        email: idInput.value
      }
    }))
      .then(res => res.json())
      .then(json => {
        const { message } = json;
        if (message === '이미 가입된 이메일 주소 입니다.') error1.textContent = message;
      });
  } else {
    error1.textContent = '올바른 이메일 형식이 아닙니다.'
  }

});

idInput.addEventListener('focus', function () {
  if (this.classList.contains('invalid1')) {
    this.classList.remove('invalid1');
    error1.innerHTML = "";
  }
});


// pw
pwInput.addEventListener('blur', function () {
  if (
    (pwInput.value.length < 6)
  ) {
    pwInput.classList.add('invalid2');
    error2.innerHTML = '*비밀번호는 6자 이상이어야 합니다.'
  }
});


pwInput.addEventListener('focus', function () {
  if (this.classList.contains('invalid2')) {
    this.classList.remove('invalid2');
    error2.innerHTML = "";
  }
});





// join 2 - 프로필 설정
// name, id, introduce 입력 시 버튼 활성화
const nameInput = document.getElementById('name');
const joinIdInput = document.getElementById('join_id');
const introInput = document.getElementById('introduce');
const startBtn = document.getElementById('start_btn');
const fileInput = document.getElementById('file');

const isActiveStart = () => {
  let nameValue = nameInput.value;
  let joinIdValue = joinIdInput.value;
  let introValue = introInput.value;

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

const initStart = () => {
  nameInput.addEventListener('input', isActiveStart);
  joinIdInput.addEventListener('input', isActiveStart);
  introInput.addEventListener('input', isActiveStart);
  nameInput.addEventListener('keyup', isActiveStart);
  joinIdInput.addEventListener('keyup', isActiveStart);
  introInput.addEventListener('keyup', isActiveStart);
}

initStart();


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
    fetch(`http://146.56.183.55:5050/user`, reqData())
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
  fetch('http://146.56.183.55:5050/user', reqData('POST', {
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
      fetch('http://146.56.183.55:5050/user/login', reqData('POST', {
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