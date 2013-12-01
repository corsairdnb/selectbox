// select styling plugin
(function($,window,document){

    // plugin class
    var Selectbox = function ($, instance, options) {
        var _this = this,
            plugin = $("[data-name='"+$(instance).attr("name")+"']");
        _this.settings = $.extend({
            node: _this,
            parent: instance,
            closeOnChange: true,
            closeOnClickOut: true,
            addID: "",
            wrapWith: "",
            defaultValue: false,
            defaultText: false,
            width: false,
            addWidth: false,
            onChange: false,
            onShow: false,
            onHide: false,
            onRender: false,
            renderOn: false,
            closeBtn: false,
            closeBtnSingle: false,
            selectedText: false
        }, options);
        _this.state = {
            init: false,
            enabled: true,
            opened: false,
            multiple: instance.multiple,
            selected: 0,
            rendering: false
        };
        _this.selectbox = {};
        _this.init = function() {
            if (!_this.state.init) {
                _this.state.init = true;
                var parent = $(instance),
                    selected = parent.find("option").filter(":selected"),
                    classlist = "selectbox enabled",
                    id = "",
                    attributes = ["class","id"],
                    wrapper = $("<div/>",{
                        'class': "selectbox-wrapper"
                    })
                        .html(_this.makeList(parent))
                        .prepend((function(){
                            return $("<span/>",{
                                'class': "selectbox-label",
                                text: (function(){
                                    if (_this.state.multiple) return _this.settings.defaultText;
                                    else return parent.find(":selected").html();
                                }())
                            });
                        }()))
                        .width((function(){
                            if (typeof _this.settings.width == "number" || /(\d)|(\dpx)/.test(_this.settings.width)) {
                                return _this.settings.width;
                            }
                            else {
                                if (typeof _this.settings.addWidth == "number") {
                                    return parent.width()+_this.settings.addWidth;
                                }
                                else if (_this.settings.width && /\d%/.test(_this.settings.width)) {
                                    return _this.settings.width;
                                }
                                else {
                                    return parent.width()+30;
                                }
                            }
                        }()));

                if (_this.settings.addID) id = _this.settings.addID;
                else id = _this.settings.addID;
                for (var a in attributes) {
                    var val;
                    if (attributes.hasOwnProperty(a)) {
                        val = parent.attr(attributes[a]);
                        if (typeof val !== "undefined") classlist += " "+val;
                    }
                }

                if (_this.state.multiple) classlist += " multiple"; else classlist += " single";
                _this.selectbox = $("<div/>",{
                    id: id,
                    'class': classlist,
                    'data-name': parent.attr("name")
                })
                    .on("click",function(e){
                        var target = $(e.target);
                        if ( target[0].tagName=="LI" || target.hasClass("wrap") ) {
                            if (target[0].tagName=="LI") {
                                _this.setValue(target.attr("data-value"));
                            }
                            else {
                                _this.setValue(target.parents("li").attr("data-value"));
                            }
                        }
                        else {
                            _this.toggle();
                        }
                    })
                    .html(wrapper)
                    .insertAfter(parent);


                _this.state.selected = selected.length;
                _this.label = _this.selectbox.find(".selectbox-label");
                _this.setLabel();

                // set initial value
                if (_this.settings.defaultValue) {
                    _this.setValue(_this.settings.defaultValue);
                }
                else if (selected.length>0) {
                    _this.setValue(selected.val());
                }
                //console.log($(instance).attr("name")+" initialized");

                // hide parent
                parent.addClass("has-selectbox");
                return true;
            }
            return false;
        };
        _this.render = function() {
            _this.selectbox.find(".selectbox-dropdown").replaceWith(_this.makeList($(instance)));
            var selected = 0;
            _this.selectbox.find(".selected").not(".disabled").each(function(i,e){
                if ($(e).attr("data-value")!="") {
                    selected++;
                }
            });
            //console.log(selected);
            _this.state.selected = selected;
            _this.setLabel();
        };
        _this.setLabel = function(html) {
            if (_this.state.multiple) {
                if (!html) {
                    var str = "";
                    if (parseInt(_this.state.selected)>0) {
                        str = _this.settings.selectedText.replace("{items}",_this.state.selected);
                    } else {
                        if (_this.settings.defaultText) str = _this.settings.defaultText;
                    }
                    _this.label.html(str);
                }
                else {
                    _this.label.html(html);
                }
            }
            else {
                _this.label.html(html);
            }
        };
        _this.makeList = function(parent) {
            var ul = $("<ul/>"),
                val = "", text = "", cl = "",
                options = parent.children().filter("option"),
                dropdown = $("<div/>",{'class':'selectbox-dropdown'}),
                dropdownWrapper = $("<div/>",{'class':'selectbox-dropdown-wrapper'});
            options.each(function(i,e){
                val = $(e).val();
                text = $(e).html();
                if ($(e).prop("disabled")) cl += " disabled";
                //if (!_this.state.multiple) console.log($(e).prop("selected"))
                if ($(e).prop("selected")) cl += " selected";
                if (i == 0) cl += " first";
                if (i == options.length-1) cl += " last";
                if (_this.settings.wrapWith) {
                    for (var el in _this.settings.wrapWith) {
                        text = "<"+_this.settings.wrapWith[el]+" class='wrap'>"+
                            text+"</"+_this.settings.wrapWith[el]+">";
                    }
                }
                $("<li/>",{
                    "data-value": val
                })
                    .addClass(cl)
                    .html(text)
                    .appendTo(ul);
                cl = "";
            });
            dropdownWrapper
                .append(ul)
                .append((function(){
                    if ( (_this.settings.closeBtn && _this.state.multiple) || (_this.settings.closeBtn && !_this.state.multiple && _this.settings.closeBtnSingle) ) {
                        return $("<span/>",{
                            'class': 'selectbox-close',
                            html: _this.settings.closeBtn
                        })
                            .on("click",function(){
                                $(instance).trigger("blur");
                            });
                    } else {
                        return false;
                    }
                }()));
            dropdown.append(dropdownWrapper);
            return dropdown;
        };
        _this.setValue = function(value) {
            var li = _this.selectbox.find("li"),
                target = li.filter("[data-value='"+value+"']"),
                options = $(instance).find("option"),
                selected = options.filter(":selected"),
                option = $(instance).find("option[value='"+value+"']"),
                reSelect, ar = [];
            if (selected.val()!=value || _this.state.multiple) {
                // single select
                if (_this.state.multiple == false) {
                    // clear value and hide select
                    if (target.attr("data-value")=="") {
                        options.prop("selected",false);
                        li.removeClass("selected");
                        $(instance).val("");
                        $(instance).trigger("change");
                        _this.state.selected = 0;
                        _this.setLabel(option.html());
                        _this.hide();
                    }
                    // set new value
                    else {
                        li.removeClass("selected");
                        target.addClass("selected");
                        $(instance).val(value);
                        _this.state.selected = 1;
                        _this.setLabel(option.html());
                        if (_this.settings.closeOnChange) _this.hide();
                    }
                }
                // multiple select
                else {
                    // clear value and hide select
                    if (target.attr("data-value")=="") {
                        options.prop("selected",false);
                        li.removeClass("selected");
                        $(instance).val("");
                        $(instance).trigger("change");
                        _this.state.selected = 0;
                        _this.setLabel();
                        _this.hide();
                    }
                    // set new value
                    else {
                        if ($(instance).val()=="") {
                            options.prop("selected",false);
                            li.removeClass("selected");
                            $(instance).val("");
                        }
                        if (target.hasClass("selected")) {
                            target.removeClass("selected");
                            option.prop("selected",false);
                        }
                        else {
                            target.addClass("selected");
                            option.prop("selected","selected");
                        }
                        options.filter("[value='']").prop("selected",false);
                        reSelect = $(instance).find("option").filter(":selected");
                        //console.log(reSelect.length);
                        reSelect.each(function(i,e){
                            var val = $(e).val();
                            if (val!="") ar.push(val);
                        });
                        //console.log(ar);
                        $(instance).val(ar);
                        //console.log($(instance).val());
                        _this.state.selected = ar.length;
                        _this.setLabel();
                        if (_this.settings.closeOnChange) _this.hide();
                    }
                }
                $(instance).trigger("change");
            }
            else if (selected.val()==value) {
                options.prop("selected",false);
                li.removeClass("selected");
                $(instance).val("");
                $(instance).trigger("change");
                _this.state.selected = 0;
                _this.setLabel();
                _this.hide();
            }
        };
        _this.show = function() {
            if (!_this.selectbox.hasClass("opened")) {
                _this.selectbox.addClass("opened");
                _this.state.opened = true;
                if (typeof _this.settings.onShow == "function") {
                    _this.settings.onShow();
                }
                $(instance).trigger("focus");
            }
        };
        _this.hide = function() {
            if (_this.selectbox.hasClass("opened")) {
                _this.selectbox.removeClass("opened");
                _this.state.opened = false;
                if (typeof _this.settings.onHide == "function") {
                    _this.settings.onHide();
                }
                $(instance).trigger("blur");
            }
        };
        _this.toggle = function() {
            if (_this.state.opened) _this.hide();
            else _this.show();
        };
        _this.init();
        $(instance).on("change",function(){
            if (typeof _this.settings.onChange == "function") {
                _this.settings.onChange();
            }
        });
        if (_this.settings.renderOn) {
            $(instance).on(_this.settings.renderOn, function(){
                _this.state.rendering = true;
                _this.render();
                _this.state.rendering = false;
                if (typeof _this.settings.onRender == "function") {
                    _this.settings.onRender();
                }
            });
        }
        _this.selectbox.on("click",function(e){
            e.stopPropagation();
            $(instance).trigger("click");
        });
        $(document).on("click",function(e){
            if ((e.target != instance) && _this.settings.closeOnClickOut) {
                _this.hide();
            }
        });
        return _this;
    };

    // serialize plugin instances from class
    $.fn.selectbox = function(options){
        return this.each(function(i,e) {
            new Selectbox ($, this, options);
        });
    }

})($,window,document);