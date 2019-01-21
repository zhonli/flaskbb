/* This file just holds some configuration values for the editor */
marked.setOptions({
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
});

$.fn.markdown.messages.zh_CN = {
        'Bold': "粗体",
        'Italic': "斜体",
        'Heading': "标题",
        'URL/Link': "链接",
        'Image': "图片",
        'List': "列表",
        'Unordered List': "无序列表",
        'Ordered List': "有序列表",
        'Code': "代码",
        'Quote': "引用",
        'Preview': "预览",
        'strong text': "粗体",
        'emphasized text': "强调",
        'heading text': "标题",
        'enter link description here': "输入链接说明",
        'Insert Hyperlink': "URL地址",
        'enter image description here': "输入图片说明",
        'Insert Image Hyperlink': "图片URL地址",
        'enter image title here': "在这里输入图片标题",
        'list text here': "这里是列表文本",
        'code text here': "这里输入代码",
        'quote here': "这里输入引用文本"
  };

cur_lang = typeof CUR_LANG !== typeof undefined ? CUR_LANG : "en";;

$(".flaskbb-editor").markdown({
    language: cur_lang,
    iconlibrary: "fa",
    additionalButtons: [
        [{
            name: "groupHelp",
            data: [{
                name: "cmdHelp",
                toggle: false, // this param only take effect if you load bootstrap.js
                title: cur_lang=="zh_CN"?"帮助":"Help",
                icon: "fa fa-question",
                btnClass: 'btn btn-success',
                callback: function(e){
                    $('#editor-help').modal('show')
                }
            }]
        }]
    ],
    onPreview: function(e) {
        var urlprefix = typeof FORUM_URL_PREFIX !== typeof undefined ? FORUM_URL_PREFIX : "";

        $.ajax({
            type: 'POST',
            data: e.getContent(),
            dataType: "text",
            contentType: "text/plain",
            url: urlprefix + '/markdown',
            beforeSend: function(xhr, settings) {
                if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        })
        .done(function(msg) {
            parse_emoji(msg);
        })
        .fail(function(error) {
            console.error("Couldn't send text to markdown preview endpoint: " + error);
        });
    }
});

$('.flaskbb-editor').textcomplete([
    { // emoji strategy
        match: /\B:([\-+\w]*)$/,
        search: function (term, callback) {
            callback($.map(emojies, function (value) {
                return value[0].indexOf(term) !== -1 ? {character: value[1], name: value[0]} : null;
            }));
        },
        template: function (value) {
            return parse_emoji(value.character) + ' ' + value.name;
        },
        replace: function (value) {
            return value.character + ' ';
        },
        index: 1
    },
], {
    onKeydown: function (e, commands) {
        if (e.ctrlKey && e.keyCode === 74) { // CTRL-J
            return commands.KEY_ENTER;
        }
    }
});
