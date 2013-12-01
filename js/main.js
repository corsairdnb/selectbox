$(function(){

    var selector = $(".select");

    selector.selectbox({
        closeOnChange: false,
        renderOn: "filtered",
        width: "100%",
        defaultText: "Не выбрано"
    });

});