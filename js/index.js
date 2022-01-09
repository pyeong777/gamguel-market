const linkHome = document.querySelector('.nav-home');
const linkMessage = document.querySelector('.nav-message');
const linkEdit = document.querySelector('.nav-edit');
const linkProfile = document.querySelector('.nav-profile');

linkHome.addEventListener('click', () => {
    location.href = "index.html";
});

linkMessage.addEventListener('click', () => {
    location.href = "pages/chatRoom.html";
});

linkEdit.addEventListener('click', () => {
    location.href = "pages/postpage.html";
});

linkProfile.addEventListener('click', () => {
    location.href = "pages/profile.html";
});