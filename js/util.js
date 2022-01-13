const goBack = () => {
  const prev = JSON.parse(localStorage.getItem('prev'));
  Object
    .entries(prev.pop())
    .forEach(([ key, value ]) => localStorage.setItem(key, value));
  localStorage.setItem('prev', JSON.stringify(prev));
  window.history.back();
};

const gotoPage = (url, items) => {
  const prevStorage = {};
  ['page', 'selectedUser', 'productId', 'postId']
    .forEach(key => prevStorage[key] = localStorage.getItem(key));
  const prev = JSON.parse(localStorage.getItem('prev'));
  prev.push(prevStorage);
  localStorage.setItem('prev', JSON.stringify(prev));
  Object
    .entries(items)
    .forEach(([ key, value ]) => localStorage.setItem(key, value));
  location.href = url;
};

const getFormattedPrice = (price) => {
  const strPrice = '' + price;
  if (strPrice.length <= 3) return strPrice;
  return [...strPrice]
    .map((v, i) => {
      if ((strPrice.length - i) % 3 === 0 && i !== 0) return ',' + v;
      return v;
    })
    .join('');
};