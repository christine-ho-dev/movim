/**
 * Movim Javascript Template functions

 * Look at the comments for help.
 */

var MovimTpl = {
    dragged : false,
    moving : false,
    percent : false,
    append : function(selector, html) {
        target = document.querySelector(selector);
        if (target) {
            target.insertAdjacentHTML('beforeend', html);
        }
    },
    back : function() {
        // If the context menu is shown
        var cm = document.querySelector('ul.context_menu');
        if (cm != null && cm.className.includes('shown')) {
            MovimTpl.toggleContextMenu(document);
            // If a drawer is shown
        } else if (typeof Snap == 'object' && Snap.snap != undefined && Snap.snap.className !== '') {
            if (Snap.snap.classList.contains('upload')) {
                Snap.snap.className = 'shoot';
                Snap.video.play();
            } else {
                Snap.end();
            }
        } else if (document.querySelector('#preview')
         && document.querySelector('#preview').innerHTML != '') {
            Preview_ajaxHide();
        } else if (Drawer.filled()) {
            Drawer.clear();
            // If a dialog box is shown
        } else if (Dialog.filled()) {
            Dialog.clear();
            // If the menu is shown
        } else if (document.querySelector('body > nav').classList.contains('active')) {
            document.querySelector('body > nav').classList.remove('active');
            // If the panel is shown
        } else if (document.querySelector('main').classList.contains('enabled')) {
            if (MovimUtils.urlParts().page == 'chat') {
                Chat_ajaxGet();
            } else {
                MovimTpl.hidePanel();
                window.history.back();
            }
        } else {
            history.back();
        }
    },
    fill : function(selector, html) {
        target = document.querySelector(selector);
        if (target) {
            target.innerHTML = html;
        }
    },
    hideMenu: function() {
        MovimUtils.removeClass('body > nav', 'active');
    },
    showPanel: function() {
        MovimUtils.addClass('main', 'enabled');
        MovimUtils.addClass('ul#bottomnavigation', 'hidden');
        MovimTpl.scrollPanelTop();
    },
    hidePanel: function() {
        MovimUtils.removeClass('main', 'enabled');
        MovimUtils.removeClass('ul#bottomnavigation', 'hidden');
    },
    isPanelScrolled: function() {
        var selector = document.querySelector('main > div:first-child:nth-last-child(2) > div');

        if (selector != null) {
            return (selector.scrollHeight - Math.floor(selector.scrollTop) <= selector.clientHeight + 3);
        }
    },
    scrollPanel : function() {
        var selector = document.querySelector('main > div:first-child:nth-last-child(2) > div');

        if (selector != null) {
            selector.scrollTop = selector.scrollHeight;
        }
    },
    scrollPanelTop : function() {
        var selector = document.querySelector('main > div:first-child:nth-last-child(2) > div');

        if (selector != null) {
            selector.scrollTop = 0;
        }
    },
    prepend: function(selector, html) {
        target = document.querySelector(selector);
        if (target) {
            target.insertAdjacentHTML('afterbegin', html);
        }
    },
    remove: function(selector) {
        target = document.querySelector(selector);
        if (target)
            target.parentNode.removeChild(target);
    },
    replace: function (selector, html) {
        target = document.querySelector(selector);
        if (target) {
            var div = document.createElement('div');
            div.innerHTML = html;
            var element = div.firstChild;
            replacedNode = target.parentNode.replaceChild(element, target);
        }
    },
    toggleContextMenu : function(e) {
        var contextMenu = document.querySelector('ul.context_menu');
        if (contextMenu == null) return;

        if (document.querySelector('.show_context_menu').contains(e.target)) {
            contextMenu.classList.add('shown');
        } else {
            contextMenu.classList.remove('shown');
        }
    },
    toggleMenu : function() {
        document.querySelector('body > nav').classList.toggle('active');
    },
    touchEvents: function() {
        nav = document.querySelector('body > nav');

        if (nav == null) return;

        document.body.addEventListener('touchstart', function(event) {
            startX = event.targetTouches[0].pageX;
            startY = event.targetTouches[0].pageY;

            if (
            (
                (startX < document.body.clientWidth/35 && startY > 56)
                ||
                (nav.classList.contains('active') && startX > document.body.clientWidth - 50)
            )
            && MovimTpl.dragged == false) {
                nav.classList.add('moving');
                MovimTpl.dragged = true;
            }
        }, true);

        document.body.addEventListener('touchmove', function(event) {
            moveX = event.targetTouches[0].pageX;

            if (MovimTpl.dragged) {
                event.preventDefault();
                event.stopPropagation();

                position = moveX - document.body.clientWidth;

                MovimTpl.percent = 1 - Math.abs(moveX) / Math.abs(document.body.clientWidth);
                nav.style.transform = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, '+position+', 0, 0, 1)';
            }
        }, true);

        document.body.addEventListener('touchend', function(event) {
            nav.style.transform = '';

            if (MovimTpl.dragged) {
                nav.classList.remove('moving');

                if (!nav.classList.contains('active')
                && MovimTpl.percent < 0.80) {
                    nav.classList.add('active');
                } else if (MovimTpl.percent > 0.20) {
                    nav.classList.remove('active');
                }
            }

            MovimTpl.dragged = false;
        }, true);
    }
};

movim_add_onload(function() {
    MovimTpl.touchEvents();
    document.body.addEventListener('click', MovimTpl.toggleContextMenu, false);
});
