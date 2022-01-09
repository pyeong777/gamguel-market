// name, id, introduce 입력 시 버튼 활성화
const nameInput = document.getElementById('name'),
  idInput = document.getElementById('id'),
  introduceInput = document.getElementById('introduce');
const startBtn = document.getElementById('start_btn');

const isActiveStart = () => {
  let nameValue = nameInput.value;
  let idValue = idInput.value;
  let introduceValue = introduceInput.value;

  if (
    (nameValue && idValue && introduceValue)
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

const init = () => {
  nameInput.addEventListener('input', isActiveStart);
  idInput.addEventListener('input', isActiveStart);
  introduceInput.addEventListener('input', isActiveStart);
  nameInput.addEventListener('keyup', isActiveStart);
  idInput.addEventListener('keyup', isActiveStart);
  introduceInput.addEventListener('keyup', isActiveStart);
}

init();


// 버튼 클릭 시 페이지 전환
function nextPage() {
  location.href = "../index.html";
}


// 유효성 검사
$(function () {
  if ("조건1") {
    document.getElementsByClassName("warning").style.display = "none";
  } else {
    document.getElementsByClassName("warning").style.display = "block";
  }
})

