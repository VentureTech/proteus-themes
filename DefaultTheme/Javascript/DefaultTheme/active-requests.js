jQuery(document).ready(function ($) {
  "use strict";
  var updates = 0, to;

  function startWatch(event) {
    updates = 0;
    event.preventDefault();
    event.target.disabled = true;
    watch();
  }

  function stopWatch(event) {
    event.preventDefault();
    _stopWatch();
  }

  function _stopWatch() {
    $('.search_actions .watch').text('Watch').click(startWatch);
    clearTimeout(to);
    to = null;
  }

  function watch() {
    if (updates++ > 250) {
      _stopWatch();
      return;
    }
    $('.search_actions .watch').text('Loading...');
    var ds = new Date();
    var $requestStats = $('#request_stats');
    var form = $requestStats.find('form');
    var url = '/partial' + form.attr('action');
    to = 1;

    function updateUI(html) {
      $requestStats.replaceWith(html);
      $('#request_stats').find('.search_actions')
          .append('<button class="watch" title="Click to toggle">Watching...</button>');
      var de = new Date();
      if (to) {
        to = setTimeout(watch, Math.max(2500, (de - ds) * 4));
        $('.search_actions .watch').click(stopWatch);
      }
    }

    $.ajax({
      url: url,
      data: form.serialize(),
      success: updateUI
    });
  }

  var rs = $('#request_stats');
  if (!rs) return;
  $('.search_actions', rs).append('<button class="watch" title="Click to toggle">Watch</button>');
  $('.search_actions .watch', rs).click(startWatch);
});
