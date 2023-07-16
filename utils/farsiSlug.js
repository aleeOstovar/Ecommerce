module.exports = (name) => {
  const persianChars = {
    ا: 'ا',
    آ: 'آ',
    ب: 'ب',
    پ: 'پ',
    ت: 'ت',
    ث: 'ث',
    ج: 'ج',
    چ: 'چ',
    ح: 'ح',
    خ: 'خ',
    د: 'د',
    ذ: 'ذ',
    ر: 'ر',
    ز: 'ز',
    ژ: 'ژ',
    س: 'س',
    ش: 'ش',
    ص: 'ص',
    ض: 'ض',
    ط: 'ط',
    ظ: 'ظ',
    ع: 'ع',
    غ: 'غ',
    ف: 'ف',
    ق: 'ق',
    ک: 'ک',
    گ: 'گ',
    ل: 'ل',
    م: 'م',
    ن: 'ن',
    و: 'و',
    ه: 'ه',
    ی: 'ی',
    0: '۰',
    1: '۱',
    2: '۲',
    3: '۳',
    4: '۴',
    5: '۵',
    6: '۶',
    7: '۷',
    8: '۸',
    9: '۹',
  };

  const slug = [...name].map((char) => persianChars[char] || '-').join('');

  return slug;
};
