# microlightbox
Small lightbox + html popup. Pure JavaScript + CSS. No dependencies!

## Browser support

microlightbox supports all major browsers including Internet Explorer 8 and above

## Demo

* [microlightbox demo](http://kyberprizrak.ru/microlightbox/demo.html)

## Quick start

1) Copy *microlightbox.min.js* (5.5 kb) and *microlightbox.css* (3 kb)
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
    microlightbox(".microlightbox");
</script>
```
4) add class "microlightbox" to &lt;a&gt;:
```html
    <a class="microlightbox" href="...">
```

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
   * начинающаяся с символа "." - название класса. Поведение функции аналогично вызову функции для каждого DOM-елемента с этим классом.
   * в других случаях - воспринимается как HTML-код, который должен быть отображен во всплывашке.

**opt**: object {optionname1:value[, optionname2:value2]}

### Available options
| Key           |  Type        | Default value     | Description      |
| ------------- |:------------:|:-----------------:| :----------------|
| type          | string       | 'auto'            | Декларирует тип содержимого. Может принмать значения: 'auto', 'image', 'html' или 'inline'. Если 'auto' - определить автоматически. |
| title         | string, null | null              | Строка, содержащая заловок всплывающиего окна; Если null - попытаться прочитать из атрибута title |
| titlePosition | string       | 'auto'            | позиция отображения title: 'titlebar', 'inside' или 'auto' (для image - используется inside, во всех остальных случаях - titlebar) |
| padding       | integer      | 10                | Пространство между контейнером microlightbox и контентом. |
| margin        | integer      | 20                | Пространство между областью просмотра и контейнером microlightbox. |
| minWidth      | integer      | 100               | Минимальная ширина контейнера microlightbox. |
| minHeight     | integer      | 100               | Минимальная высота контейнера microlightbox. |
| maxWidth      | integer      | 0                 | Максимальная ширина контейнера microlightbox. Если 0 - игнорировать. |
| maxHeight     | integer      | 0                 | Максимальная высота контейнера microlightbox. Если 0 - игнорировать. |
| width         | integer      | 0                 | Ширина контейнера microlightbox по умолчанию. Если 0 - игнорировать. Данный параметр игнорируется для изображений. |
| overlayColor  | string       | 'rgba(0,0,0,0.7)' | Цвет фонового затемнения (значение для microlightbox_overlay.style.backgroundColor). |

 
## Examples
 
```js
<script>
    microlightbox("#id");
    microlightbox(".classname");
    microlightbox(document.getElementById("id"), {title:"text"});
    microlightbox("#id", {title:"text", titlePosition:"titlebar", overlayColor:''});
    microlightbox("<b>html code</b>", {minWidth:200});
    microlightbox("image.jpg", {type:"image"});
</script>
```
