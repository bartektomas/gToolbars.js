var gToolbarsActivateHandlerList = {};
var gToolbarsDeactivateHandlerList = {};

function registerButton(button, handler) {
  var btn = $(button);
  gToolbarsActivateHandlerList[btn.attr("id")] = handler;
  btn.click(handler);
}

function registerToggleButton(button, onHandler, offHandler) {
  var btn = $(button);
  gToolbarsActivateHandlerList[btn.attr("id")] = onHandler;
  gToolbarsDeactivateHandlerList[btn.attr("id")] = offHandler;

  btn.click(function() {
    if (btn.hasClass("gt-button-active")) {
      btn.removeClass("gt-button-active");
      offHandler();
    } else {
      btn.addClass("gt-button-active");
      onHandler();
    }
  });
}

// Programmatically press buttons

function toggle(button, callHandler) {
  var btn = $(button);
  if (btn.hasClass("gt-dropdown")) {
    handleDropdownClick(btn, null);
    return;
  }

  if (btn.hasClass("gt-button-active")) {
    btn.removeClass("gt-button-active");
    if (callHandler === true && gToolbarsDeactivateHandlerList[btn.attr("id")]) {
      gToolbarsDeactivateHandlerList[btn.attr("id")]();
    }
  } else {
    btn.addClass("gt-button-active");
    if (callHandler === true && gToolbarsActivateHandlerList[btn.attr("id")]) {
      gToolbarsActivateHandlerList[btn.attr("id")]();
    }
  }
}

function triggerActivate(button, callHandler) {
  var btn = $(button);
  if (btn.hasClass("gt-dropdown") && !btn.hasClass("gt-button-active")) {
    handleDropdownClick(btn, null);
    return;
  }

  if (!btn.hasClass("gt-button-active")) {
    btn.addClass("gt-button-active");
    if (callHandler === true && gToolbarsActivateHandlerList[btn.attr("id")]) {
      gToolbarsActivateHandlerList[btn.attr("id")]();
    }
  }
}

function triggerDeactivate(button, callHandler) {
  var btn = $(button);
  if (btn.hasClass("gt-dropdown") && btn.hasClass("gt-button-active")) {
    handleDropdownClick(btn, null);
    return;
  }

  if (btn.hasClass("gt-button-active")) {
    btn.removeClass("gt-button-active");
    if (callHandler === true && gToolbarsDeactivateHandlerList[btn.attr("id")]) {
      gToolbarsDeactivateHandlerList[btn.attr("id")]();
    }
  }
}

// Handle all submenus

$('.gt-dropdown').each(function(i, obj) {
  $(obj).click(function(event) {
    var button = $(event.target).closest(".gt-dropdown");
    handleDropdownClick(button, $(event.target));
  });
});

function handleDropdownClick(button, target) {
  var popup = $(".gt-submenu", button);
  var visible = popup.is(":visible");

  if (visible) {
    // We're closing the submenu
    var clickedButton = target === null || target.attr('id') === button.attr('id');
    var noAutoClose = $(".gt-submenu", button).hasClass("gt-no-auto-close");
    if (!clickedButton && noAutoClose) {
      return;
    }

    closeSubmenu(button);
    $(document).unbind("click.gt-submenu");
  } else {
    // We're opening the submenu

    // close other submenus
    $(".gt-submenu").addClass("gt-noshow");
    $(".gt-button.gt-dropdown").removeClass("gt-button-active");

    button.addClass("gt-button-active");
    $(".mdl-tooltip").addClass("gt-noshow");

    var x = button.offset().top + 27;
    var y = button.offset().left;
    popup.css({top: x, left: y});
    popup.removeClass("gt-noshow");

    setTimeout(function(){
      $(document).bind("click.gt-submenu", function(event, noTooltips) {
        var target = $(event.target);
        if (target.hasClass("gt-dropdown") || target.closest('.gt-submenu').length > 0) {
          // Don't do anything if the other handler will be called
          return;
        }

        closeSubmenu(button, noTooltips);
        $(document).unbind("click.gt-submenu");
      });
    }, 10); // wait to set click handler so it's not called instantly by this click

  }
}

function closeSubmenu(menu, noTooltips) {
  menu.removeClass("gt-button-active");
  menu.children(".gt-submenu").addClass("gt-noshow");

  if (noTooltips !== true) {
    // Delay showing of tooltips to prevent flashing behavior
    setTimeout(function(){ $(".mdl-tooltip").removeClass("gt-noshow"); }, 250);
  }
}
