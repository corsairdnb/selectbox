selectbox
===========

Plugin for searching text nodes in the page, like native browser search

How to use

HTML
```html
<select id="select" class="select">
    <option value="1">One Option</option>
    <option value="2">Two Option</option>
    <option value="3">Three Option</option>
</select>
```

JS
```javascript
$(".select").selectbox({
    closeOnChange: false,
    renderOn: "filtered",
    width: "100%",
    defaultText: "Не выбрано"
});
```
