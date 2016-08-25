(function(module) {
// DONE: Wrap the entire contents of this file in an IIFE.
// Pass in to the IIFE a module, upon which objects can be attached for later access.
function Article (opts) {
  for (key in opts) {
    this[key] = opts[key];
  }
}

Article.allArticles = [];

Article.prototype.toHtml = function(scriptTemplateId) {
  var template = Handlebars.compile($(scriptTemplateId).text());
  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
  this.publishStatus = this.publishedOn ? 'published ' + this.daysAgo + ' days ago' : '(draft)';
  this.body = marked(this.body);
  return template(this);
};

Article.loadAll = function(inputData) {
  /* DONE: the original forEach code should be refactored
     using `.map()` -  since what we are trying to accomplish is the
     transformation of one collection into another. */
  Article.allArticles = inputData.sort(function(a,b) {
    return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
  }).map(function(ele) {
    return new Article(ele);
  });
};

/* DONE: Refactoring the Article.fetchAll method, it now accepts a parameter
    that will execute once the loading of articles is done. We do this because
    we might want to call other view functions, and not just renderIndexPage();
    Now instead of calling articleView.renderIndexPage(), we can call
    whatever we pass in! */
Article.fetchAll = function(nextFunction) {
  
  if (localStorage.hackerIpsum) {
    $.ajax({
      type: 'HEAD',
      url: '/data/hackerIpsum.json',
      success: function(data, message, xhr) {
        var eTag = xhr.getResponseHeader('eTag');
        if (!localStorage.eTag || eTag !== localStorage.eTag) {
          Article.getAll(nextFunction); // DONE: pass 'nextFunction' into Article.getAll();
        } else {
          Article.loadAll(JSON.parse(localStorage.hackerIpsum));
          // DONE: Replace the following line with 'nextFunction' and invoke it!
          nextFunction();
        }
      }
    });
  } else {
    Article.getAll(nextFunction); // DONE: pass 'nextFunction' into getAll();
  }
};

Article.getAll = function(nextFunction) {
  $.getJSON('/data/hackerIpsum.json', function(responseData, message, xhr) {
    localStorage.eTag = xhr.getResponseHeader('eTag');
    Article.loadAll(responseData);
    localStorage.hackerIpsum = JSON.stringify(responseData);
    // DONE invoke our parameter.
    nextFunction();
  });
};

Article.numWordsAll = function() {
  return Article.allArticles.map(function(currentArticle) {
    return currentArticle.body.match(/\w+/g).length;
  }).reduce(function(acc, cur){
    return acc+cur;
    // TODO:DONE complete this function to sum up all of the words.
  })
};

  Article.allAuthors = function() {
    return Article.allArticles.map(function(currentArticle){
      return currentArticle.author;
    }).reduce(function(acc, cur, index, array){
      if(acc.indexOf(cur)===-1)
        {
        console.log('not in array, pushing new value', cur);
        acc.push(cur);
      }
      return acc;
    }, []);
  }



      //then chain reduce, and set the accumulator to an array
      // to build a unique list of author names.



  // TODO: return a mapped collection
      // with just the author names

      //then chain reduce, and set the accumulator to an array
      // to build a unique list of author names.


Article.numWordsByAuthor = function() {
  // TODO: transform each author element into an object with 2 properties:
    // one for the author's name, and one for the total number of words
    // written by the specified author.
    return Article.allAuthors().map(function(currentAuthor) {
      return {
        name: currentAuthor,
        numWords: ''// someCollection.filter(function(curArticle) {
          // what do we return here to check for matching authors?}
        // .map() to return the author's word count for each article body (you may split or regexp)
        // .reduce() to squash this array into one big number, per author.
      }
    });
}

module.Article = Article;
})(window);
