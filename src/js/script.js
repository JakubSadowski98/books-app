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
  function render(){ //przechodzi po wszyskich książkach w tablicy "dataSource.books" i renderuje dla nich reprezentacje HTML na liście ".book-list"
    for(let bookData of dataSource.books){
      // create constants to style ratings (background-color, width)
      const ratingBgc = determineRatingBgc(bookData.rating);
      const ratingWidth = bookData.rating * 10;
      // add properties with constans value to object
      bookData.ratingWidth = ratingWidth;
      bookData.ratingBgc = ratingBgc;
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
  const filters = []; //przechowuje aktualne filtry wybrane w aplikacji

  function initActions(){ //dodaje nasłuchiwacze na elementy
    const booksList = document.querySelector(select.containerOf.list); //referencja do elementu ".books-list"

    booksList.addEventListener('dblclick', function(event){ //nasłuchiowanie kontenera ".books-list", w którym znajdują się elementy ".book__image"; funkcja callback nadaje książkom klasę "favorite" i dodaje ich id do tablicy "favoriteBooks"
      event.preventDefault();
      // find clickedElement using properties target and offsetParent in event object
      const clickedElement = event.target.offsetParent; //(!) referencja "event.target.offsetParent" wskazuje na element ".book__image", jednak w rzeczywistości klikniętym elementem jest "img", dlatego dodatkowa właściwość offsetParent wskazuje na rodzica "img", czyli ".book__image"
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

    const filtersForm = document.querySelector(select.containerOf.filters);

    filtersForm.addEventListener('change', function(event){ // nasłuchiwanie kontenera ".filters"
      event.preventDefault();

      const clickedElement = event.target;
      // check if clickedElement is checkbox
      if(clickedElement.tagName == 'INPUT' && clickedElement.type == 'checkbox' && clickedElement.name == 'filter'){
        // check if checkbox is ticked
        if(clickedElement.checked == true){
          filters.push(clickedElement.value);
        } else {
          filters.splice(filters.indexOf(clickedElement.value), 1);
        }
        filterBooks();
      }
    });
  }

  function filterBooks(){
    const bookImage = document.querySelectorAll(select.imageCover.image);

    for(let bookData of dataSource.books){
      const bookDataId = bookData.id - 1;
      // check if filters array contains any elements
      if(filters.length > 0){
        for(let filter of filters){
          // check if filter fits information about the book
          if(bookData.details[filter]){
            bookImage[dataset=bookDataId].classList.remove(classNames.bookList.hideBook);
            break;
          } else bookImage[dataset=bookDataId].classList.add(classNames.bookList.hideBook);
        }
      } else bookImage[dataset=bookDataId].classList.remove(classNames.bookList.hideBook);
    }
  }

  function determineRatingBgc(rating){ //(!) stylowanie ocen pod książkami
    let background;

    if(rating < 6){background = 'linear-gradient(to bottom, #fefcea 0%, #f1da36 100%)';}
    if(rating > 6 && rating <= 8){background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';}
    if(rating > 8 && rating <= 9){background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';}
    if(rating > 9){background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';}

    return background;
  }
  /* *********************************************************************************************************************************************************************************************************************************************************************************** */
  render();
  initActions();
}

//console.log(dataSource);