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


// 유효성 검사


// loginBtn.addEventListener('click', loginError);

// function loginError() {
//   if (
//     !(
//       (idInput.value == "deepdive@naver.com") &&
//       (pwInput.value == "123456")
//     )
//   ) {
//     warn.style.display = "block";
//     idInput.classList.add('invalid');
//     pwInput.classList.add('invalid');
//   } else {
//     warn.style.display = "none";
//     location.href = "../index.html";
//   }
// }

// idInput.addEventListener('focus', function () {
//   if (this.classList.contains('invalid')) {
//     this.classList.remove('invalid');
//     warn.style.display = "none";
//   }
// });

// pwInput.addEventListener('focus', function () {
//   if (this.classList.contains('invalid')) {
//     this.classList.remove('invalid');
//     warn.style.display = "none";
//   }
// });

async function login() {
  try {
  const email = document.querySelector("#login_id").value
  const pw = document.querySelector("#login_pw").value
  const url = "http://146.56.183.55:5050"
  const loginData = {
          "user":{
                  "email": email,
                  "password": pw
                  }
          }
  const res = await fetch(url+'/user/login',{
      method:"POST",
      headers:{
          "Content-type" : "application/json"
      },
      body:JSON.stringify(loginData)
  })
  const json = await res.json()

  localStorage.setItem("token",json.user.token)
  localStorage.setItem("userid",json.user._id)
  localStorage.setItem("accountname",json.user.accountname)

  location.href = "../index.html"
} 
 catch (error) {
  const errorMsg = document.querySelector(".warning");
  errorMsg.innerText = "";
  errorMsg.innerText = "*이메일 또는 비밀번호가 일치하지 않습니다.";
  }
}

document.querySelector('#login_btn').addEventListener("click", login);