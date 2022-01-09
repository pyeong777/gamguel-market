// id, pw 입력 시 버튼 활성화
const idInput = document.getElementById('login_id'),
  pwInput = document.getElementById('login_pw');
const nextBtn = document.getElementById('next_btn');

const isActiveJoin = () => {
  let idValue = idInput.value;
  let pwValue = pwInput.value;

  if (
    (idValue && pwValue) &&
    (pwValue.length >= 7) &&
    (idValue.includes('@') || idValue.length >= 10)
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


//  유효성 검사
$(function () {
  if ("조건1") {
    document.getElementsByClassName("warning").style.display = "none";
  } else {
    document.getElementsByClassName("warning").style.display = "block";
  }
})