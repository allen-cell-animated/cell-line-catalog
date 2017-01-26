if(Array.prototype.find === null){
  Array.prototype.find = function(callback, thisArg){
    for(var i = 0; i < this.length; i++){
      if(callback.call(thisArg || window, this[i], i, this))
        return this[i];
    }
    return undefined;
  };
}

$(function () {
  $('[data-toggle="tooltip"]').tooltip({
    placement: 'bottom',
    html: true
  })
})
