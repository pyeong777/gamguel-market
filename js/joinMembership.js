// id, pw 입력 시 버튼 활성화
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

const init = () => {
  idInput.addEventListener('input', isActiveJoin);
  pwInput.addEventListener('input', isActiveJoin);
  idInput.addEventListener('keyup', isActiveJoin);
  pwInput.addEventListener('keyup', isActiveJoin);
}

init();


// 버튼 클릭 시 페이지 전환
function nextPage() {
  location.href = "./joinMembership2.html";
}


// 유효성 검사
// id
login_id.onblur = function () {
  if (
    (login_id.value.includes('@')) &&
    (login_id.value == "deepdive@naver.com")
  ) {
    login_id.classList.add('invalid');
    error.innerHTML = '*이미 가입된 이메일 주소입니다.'
  }
};

login_id.onfocus = function () {
  if (this.classList.contains('invalid')) {
    this.classList.remove('invalid');
    error.innerHTML = "";
  }
};

// pw
login_pw.onblur = function () {
  if (
    (login_pw.value.length < 6)
  ) {
    login_pw.classList.add('invalid');
    error2.innerHTML = '*비밀번호는 6자 이상이어야 합니다.'
  }
};

login_pw.onfocus = function () {
  if (this.classList.contains('invalid')) {
    this.classList.remove('invalid');
    error2.innerHTML = "";
  }
};