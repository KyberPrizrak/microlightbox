/**
 * microlightbox.js
 *
 * Copyright (C) 2018 Konstantin A Chugunnyj (KyberPrizrak)
 *
 * LICENSE:
 *
 * This file is part of microlightbox.
 *
 * microlightbox is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * microlightbox is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with microlightbox. If not, see <http://www.gnu.org/licenses/>.
 *
 * @author KyberPrizrak (www.kyberprizrak.ru)
 * @version 1.0.0 - 2018.06.16 19:49:00 GMT+3
 */
(function() {

/**
 * Текущие настройки активного popup
 * @struct
 * @type {!Object}
 **/
 var options = {};

/**
 * Старая ширина popup
 * @type {number}
 **/
 var old_width = 0;

/**
 * Старая высота popup
 * @type {number}
 **/
 var old_height = 0;

/**
 * Старое значение document.body.style.overflow
 * @type {string}
 **/
 var old_body_style_overflow = '';

/**
 * Старое значение style.display DOM-элемента
 * Используется только для type=='inline'
 * @type {*}
 **/
 var old_target_style_display = 'none';

/**
 * DOM-элемент c id=microlightbox_spoof
 * Используется только для type=='inline'
 * @type {?Node}
 **/
 var obj_spoof = null;

/**
 * DOM-элемент, который нужно показать внутри popup
 * Используется только для type=='inline'
 * @type {?Node}
 **/
 var obj_target = null;

/**
 * DOM-элемент c id=microlightbox_image
 * Используется только для type=='image'
 * @type {?Node}
 **/
 var obj_image = null;

/**
 * DOM-элемент c id=microlightbox_overlay
 * @type {?Node}
 **/
 var obj_overlay = null;

/**
 * DOM-элемент c id=microlightbox_window
 * @type {?Node}
 **/
 var obj_window = null;

/**
 * DOM-элемент c id=microlightbox_body
 * @type {?Node}
 **/
 var obj_body = null;

/**
 * DOM-элемент c id=microlightbox_content
 * @type {?Node}
 **/
 var obj_content = null;

/**
 * DOM-элемент c id=microlightbox_titlebar
 * @type {?Node}
 **/
 var obj_titlebar = null;

/**
 * DOM-элемент c id=microlightbox_title
 * @type {?Node}
 **/
 var obj_title = null;

/**
 * DOM-элемент c id=microlightbox_close
 * @type {?Node}
 **/
 var obj_close = null;

/**
 * Инициализирует microlightbox для элемента
 * elm может принимать следующие значения:
 * 1) DOM-елемент:
 *  a) <a href="image.jpg"> - при клике по ссылке будет открываться во вспылывающем окне ресайзеная картинка image.jpg
 *  b) <a href="#html_id"> - при клике по ссылке будет открываться всплывашка с HTML-кодом блока <div id="html_id">
 *  c) <img src="image.jpg"> - будет открыта всплывашка с ресайзеной картинкой, взятой из src.
 *  d) любой другой тег - будет открыт во всплывашке.
 * 2) строка:
 *  a) начинающаяся с символа "#" - id DOM-елемента. Поведение функции аналогично передаче DOM-елемента с указанным ID.
 *  b) в других случаях - воспринимается как HTML-код, который должен быть отображен во всплывашке.
 * opt - объект, который может содержать следующие свойства:
 * type (string, 'auto') - Декларирует тип содержимого. Может принмать значения: 'auto', 'image', 'html' или 'inline'. Если 'auto' - определить автоматически.
 * title (string, '') - Строка, содержащая заловок всплывающиего окна;
 * titlePosition (string, 'auto') - позиция отображения title: 'titlebar', 'inside' или 'auto' (для image - используется inside, во всех остальных случаях - titlebar)
 * padding (integer, 10) - Пространство между контейнером microlightbox и контентом.
 * margin (integer, 20) - Пространство между областью просмотра и контейнером microlightbox.
 * minWidth (integer, 100) - Минимальная ширина контейнера microlightbox.
 * minHeight (integer, 100) - Минимальная высота контейнера microlightbox.
 * maxWidth (integer, 0) - Максимальная ширина контейнера microlightbox. Если 0 - игнорировать.
 * maxHeight (integer, 0) - Максимальная высота контейнера microlightbox. Если 0 - игнорировать.
 * overlayColor (string, 'rgba(0,0,0,0.7)') - Цвет фонового затемнения (значение для obj_overlay.style.backgroundColor).
 * @param {Node|string} elm Элемент, для которого инициализируем microlightbox
 * @param {Object|undefined} opt Параметры microlightbox
 * @return {undefined}
 **/
 function microlightbox(elm, opt)
 {
   if((typeof(elm) === 'string') && (elm.substr(0, 1) == '#'))
   {
     elm = document.getElementById(elm.substr(1));
   }

   if((typeof(elm) === 'object') && (elm.tagName == 'A'))
   {
     elm.onclick = function(){microlightbox_open(elm.getAttribute('href'), opt, true);return false;}
   }
   else
   {
     microlightbox_open(elm, opt, false);
   }
 }

/**
 * Открытие popup
 * @param {Node|string} elm Элемент, для которого открывается popup
 * @param {Object|undefined} opt Параметры microlightbox
 * @param {boolean} is_click Открытие происходит по клику (в elm содержится атрибут href)
 * @return {undefined}
 **/
 function microlightbox_open(elm, opt, is_click)
 {
   try{
     options.type = 'auto';
     options.title = '';
     options.titlePosition = 'auto';
     options.padding = 10;
     options.margin = 20;
     options.minWidth = 100;
     options.minHeight = 100;
     options.maxWidth = 0;
     options.maxHeight = 0;
     options.overlayColor = 'rgba(0,0,0,0.7)';
     options.imgWidth = 0;//only for type=='image'
     options.imgHeight = 0;//only for type=='image'

     if(typeof(opt) === 'object')
     {
       if(opt['type']) {options.type = opt['type'];}
       if(opt['title']) {options.title = opt['title'];}
       if(opt['titlePosition']) {options.titlePosition = opt['titlePosition'];}
       if(opt['padding']>=0) {options.padding = opt['padding'];}
       if(opt['margin']>=0) {options.margin = opt['margin'];}
       if(opt['minWidth']>=0) {options.minWidth = opt['minWidth'];}
       if(opt['minHeight']>=0) {options.minHeight = opt['minHeight'];}
       if(opt['maxWidth']>=0) {options.maxWidth = opt['maxWidth'];}
       if(opt['maxHeight']>=0) {options.maxHeight = opt['maxHeight'];}
       if(typeof(opt['overlayColor']) === 'string') {options.overlayColor = opt['overlayColor'];}
     }
    
     microlightbox_overlay_show();

     if((typeof(elm) === 'string') && (elm.substr(0, 1) == '#'))
     {
       elm = document.getElementById(elm.substr(1));
       if(!elm) {return;}
     }

     if(options.type == 'auto')
     {
       if(typeof(elm) === 'object')
       {
         options.type = (elm.tagName == 'IMG') ? 'image' : 'inline';
       }
       else if(typeof(elm) === 'string')
       {
         options.type = is_click ? 'image' : 'html';
       }
     }

     if(options.titlePosition == 'auto')
     {
       options.titlePosition = (options.type == 'image') ? 'inside' : 'titlebar';
     }

     if(options.type == 'inline')
     {
       if(typeof(elm) === 'object')
       {
         obj_target = elm;
         obj_spoof = document.createElement('div');
         obj_spoof.id = 'microlightbox_spoof';
         obj_spoof.style.display = 'none';
         obj_target.parentNode.insertBefore(obj_spoof, obj_target);
         microlightbox_window_show(elm);
       }
       else
       {
         options.type = 'html';//if user run: microlightbox('html', {type:'inline'})
       }
     }

     if(options.type == 'html')
     {
       microlightbox_window_show(elm);
     }

     if(options.type == 'image')
     {
       obj_image = new Image();
       obj_image.onload = function(){
         options.imgWidth = obj_image.width;
         options.imgHeight = obj_image.height;
         obj_image.id = 'microlightbox_image';
         microlightbox_window_show(obj_image);
       }
       obj_image.src = (typeof(elm) === 'object') ? elm.getAttribute('src') : elm;
     }
   }
   catch(e)
   {
     alert('microlightbox error #2');
   }
 }

/**
 * Открыть overlay (экран ожидания открытия popup)
 * @return {undefined}
 **/
 function microlightbox_overlay_show()
 {
   microlightbox_close();
   old_body_style_overflow = document.body.style.overflow;//save old value

   obj_overlay = document.createElement('div');
   obj_overlay.id = 'microlightbox_overlay';
   obj_overlay.onclick = microlightbox_overlay_onclick;
   try{
     obj_overlay.style.backgroundColor = options.overlayColor;
   }catch(e){}
   document.body.style.overflow = 'hidden';
   document.body.appendChild(obj_overlay);
   obj_overlay.style.display = 'block';
 }

/**
 * Открыть popup
 * @param {Node|string} value Элемент, который показывается в popup
 * @return {undefined}
 **/
 function microlightbox_window_show(value)
 {
   obj_content = document.createElement('div');
   obj_content.id = 'microlightbox_content';
   obj_content.style.padding = options.padding + 'px';
   if(typeof(value) === 'object')
   {
     obj_content.appendChild(value);
     old_target_style_display = value.style.display;
     value.style.display = '';
   }
   else
   {
     obj_content.innerHTML = value;
   }

   obj_body = document.createElement('div');
   obj_body.id = 'microlightbox_body';
   obj_body.appendChild(obj_content);
   if(options.type=='image')
   {
     obj_body.style.overflow = 'hidden';
   }

   obj_window = document.createElement('div');
   obj_window.id = 'microlightbox_window';

   obj_close = document.createElement('div');
   obj_close.id = 'microlightbox_close';
   obj_close.innerHTML = '&times;';
   obj_close.onclick = microlightbox_close;

   if(options.title)
   {
     obj_title = document.createElement('div');
     obj_title.id = 'microlightbox_title';
     obj_title.innerHTML = options.title;
     if(options.titlePosition == 'titlebar')
     {
       obj_titlebar = document.createElement('div');
       obj_titlebar.id = 'microlightbox_titlebar';
       obj_titlebar.appendChild(obj_close);
       obj_titlebar.appendChild(obj_title);
       obj_window.appendChild(obj_titlebar);
     }
     else
     {
       obj_title.style.marginBottom = options.padding + 'px';
       obj_body.appendChild(obj_title);
       obj_overlay.appendChild(obj_close);
     }
   }
   else
   {
     obj_overlay.appendChild(obj_close);
   }

   obj_window.appendChild(obj_body);
   obj_overlay.appendChild(obj_window);
   obj_overlay.style.backgroundImage = 'none';

   microlightbox_recalc();
 }

/**
 * Пересчитать размеры popup
 * @return {undefined}
 **/
 function microlightbox_recalc()
 {
   try{
     if(obj_window)
     {
       var titlebar_height = obj_titlebar ? obj_titlebar.offsetHeight : 0;
       var titlefooter_height = (old_width > 0) && obj_title && !obj_titlebar ? obj_title.offsetHeight + options.padding : 0;

       var overlay_width = document.documentElement.clientWidth;
       var overlay_height = document.documentElement.clientHeight;
       var window_borders_width = obj_window.offsetWidth - obj_window.clientWidth;
       var window_borders_height = obj_window.offsetHeight - obj_window.clientHeight;

       var window_min_width = options.minWidth;
       var window_min_height = options.minHeight;
       var window_max_width = Math.max(window_min_width, (options.maxWidth > 0) ? options.maxWidth : (overlay_width - (options.margin * 2)));
       var window_max_height = Math.max(window_min_height, (options.maxHeight > 0) ? options.maxHeight : (overlay_height - (options.margin * 2)));

       var content_min_width = Math.max(1, (window_min_width - window_borders_width) /*- (options.padding * 2)*/);
       var content_min_height = Math.max(1, (window_min_height - window_borders_height) /*- (options.padding * 2)*/ - titlebar_height - titlefooter_height);
       var content_max_width = Math.max(content_min_width, (window_max_width - window_borders_width)/* - (options.padding * 2)*/);
       var content_max_height = Math.max(content_min_height, (window_max_height - window_borders_height) /*- (options.padding * 2)*/ - titlebar_height - titlefooter_height);

       var content_width = window_min_width;
       var content_height = window_min_height;

       if(options.type == 'image')
       {
         var image_max_width = content_max_width - (options.padding * 2);
         var image_max_height = content_max_height - (options.padding * 2);
         var image_width = 0;
         var image_height = 0;

         if((options.imgWidth > image_max_width) || (options.imgHeight > image_max_height))//need resize
         {
           if((image_max_width / options.imgWidth) > (image_max_height / options.imgHeight))
           {
             image_height = image_max_height;
             image_width = Math.ceil(options.imgWidth * (image_max_height / options.imgHeight));
           }
           else
           {
             image_width = image_max_width;
             image_height = Math.ceil(options.imgHeight * (image_max_width / options.imgWidth));
           }
         }
         else
         {
           image_width = options.imgWidth;
           image_height = options.imgHeight;
         }
         obj_image.width = image_width;
         obj_image.height = image_height;
         content_width = image_width + (options.padding * 2);
         content_height = image_height + (options.padding * 2);
       }
       else
       {
         var content_real_width = obj_content.scrollWidth /*- (options.margin * 2)*/;
         var content_real_height = obj_content.scrollHeight /*- (options.margin * 2)*/;
         var content_scroll_width = obj_body.offsetWidth - obj_body.clientWidth;
         var content_scroll_height = obj_body.offsetHeight - obj_body.clientHeight;

         content_width = Math.max(content_min_width, content_real_width);
         content_height = Math.max(content_min_height, content_real_height);
         if(old_width == 0)//calc height only after set width
         {
           window_max_height = Math.max(100, window_min_height);
         }
         else
         {
           if(content_width > content_max_width) {content_height+=content_scroll_height;}
           if(content_height > content_max_height) {content_width+=content_scroll_width;}
         }
       }

       var window_width_tmp = content_width + window_borders_width /*+ (options.padding * 2)*/;
       var window_height_tmp = content_height + window_borders_height /*+ (options.padding * 2)*/ + titlebar_height + titlefooter_height;

       var window_width = Math.max(window_min_width, Math.min(window_max_width, window_width_tmp));
       var window_height = Math.max(window_min_height, Math.min(window_max_height, window_height_tmp));
       var window_left = Math.round((overlay_width / 2) - (window_width / 2));
       var window_top = Math.round((overlay_height / 2) - (window_height / 2));

       obj_window.style.margin = '0px';
       obj_window.style.left = window_left + 'px';
       obj_window.style.top = window_top + 'px';
       obj_window.style.width = window_width + 'px';
       obj_window.style.height = window_height + 'px';
       obj_body.style.height = (window_height - titlebar_height) + 'px';
       if(obj_close && !obj_titlebar)
       {
         var close_offset_left = Math.round(obj_close.offsetWidth / 2);
         var close_offset_top = Math.round(obj_close.offsetHeight / 2);

         if((window_top < close_offset_top) || ((options.type != 'image') && (obj_body.offsetWidth - obj_body.clientWidth > 0)))//если надо сместить вправо
         {
           obj_close.style.left = (window_left + window_width) + 'px';
           obj_close.style.top = /*Math.min(window_top,*/ Math.max(window_top - (close_offset_top * 2), 0) + 'px';
         }
         else
         {
           obj_close.style.left = (window_left + window_width - close_offset_left) + 'px';
           obj_close.style.top = (window_top - close_offset_top) + 'px';
         }
       }

       if(((options.type != 'image') || (obj_title && !obj_titlebar)) && (window_width >= old_width) && (window_height >= old_height))//need recalc (content or bottom title) after set width
       {
         if((window_width != old_width) || (window_height != old_height))
         {
           setTimeout(microlightbox_recalc, 10);
         }
       }
       old_width = window_width;
       old_height = window_height;
     }
   }
   catch(e)
   {
     alert('microlightbox error #3');
   }
 }

/**
 * Произошел клик по overlay
 * @param {*} event Параметры события
 * @return {boolean|undefined}
 **/
 function microlightbox_overlay_onclick(event)
 {
   var target = event ? event.target : window.event.srcElement;
   if(target == obj_overlay)
   {
     microlightbox_close();
     return false;
   }
 }

/**
 * Закрыть popup
 * @return {boolean|undefined}
 **/
 function microlightbox_close()
 {
   try{
     if(obj_overlay)
     {
       obj_overlay.parentNode.removeChild(obj_overlay);
       document.body.style.overflow = old_body_style_overflow;//restore old value
     }

     if(obj_spoof)
     {
       if(obj_target)
       {
         obj_target.style.display = old_target_style_display;
         obj_spoof.parentNode.insertBefore(obj_target, obj_spoof);
       }
       obj_spoof.parentNode.removeChild(obj_spoof);
     }

     old_width = 0;
     old_height = 0;
     old_body_style_overflow = '';
     old_target_style_display = 'none';
     obj_spoof = null;
     obj_target = null;
     obj_image = null;
     obj_overlay = null;
     obj_window = null;
     obj_body = null;
     obj_content = null;
     obj_titlebar = null;
     obj_title = null;
     obj_close = null;
   }
   catch(e)
   {
     alert('microlightbox error #5');
   }
   return false;
 }

 if(window.addEventListener)
 {
   window.addEventListener('orientationchange', microlightbox_recalc);
   window.addEventListener('resize', microlightbox_recalc);
 }
 else
 {
   window.attachEvent('onorientationchange', microlightbox_recalc);
   window.attachEvent('onresize', microlightbox_recalc);
 }

 window['microlightbox'] = microlightbox;
 window['microlightbox_close'] = microlightbox_close;

})();