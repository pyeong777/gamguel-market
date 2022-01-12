// name, id, introduce 입력 시 버튼 활성화
let nameInput = document.getElementById('name');
let idInput = document.getElementById('join_id');
let introduceInput = document.getElementById('introduce');
let startBtn = document.getElementById('start_btn');

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
// * 이미 사용중인 아이디입니다.
idInput.onblur = function () {
  if (
    (idInput.value == "deepdive123")
  ) {
    idInput.classList.add('invalid');
    error.innerHTML = '*이미 사용중인 아이디입니다.';
  }
};

idInput.onfocus = function () {
  if (this.classList.contains('invalid')) {
    this.classList.remove('invalid');
    error.innerHTML = "";
  }
};


// *영문, 숫자, 밑줄 및 마침표만 사용할 수 있습니다.
idInput.onblur = function () {
  let regExp = /[A-Za-z0-9]/;

  if (
    !(
      (regExp.test(idInput.value)) ||
      (idInput.value.includes('_')) ||
      (idInput.value.includes('.'))
    )
  ) {
    idInput.classList.add('invalid');
    error2.innerHTML = '*영문, 숫자, 밑줄 및 마침표만 사용할 수 있습니다.';
  }
};

idInput.onfocus = function () {
  if (this.classList.contains('invalid')) {
    this.classList.remove('invalid');
    error2.innerHTML = "";
  }
};