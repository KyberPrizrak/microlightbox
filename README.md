# microlightbox
Small lightbox + html popup. Pure JavaScript + CSS. No dependencies!

## Demo

* [microlightbox demo](http://kyberprizrak.ru/microlightbox/test.html)

## Quick start

1) Copy *microlightbox.css* and *microlightbox.min.js*
2) Add to &lt;head&gt;:

```html
<head>
    ...
    <link rel="stylesheet" href="microlightbox.css" type="text/css">
    <script type="text/javascript" src="microlightbox.min.js"></script>
    ...
</head>
```
3) call microlightbox:
```js
<script>
    microlightbox("#linkid");
</script>
```
*linkid* - &lt;a id="linkid" href="..."&gt;

## API & Options

```js
<script>
    microlightbox(elm[, opt]);
</script>
```
**elm**:
1. DOM-element:
   * &lt;a href="image.jpg"&gt; - при клике по ссылке будет открываться во вспылывающем окне ресайзеная картинка image.jpg
   * &lt;a href="#html_id"&gt; - при клике по ссылке будет открываться всплывашка с HTML-кодом блока <div id="html_id">
   * &lt;img src="image.jpg"&gt; - будет открыта всплывашка с ресайзеной картинкой, взятой из src.
   * любой другой тег - будет открыт во всплывашке.
2. string:
   * начинающаяся с символа "#" - id DOM-елемента. Поведение функции аналогично передаче DOM-елемента с указанным ID.
   * в других случаях - воспринимается как HTML-код, который должен быть отображен во всплывашке.

**opt**: {optionname1:value[, optionname2:value2]}

### Available options
| Key           |  Type   | Default value     | Description      |
| ------------- |:-------:|:-----------------:| :----------------|
| type          | string  | 'auto'            | Декларирует тип содержимого. Может принмать значения: 'auto', 'image', 'html' или 'inline'. Если 'auto' - определить автоматически. |
| title         | string  | ''                | Строка, содержащая заловок всплывающиего окна; |
| titlePosition | string  | 'auto'            | позиция отображения title: 'titlebar', 'inside' или 'auto' (для image - используется inside, во всех остальных случаях - titlebar) |
| padding       | integer | 10                | Пространство между контейнером microlightbox и контентом. |
| margin        | integer | 20                | Пространство между областью просмотра и контейнером microlightbox. |
| minWidth      | integer | 100               | Минимальная ширина контейнера microlightbox. |
| minHeight     | integer | 100               | Минимальная высота контейнера microlightbox. |
| maxWidth      | integer | 0                 | Максимальная ширина контейнера microlightbox. Если 0 - игнорировать. |
| maxHeight     | integer | 0                 | Максимальная высота контейнера microlightbox. Если 0 - игнорировать. |
| overlayColor  | string  | 'rgba(0,0,0,0.7)' | Цвет фонового затемнения (значение для obj_overlay.style.backgroundColor). |

 
 ## Examples
 
 ```js
<script>
    microlightbox("#id");
    microlightbox(document.getElementById("id"), {title:"text"});
    microlightbox("#id", {title:"text", titlePosition:"titlebar", overlayColor:''});
    microlightbox("<b>html code</b>", {minWidth:200});    
</script>
```
