// 헤더 버튼
const backButton = document.querySelector('.main-header__back');
const saveButton = document.querySelector('.main-header__button');

// 상품 정보
const fileInput = document.getElementById('file');
const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const urlInput = document.getElementById('link');
const productImage = document.querySelector('.input-area__img');

// 에러 메시지
const nameError = document.querySelector('.input-area__error--name');
const priceError = document.querySelector('.input-area__error--price');
const urlError = document.querySelector('.input-area__error--url');


const initActive = (handler, elems) => {
  elems.forEach(elem => {
    ['input', 'keyup']
      .forEach(event => elem.addEventListener(event, handler));
  });
};

const isValidURL = (url) => {
  const urlValidation = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
  return urlValidation.test(url);
};

const showMsg = (elem, msg, isError = true) => {
  if (isError) {
    elem.textContent = '*' + msg;
  } else {
    elem.textContent = msg;
    elem.style.color = 'rgb(52, 188, 97)';
  }
};

const hideMsg = (elem) => {
  if (elem.textContent !== '') {
    elem.textContent = '';
    elem.style.color = 'rgb(255, 0, 0)';
  }
};

const activateSave = () => {
  const nameValue = nameInput.value;
  const priceValue = +priceInput.value;
  const urlValue = urlInput.value;
  
  if (
    nameValue.length >= 2 &&
    priceValue >= 0 &&
    isValidURL(urlValue)
  ) {
    saveButton.disabled = false;
    saveButton.classList.add('main-header__button--active');
    saveButton.addEventListener('click', saveProduct);
  } else {
    saveButton.disabled = true;
    saveButton.classList.remove('main-header__button--active');
    saveButton.removeEventListener('click', saveProduct);
  }
};

const setThumbnail = ({ currentTarget: { files } }) => {
  if (!files.length) return;
  const reader = new FileReader();
  reader.onload = ({ target: { result } }) => {
    productImage.src = result;
  };
  reader.readAsDataURL(files[0]);
  productImage.style.display = 'block';
};

const validateName = ({ currentTarget: { value } }) => {
  if (value.length >= 2) return;
  showMsg(nameError, '상품명은 2자 이상이어야 합니다.');
};

const validatePrice = ({ currentTarget: { value } }) => {
  if (value >= 0) return;
  showMsg(priceError, '유효하지 않은 가격입니다.');
};

const validateURL = ({ currentTarget: { value } }) => {
  if (isValidURL(value)) return;
  showMsg(urlError, '유효하지 않은 URL입니다.');
};

const getFileName = async () => {
  const formData = new FormData();
  if (fileInput.files.length) {
    formData.append('image', fileInput.files[0]);
    let res = await fetch(`${API}/image/uploadfile`, {
      method: 'POST',
      body: formData
    });
    let json = await res.json();
    const { filename } = json;
    return filename
  } else {
    return productImage.src.split('/').pop();
  }
};

const saveProduct = async () => {
  const filename = await getFileName();
  const { page, productId } = NAME_SPACE;
  if (page === 'addProduct') {
    fetch(`${API}/product`, reqData('POST', {
      product: {
        itemName: nameInput.value,
        price: +priceInput.value,
        link: urlInput.value,
        itemImage: `${API}/${filename}`
      }
    }))
      .then(() => {
        const accountname = localStorage.getItem('accountname');
        gotoPage('profile.html', { user: accountname }, [ 'user' ]);
      });
  } else if (page === 'modifyProduct') {
    fetch(`${API}/product/${productId}`, reqData('PUT', {
      product: {
        itemName: nameInput.value,
        price: +priceInput.value,
        link: urlInput.value,
        itemImage: `${API}/${filename}`
      }
    }))
      .then(() => {
        const accountname = localStorage.getItem('accountname');
        gotoPage('profile.html', { user: accountname }, [ 'user' ]);
      });
  }
};

const initValues = () => {
  const { page, productId } = NAME_SPACE;
  if (page !== 'modifyProduct') return;
  const accountname = localStorage.getItem('accountname');
  fetch(`${API}/product/${accountname}/?limit=100&skip=0`, reqData())
    .then(res => res.json())
    .then(({ product }) => {
      const { itemImage, itemName, price, link } = product.find(({ id }) => id === productId);
      productImage.style.display = 'block';
      productImage.src = itemImage;
      nameInput.value = itemName;
      priceInput.value = price;
      urlInput.value = link;
    });
};

// 헤더 버튼
backButton.addEventListener('click', goBack);
saveButton.addEventListener('click', saveProduct);

// 이미지 썸네일
fileInput.addEventListener('change', setThumbnail);

// 이름 유효성 검사
nameInput.addEventListener('blur', validateName);
nameInput.addEventListener('focus', () => hideMsg(nameError));

// 가격 유효성 검사
priceInput.addEventListener('blur', validatePrice);
priceInput.addEventListener('focus', () => hideMsg(priceError));

// URL 유효성 검사
urlInput.addEventListener('blur', validateURL);
urlInput.addEventListener('focus', () => hideMsg(urlError));

// 모든 input이 유효하면 시작 버튼 활성화
initActive(activateSave, [nameInput, priceInput, urlInput]);

const NAME_SPACE = getNameSpace();
initValues();