const uploadBtn = document.querySelector('.upload-bar__btn');
const uploadContent = document.querySelector('.upload-form__content');
const uploadFile = document.getElementById('upload-img');
const imgList = document.querySelector('.img-thumbnail');
const backButton = document.querySelector('.main-header__back');

const initThumbnail = async () => {
  const { initImages } = NAME_SPACE;
  for (const url of initImages) {
    const res = await fetch(url);
    const data = await res.blob();
    const file = new File([data], url.split('/').pop(), { type: `image/${url.split('.').pop()}` });
    NAME_SPACE.files.push(file);
  }
  renderThumbnail();
  activateUpload();
};

const setThumbnail = ({ currentTarget: { files } }) => {
  NAME_SPACE.files = [...NAME_SPACE.files, ...files];
  renderThumbnail();
  activateUpload();
};

const renderThumbnail = () => {
  imgList.innerHTML = '';

  if (NAME_SPACE.files.length === 1) {
    const figure = document.createElement('figure');
    figure.innerHTML = `
      <img src="" onerror="this.src='../images/full-logo.svg'" class="img-big">
      <button type="button" class="delete-img"></button>
    `;
    const reader = new FileReader();
    reader.onload = ({ target: { result } }) => {
      figure.querySelector('img').src = result;
    };
    reader.readAsDataURL(NAME_SPACE.files[0]);
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
        <img src="" onerror="this.src='../images/full-logo.svg'" class="img-small">
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
}

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
  const { files, handler } = NAME_SPACE;
  if (uploadContent.value || files.length) {
    uploadBtn.classList.add('upload-bar__btn--active');
    uploadBtn.addEventListener('click', handler);
  } else {
    uploadBtn.classList.remove('upload-bar__btn--active');
    uploadBtn.removeEventListener('click', handler);
  }
};

const getFileName = async () => {
  const { files } = NAME_SPACE;
  const images = [];
  for (let i = 0; i < files.length; i++) {
    const formData = new FormData();
    formData.append('image', files[i]);
    const res = await fetch(`${API}/image/uploadfile`, {
      method: 'POST',
      body: formData,
    });
    const json = await res.json();
    images.push(`${API}/${json.filename}`);
  }
  return images.join(',');
};

const post = async () => {
  const filename = await getFileName();
  fetch(
    `${API}/post`,
    reqData('POST', {
      post: {
        content: uploadContent.value,
        image: filename
      },
    })
  )
    .then((res) => res.json())
    .then(({ post: { id } }) => {
      gotoPage('postpage.html', { postId: id }, ['postId']);
    });
};

const modify = async () => {
  const filename = await getFileName();
  fetch(
    `${API}/post/${NAME_SPACE.postId}`,
    reqData('PUT', {
      post: {
        content: uploadContent.value,
        image: filename
      },
    })
  )
    .then((res) => res.json())
    .then(({ post: { id } }) => {
      gotoPage('postpage.html', { postId: id }, ['postId']);
    });
};

const initValues = () => {
  const { page, postId } = NAME_SPACE;
  NAME_SPACE.handler = post;
  if (page !== 'modifyPost') return;
  fetch(`${API}/post/${postId}`, reqData())
    .then(res => res.json())
    .then(({ post: { content, image } }) => {
      uploadContent.value = content;
      NAME_SPACE.initImages = image.split(',');
      NAME_SPACE.handler = modify;
      initThumbnail();
    });
};

// 헤더버튼
backButton.addEventListener('click', goBack);

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
initValues();