// https://linku.la/jasima/data.json
// https://github.com/niftg/tokipona-pu-otmjson
const formEl = document.querySelector('form');

formEl.addEventListener('submit', (e) => {
  e.preventDefault();
  const textInput = formEl.querySelector('input');
  const selectInput = formEl.querySelector('select');
  const searchValue = textInput.value.toLowerCase();
  const selectValue = selectInput.value;

  fetch('dict.json')
    .then((res) => res.json())
    .then((data) => {
      const dict = data.words;
      const filtered = dict.filter((word) => {
        let wordMatch = false;
        let typeMatch = false;
        //no search value
        if (!searchValue) wordMatch = true;
        //search value matches title
        if (word.entry.form.includes(searchValue)) {
          wordMatch = true;
        }
        //search value matches alternative spelling
        if (word.variations[0]) {
          if (word.variations[0].form.includes(searchValue)) wordMatch = true;
        }
        //search value in english stranslation
        // word.translations.forEach((translation) => {
        //   if (translation.forms[0].includes(searchValue)) wordMatch = true;
        // });
        //no filter type
        if (!selectValue) typeMatch = true;
        //filter type value matches a translation type
        word.translations.forEach((translation) => {
          const wordType = translation.title.toLowerCase();
          if (wordType.includes(selectValue)) typeMatch = true;
        });

        //checks if a word should be included or not in search
        if (wordMatch && typeMatch) return true;
        return false;
      });
      createColumns(filtered);
      window.scrollTo({
        top: formEl.offsetTop - 32,
        left: 0,
      });
    });
});

function createColumns(dict) {
  const mobileCards = document.querySelector('.mobile-container');
  const desktopColumnCards = document.querySelectorAll(
    '.desktop-container .column'
  );
  const desktopColumn1 = desktopColumnCards[0];
  const desktopColumn2 = desktopColumnCards[1];
  desktopColumn1.innerHTML = '';
  desktopColumn2.innerHTML = '';
  let mobileString = '';
  let column1 = '';
  let column2 = '';
  dict.forEach((word) => {
    string = createCardString(word);
    mobileString += string;
    height1 = desktopColumn1.clientHeight;
    height2 = desktopColumn2.clientHeight;
    if (height1 <= height2) column1 += string;
    else column2 += string;
    desktopColumn1.innerHTML = column1;
    desktopColumn2.innerHTML = column2;
  });
  mobileCards.innerHTML = mobileString;
}

function createCardString(wordData) {
  //console.log(wordData);
  let string = `
    <div class="card" data-word="${wordData.entry.form}">
      <h3>${wordData.entry.form}
      ${
        wordData.variations[0]
          ? ` <span>or</span> ${wordData.variations[0].form}`
          : ''
      }
      </h3>
      ${wordData.translations
        .map((element) => {
          //console.log(element.title, element.forms[0]);
          let type = element.title;
          let translation = element.forms[0];
          return `<small>${type.toLowerCase()}</small><p>${translation}</p>`;
        })
        .join('')}
    </div>
  `;
  return string;
}

window.onload = () => {
  fetch('dict.json')
    .then((res) => res.json())
    .then((data) => {
      const dict = data.words;
      createColumns(dict);
    });
};
