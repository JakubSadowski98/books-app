/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use-strict';
  /* *********************************************************************************************************************************************************************************************************************************************************************************** */
  const select = {
    templateOf: {
      bookList: '#template-book',
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
    const booksList = document.querySelector(select.containerOf.list); //referencja do elementu ".books-list"

    booksList.addEventListener('dblclick', function(event){ //nasłuchiowanie kontenera ".books-list", w którym znajdują się elementy ".book__image"
      event.preventDefault();
      // find clickedElement using properties target and offsetParent in event object
      const clickedElement = event.target.offsetParent //(!) referencja "event.target.offsetParent" wskazuje na element ".book__image", jednak w rzeczywistości klikniętym elementem jest "img", dlatego dodatkowa właściwość offsetParent wskazuje na rodzica "img", czyli ".book__image"
      // check if clickedElement contains proper class
      if(clickedElement.classList.contains('book__image')){
        // get value (id) from attribute data-id
        const bookId = clickedElement.getAttribute('data-id');
        // check if book is not added to favorites
        if(!favoriteBooks.includes(bookId)){
          // add class favorite to clickedElement; add bookId to favoriteBooks array
          clickedElement.classList.add(classNames.bookList.addToFavorite);
          favoriteBooks.push(bookId);
        } else {
          // remove class favorite from clickedElement; remove bookId from favoriteBooks array
          clickedElement.classList.remove(classNames.bookList.addToFavorite);
          favoriteBooks.splice(favoriteBooks.indexOf(bookId), 1); //(!)
        }
      }
    });
  }

  render();
  initActions();
}

//console.log(dataSource);