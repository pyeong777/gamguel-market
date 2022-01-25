function loginCheck() {
  // 팔로잉 리스트 api 패치
  fetch(`${API}/${localStorage.getItem('accountname')}/following`, reqData())
    .then(res => res.json())
    .then(json => {
      if (Array.isArray(json)) {
        // 홈피드로 이동
        setTimeout(() => {
          location.href = "../index.html";
        }, 1200);
      } else {
        // 로그인 페이지로 이동
        setTimeout(() => {
          location.href = "./login.html";
        }, 1200);
      }
    })
}

window.addEventListener("load", loginCheck);