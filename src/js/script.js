/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use-strict';
  /* *********************************************************************************************************************************************************************************************************************************************************************************** */
  const select = {
    templateOf: {
      bookList: "#template-book",
    },
    containerOf: {
      list: '.books-list',
    },
    imageCover: {
      image: '.book__image',
    },
  };

  const classNames = {
    bookList: {
      addToFavorite: 'favorite',
    },
  };
/*
  const settings = {

  };
*/
  const templates = {
    bookList: Handlebars.compile(document.querySelector(select.templateOf.bookList).innerHTML),
  };
  /* *********************************************************************************************************************************************************************************************************************************************************************************** */
  function render(){ //przechodzi po wszyskich książkach w "dataSource.books" i renderuje dla nich reprezentacje HTML na liście ".book-list"
    for(let bookData of dataSource.books){
      // create dom object storing references to DOM elements
      const dom = {};
      // generate HTML based on template
      const generatedHTML = templates.bookList(bookData);
      // create element using utils.createElementFromHTML
      dom.element = utils.createDOMFromHTML(generatedHTML);
      // find list container
      const listContainer = document.querySelector(select.containerOf.list);
      // add element to list
      listContainer.appendChild(dom.element);
    }
  }

  const favoriteBooks = []; //tablica z identyfikatorami książek, które dodano do ulubionych

  function initActions(){ //nadaje książkom klasę "favorite" i dodaje ich id do tablicy "favoriteBooks"
    const bookImageList = document.querySelectorAll(select.imageCover.image); //referencja do listy wszystkich elementów ".book__image"

    for(let bookImage of bookImageList){
      bookImage.addEventListener('dblclick', function(event){
        event.preventDefault();
        // add clas="favorite" to bookImage
        bookImage.classList.add(classNames.bookList.addToFavorite);
        // get string value from attribute data-id
        const bookId = bookImage.getAttribute('data-id');
        // add bookId to favoriteBooks array
        favoriteBooks.push(bookId);
      });
    }
  }

  render();
  initActions();
}

//console.log(dataSource);