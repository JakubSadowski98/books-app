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
         // get value (id) from attribute data-id
         const bookId = bookImage.getAttribute('data-id');
        // check if book is not added to favorites
        if(!favoriteBooks.includes(bookId)){
          // add class favorite to bookImage; add bookId to favoriteBooks array
          bookImage.classList.add(classNames.bookList.addToFavorite);
          favoriteBooks.push(bookId);
          console.log(favoriteBooks);
        } else {
          // remove class favorite from bookImage; remove bookId from favoriteBooks array
          bookImage.classList.remove(classNames.bookList.addToFavorite);
          favoriteBooks.splice(favoriteBooks.indexOf('bookId'), 1);
          console.log(favoriteBooks);
        }
      });
    }
  }

  render();
  initActions();
}

//console.log(dataSource);