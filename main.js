var $form = $('.box');

var isAdvancedUpload = function() {
  var div = document.createElement('div');
  return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
}();

if (isAdvancedUpload) {
  $form.addClass('has-advanced-upload');
}

// var rhinoStorage = localStorage.getItem("imageCache"),
//     rhino = document.getElementById("imageCache");
// if (rhinoStorage) {
//     // Reuse existing Data URL from localStorage
//     JSON.parse(rhinoStorage).forEach(url => {
//       var image = document.createElement('img');
//       image.src = url;
//       document.body.appendChild(image)
//     });
// } else {
//   localStorage.setItem("imageCache", JSON.stringify([]))
// }
function parseProgressLine(line) {
  var progress = {};

  // Remove all spaces after = and trim
  line  = line.replace(/=\s+/g, '=').trim();
  var progressParts = line.split(' ');
  
  // Split every progress part by "=" to get key and value
  for(var i = 0; i < progressParts.length; i++) {
    var progressSplit = progressParts[i].split('=', 2);
    var key = progressSplit[0];
    var value = progressSplit[1];

    // This is not a progress line
    if(typeof value === 'undefined')
      return null;

    progress[key] = value;
  }

  return progress;
}

let app = new Application($form, $('.worker-space'))