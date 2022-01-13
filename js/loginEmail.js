// id, pw 입력 시 버튼 활성화
let idInput = document.getElementById('login_id');
let pwInput = document.getElementById('login_pw');
let loginBtn = document.getElementById('login_btn');


const isActiveLogin = () => {
  let idValue = idInput.value;
  let pwValue = pwInput.value;

  if (
    (idValue && pwValue) &&
    (pwValue.length >= 6) &&
    (idValue.includes('@') || idValue.length >= 10)
  ) {
    loginBtn.disabled = false;
    loginBtn.style.opacity = 1;
    loginBtn.style.cursor = 'pointer';
  }
  else {
    loginBtn.disabled = true;
    loginBtn.style.opacity = .3;
  }
}

const init = () => {
  idInput.addEventListener('input', isActiveLogin);
  pwInput.addEventListener('input', isActiveLogin);
  idInput.addEventListener('keyup', isActiveLogin);
  pwInput.addEventListener('keyup', isActiveLogin);
}

init();


// 링크 클릭 시 페이지 전환
function nextPage() {
  location.href = "./joinMembership.html";
}


// 유효성 검사
let warn = document.querySelector(".warning");

loginBtn.addEventListener('click', loginError);

function loginError() {
  if (
    !(
      (idInput.value == "deepdive@naver.com") &&
      (pwInput.value == "123456")
    )
  ) {
    warn.style.display = "block";
    idInput.classList.add('invalid');
    pwInput.classList.add('invalid');
  } else {
    warn.style.display = "none";
    location.href = "../index.html";
  }
}

idInput.addEventListener('focus', function () {
  if (this.classList.contains('invalid')) {
    this.classList.remove('invalid');
    warn.style.display = "none";
  }
});

pwInput.addEventListener('focus', function () {
  if (this.classList.contains('invalid')) {
    this.classList.remove('invalid');
    warn.style.display = "none";
  }
});