document.getElementsByClassName("warning").style.display = "none";

// id, pw 입력 시 버튼 활성화
const idInput = document.getElementById('login_id'),
  pwInput = document.getElementById('login_pw');
const loginBtn = document.getElementById('login_btn');


const isActiveLogin = () => {
  let idValue = idInput.value;
  let pwValue = pwInput.value;

  if (
    (idValue && pwValue) &&
    (pwValue.length >= 7) &&
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


//  유효성 검사
$(function () {
  if ("조건1") {
    document.getElementsByClassName("warning").style.display = "none";
  } else {
    document.getElementsByClassName("warning").style.display = "block";
  }
})