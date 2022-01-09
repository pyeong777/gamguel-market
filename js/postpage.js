const commentBtn = document.querySelector('.comment-btn');
const postBtn = document.querySelector('.post-btn');
const postInput = document.querySelector('.post-input');
const postModal = document.querySelector('.post-modal');
const reportBtn = document.querySelector('.post-modal__content__report-btn');
const cancleBtn = document.querySelector('.modal-confirm__button--no');
const newModal = document.querySelector('.modal-window');

postInput.addEventListener('keydown', (e) => {
  postBtn.classList.add('on');
});

postBtn.addEventListener('click', (e) => {
  postInput.value = '';
  postBtn.classList.remove('on');
});

commentBtn.addEventListener('click', (e) => {
  postModal.classList.toggle('show');
});

reportBtn.addEventListener('click', (e) => {
  newModal.classList.add('show');
  postModal.classList.remove('show');
});

cancleBtn.addEventListener('click', (e) => {
  newModal.classList.remove('show');
});
