const homeContainer = document.querySelector('.home-main');

console.log(localStorage.getItem("token"));
if(localStorage.getItem("token")) {
    getFeed();
} else {
    location.href = './pages/login.html';
}

async function getFeed() {
    async function getFeed() {
        const url = "http://146.56.183.55:5050"
        const token = localStorage.getItem("token")
        const res = await fetch(url+"/post/feed",{
            method:"GET",
            headers:{
                "Authorization" : `Bearer ${token}`,
                "Content-type" : "application/json"
            }
        })
        const json = await res.json()
  
        const posts = json.posts
        console.log(posts)

        if( posts.length == 0 ) {
            homeContainer.innerHTML += `
                <div class = "main-content">
                <img src="./images/symbol-logo.svg" class="main__logo">
                <p class="main__txt">유저를 검색해 팔로우 해보세요!</p>
                <a href="./pages/search.html" class="main__btn">검색하기</a>
                </div>
            `
        } else {
            posts.forEach(post => {
                const authorImage = post.author.image;
                const id = post.author._id;
                const authorAccount = post.author.accountname;
                const authorName = post.author.username;
                const commentCount = post.commentCount;
                const content = post.content;
                const heartCount = post.heartCount;
                const hearted = post.hearted;
                const updateDate = "" + post.updatedAt;
                const contentImage = post.image.split(',');
                let imageHTML = '';
                if(contentImage.length === 1 && contentImage[0]) {
                    imageHTML = `<img src="${contentImage[0]}" alt="post-image" class="article-post__img">`
                } else if (contentImage.length > 1) {
                    const arr = [];
                    contentImage.forEach(image => {
                        arr.push(`<img src="${image}" alt="post-image" class="article-post__img--small">`)
                    });
                    imageHTML = `<ul class="article-post__img-list">${arr.join('')}</ul>`;
                }
                
                const year = updateDate.substring(0, 4);
                const month = updateDate.substring(5, 7);
                const day = updateDate.substring(8, 10);

                homeContainer.innerHTML+=`
                <article class="main-article">
                <img src="${authorImage}" alt="profile__img" class="article-profile">
                <div class="article-container">
                    <strong class="article-nickname">${authorName}</strong>
                    <strong class="article-id">@ ${authorAccount}</strong>
                    <p class="article-cont">${content}</p>
                    ${imageHTML}
                    <button type="button" data-hearted="${hearted ? 1 : 0}" data-id="${id}" class="btn-heart">
                        <img src="../images/icon-heart.svg" alt="post-like" class="article-heart__btn">
                        <span class="article__num">${heartCount}</span>
                    </button>
                    <button type="button" class="btn-comment">
                        <img src="../images/icon-comment.svg" alt="post-comment" class="article-comment__btn">
                        <span class="article__num">${commentCount}</span>
                    </button>
                    <strong class="article-date">${year}년 ${month}월 ${day}일</strong>
                </div>
                </article>           
                `;
            });
        }
    }
    getFeed()
}