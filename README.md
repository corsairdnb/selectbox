selectbox
===========

Plugin for styling \<select\> and \<select multiple\>

Example: http://inflottravel.artfactor.ru/navigator/

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
    closeOnChange: false, // close dropdown when selected
    renderOn: "filtered", // event name to listen to for trigger rendering
    width: "100%", // set width of selectbox
    defaultText: "Не выбрано", // default text when nothing is selected
    closeOnClickOut: true, // close dropdown when clicked somewhere on page
    addID: "my-id", // add some id
    wrapWith: "", // wrap dropdown list items in some containers
    defaultValue: false, // item with this value will be selected by default
    addWidth: false, // 100% of parent width + additional value in px
    onChange: false, // what to do on original select is changed
    onShow: false, // what to do when dropdown is shown
    onHide: false, // what to do when dropdown is hidden
    onRender: false, // what to do when selectbox is re-rendered
    closeBtn: false, // add closing button
    closeBtnSingle: false, // need closing button on single selects or not
    selectedText: "Selected: {items}", // show number of selected items
});
```

Don't forget to add stylesheets from /css/
