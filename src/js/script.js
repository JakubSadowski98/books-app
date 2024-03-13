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
      filters: '.filters',
    },
    imageCover: {
      image: '.book__image',
    },
  };

  const classNames = {
    bookList: {
      addToFavorite: 'favorite',
      hideBook: 'hidden',
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
  class BooksList {
    constructor() {
      const thisBooksList = this;

      thisBooksList.initData();
      thisBooksList.render();
      thisBooksList.getElements();
      thisBooksList.initActions();
    }

    initData() { //pobiera dane z obiektu "dataSource" w pliku data.js
      const thisBooksList = this;

      thisBooksList.data = dataSource.books;
    }

    render() { //przechodzi po wszyskich książkach w tablicy "dataSource.books" i renderuje dla nich reprezentacje HTML na liście ".book-list"
      const thisBooksList = this;

      for(let bookData of thisBooksList.data){
        // add properties with value to style ratings (background-color, width)
        bookData.ratingBgc = thisBooksList.determineRatingBgc(bookData.rating);
        bookData.ratingWidth = bookData.rating * 10;
        // generate HTML based on template
        const generatedHTML = templates.bookList(bookData);
        // create element using utils.createElementFromHTML
        const element = utils.createDOMFromHTML(generatedHTML);
        // find book list container
        const booksListContainer = document.querySelector(select.containerOf.list);
        // add element to book list
        booksListContainer.appendChild(element);
      }
    }

    getElements() {
      const thisBooksList = this;

      thisBooksList.dom = {};
      thisBooksList.dom.bookImage = document.querySelectorAll(select.imageCover.image);
    }

    initActions() { //dodaje nasłuchiwacze na elementy
      const thisBooksList = this;

      thisBooksList.favoriteBooks = [];
      thisBooksList.filters = [];

      const booksListContainer = document.querySelector(select.containerOf.list); //referencja do elementu ".books-list"

      booksListContainer.addEventListener('dblclick', function(event){ //nasłuchiowanie kontenera ".books-list", w którym znajdują się elementy ".book__image"; funkcja callback nadaje książkom klasę "favorite" i dodaje ich id do tablicy "favoriteBooks"
        event.preventDefault();
        // find clickedElement using properties target and offsetParent in event object
        const clickedElement = event.target.offsetParent; //(!) referencja "event.target.offsetParent" wskazuje na element ".book__image", jednak w rzeczywistości klikniętym elementem jest "img", dlatego dodatkowa właściwość offsetParent wskazuje na rodzica "img", czyli ".book__image"
        // check if clickedElement contains proper class
        if(clickedElement.classList.contains('book__image')){
          // get value (id) from attribute data-id
          const bookId = clickedElement.getAttribute('data-id');
          // check if book is not added to favorites
          if(!thisBooksList.favoriteBooks.includes(bookId)){
            // add class favorite to clickedElement; add bookId to favoriteBooks array
            clickedElement.classList.add(classNames.bookList.addToFavorite);
            thisBooksList.favoriteBooks.push(bookId);
          } else {
            // remove class favorite from clickedElement; remove bookId from favoriteBooks array
            clickedElement.classList.remove(classNames.bookList.addToFavorite);
            thisBooksList.favoriteBooks.splice(thisBooksList.favoriteBooks.indexOf(bookId), 1); //(!)
          }
        }
      });

      const filtersForm = document.querySelector(select.containerOf.filters);

      filtersForm.addEventListener('change', function(event){ // nasłuchiwanie kontenera ".filters"
        event.preventDefault();

        const clickedElement = event.target;
        // check if clickedElement is checkbox
        if(clickedElement.tagName == 'INPUT' && clickedElement.type == 'checkbox' && clickedElement.name == 'filter'){
          // check if checkbox is ticked
          if(clickedElement.checked == true){
            thisBooksList.filters.push(clickedElement.value);
          } else {
            thisBooksList.filters.splice(thisBooksList.filters.indexOf(clickedElement.value), 1);
          }
          thisBooksList.filterBooks();
        }
      });
    }

    filterBooks() {
      const thisBooksList = this;

      for(let bookData of thisBooksList.data){
        const bookDataId = bookData.id - 1; //(!)
        // check if thisBooksList.filters array contains any elements
        if(thisBooksList.filters.length > 0){
          for(let filter of thisBooksList.filters){
            // check if filter fits information about the book
            if(bookData.details[filter]){
              thisBooksList.dom.bookImage[bookDataId].classList.remove(classNames.bookList.hideBook);
              break;
            } else thisBooksList.dom.bookImage[bookDataId].classList.add(classNames.bookList.hideBook);
          }
        } else thisBooksList.dom.bookImage[bookDataId].classList.remove(classNames.bookList.hideBook);
      }
    }

    determineRatingBgc(rating) { //(!) stylowanie ocen pod książkami
      let background;

      if(rating < 6){background = 'linear-gradient(to bottom, #fefcea 0%, #f1da36 100%)';}
      if(rating > 6 && rating <= 8){background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';}
      if(rating > 8 && rating <= 9){background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';}
      if(rating > 9){background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';}

      return background;
    }
  }

  const app = new BooksList();
  console.log(app);
}

