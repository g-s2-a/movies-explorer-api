// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'https://domainname0.nomoredomains.rocks',
  'https://domainname1.nomoredomains.rocks',
  'http://domainname0.nomoredomains.rocks',
  'http://domainname1.nomoredomains.rocks',
  'http://localhost:3000',
  'http://localhost:4000',
];

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
  // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
    res.header('Access-Control-Allow-Origin', origin);

    const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную

    // Значение для заголовка Access-Control-Allow-Methods по умолчанию
    // (разрешены все типы запросов)
    const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
    // сохраняем список заголовков исходного запроса
    const requestHeaders = req.headers['access-control-request-headers'];
    if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
      res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
      // разрешаем кросс-доменные запросы с этими заголовками
      res.header('Access-Control-Allow-Headers', requestHeaders);
      return res.end();
    }
  }

  next();
};
