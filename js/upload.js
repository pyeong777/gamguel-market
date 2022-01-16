const uploadBtn = document.querySelector('.upload-bar__btn');
const uploadContent = document.querySelector('.upload-form__content');
const uploadFile = document.getElementById('upload-img');
const imgList = document.querySelector('.img-thumbnail');
const backButton = document.querySelector('.main-header__back');

const setThumbnail = ({ currentTarget: { files } }) => {
  NAME_SPACE.files = [...NAME_SPACE.files, ...files];
  imgList.innerHTML = '';

  if (NAME_SPACE.files.length === 1) {
    const figure = document.createElement('figure');
    figure.innerHTML = `
      <img src="" class="img-big">
      <button type="button" class="delete-img"></button>
    `;
    const reader = new FileReader();
    reader.onload = ({ target: { result } }) => {
      figure.querySelector('img').src = result;
    };
    reader.readAsDataURL(NAME_SPACE.files[0]);
    ``;
    figure
      .querySelector('button')
      .addEventListener('click', () => deleteThumbnail(NAME_SPACE.files[0]));
    figure.classList.add('img-uploaded');
    imgList.appendChild(figure);
  } else {
    const list = document.createElement('ol');
    list.classList.add('img-list');
    [...NAME_SPACE.files].forEach((file) => {
      const item = document.createElement('li');
      item.innerHTML = `
        <img src="" class="img-small">
        <button type="button" class="delete-img"></button>
      `;
      const reader = new FileReader();
      reader.onload = ({ target: { result } }) => {
        item.querySelector('img').src = result;
      };
      reader.readAsDataURL(file);

      item
        .querySelector('button')
        .addEventListener('click', () => deleteThumbnail(file));
      item.classList.add('img-uploaded');
      list.appendChild(item);
    });
    list.addEventListener('mousewheel', horizontalScroll);
    imgList.appendChild(list);
  }
  activateUpload();
};

const deleteThumbnail = (file) => {
  const index = NAME_SPACE.files.indexOf(file);
  NAME_SPACE.files.splice(index, 1);
  setThumbnail({ currentTarget: { files: [] } });
};

const resize = ({ currentTarget }) => {
  currentTarget.style.height = 'auto';
  const { scrollHeight } = currentTarget;
  currentTarget.style.height = 30 + (scrollHeight ?? 0) + 'px';
};

const activateUpload = () => {
  if (uploadContent.value || NAME_SPACE.files.length) {
    uploadBtn.classList.add('upload-bar__btn--active');
  } else {
    uploadBtn.classList.remove('upload-bar__btn--active');
  }
};

const getFileName = () => {
  const { files } = NAME_SPACE;
  const images = [];
  files.forEach((file) => {
    const formData = new FormData();
    formData.append('image', file);
    fetch(`${API}/image/uploadfile`, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then(({ filename }) => images.push(filename));
  });
  return images.join(',');
};

const post = async () => {
  fetch(
    `${API}/post`,
    reqData('POST', {
      post: {
        content: uploadContent.value,
        image: getFileName(),
      },
    })
  )
    .then((res) => res.json())
    .then(({ post: { id } }) => {
      gotoPage('postpage.html', { postId: id }, ['postId']);
    });
};

// 헤더버튼
backButton.addEventListener('click', goBack);
uploadBtn.addEventListener('click', post);

// 업로드 버튼 활성화
uploadContent.addEventListener('keydown', activateUpload);
uploadContent.addEventListener('keyup', activateUpload);

// textarea 크기 조절
uploadContent.addEventListener('keydown', resize);
uploadContent.addEventListener('keyup', resize);

// 이미지 썸네일
uploadFile.addEventListener('change', setThumbnail);

const NAME_SPACE = getNameSpace();
NAME_SPACE.files = [];
