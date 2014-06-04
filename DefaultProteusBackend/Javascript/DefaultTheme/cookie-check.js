/**
 * Script to check for cookies.
 * @param {Window} w the window.
 * @param {HTMLDocument} d the document.
 */
(function(w, d){
  "use strict";
  function initCC(){
    if(!d.cookie){
      var col2 = d.getElementById("column2") || d.body;
      var mesg = "<div class=\"message important\">It appears you have cookies disabled. Some features of the site will not work."
        + " Please enable cookies in your browser.</div>",
          el = d.createElement("div");
      if(!col2)return;
      el.innerHTML = mesg;
      col2.insertBefore(el, col2.firstChild);
      el.className = "message-container";
    }
  }
  if(w.attachEvent) w.attachEvent('onload', initCC);
  else w.addEventListener('load', initCC, false);
})(window, document);
