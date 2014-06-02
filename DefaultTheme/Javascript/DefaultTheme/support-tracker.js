jQuery(document).ready(function($){

    function titleFormat(title, currentArray, currentIndex, currentOpts) {
        var a = $(currentArray[currentIndex]),
            tr = a.closest('.note'),
            principal = $('.principal', tr).text(),
            time = $('.create_time', tr).text(),
            content = $('.content', tr).text();

        if(content && content.length > 80) content = content.substring(0, 79) + '...';
        var nt = '<div id="note-img-title">'
            + '<span class="cnt">Image ' + (currentIndex + 1) + ' of ' + currentArray.length + '</span>'
            + (title && title.length ? '<b class="filename">' + title + '</b>' : '' )
            + '<div class="note_info">'
            + '<div class="principal">' + principal + '</div>'
            + '<div class="create_time">' + time + '</div>'
            + '</div>'
            + '<div class="content">' + content + '</div>'
            + '</div>';
        return nt;
    }

    function linkifyHandler(links){
        links.addClass('auto_link').attr('target', '_blank');
    }

    function updateAnchors(ctx){
        if(this.nodeType == 1) ctx = this;

        $('.issue_view .field_description, .issue_view .note_body .content').linkify({handleLinks:linkifyHandler});

        $('ul.files .file a', ctx).each(function(){
            if(/(.jpg|.jpeg|.gif|.bmp|.png|.svg|.ico)([?;#]|$)/ig.test(this.href)) {
                var a = $(this), view = a.clone();
                view.html('<span>view</span>');
                view.attr('id', view.attr('id') + '_fancy');
                view.attr('rel', 'issue_files');
                view.addClass('fancybox').addClass('preview');
                view.attr('href',  view.attr('href').replace(/disposition=attachment/, ''));
                a.after(view);
                a.after('&nbsp;');
                a.attr('target', '_blank');
            }
        });

        $('ul.files .file a.fancybox', ctx).fancybox({
            titleFormat: titleFormat,
            titlePosition: 'inside'
        });
    }

    function it_postUpdate(data){
        var nodes = $(data.nodesUpdated);
        nodes.each(updateAnchors);
        $('#eminvalidEmail').remove();
        $('.message_container').each(function(){
            if (!$(this).children().length) {
                $(this).remove();
            }
        });
    }


    function it_onSubmit() {
        var $this = $(this);
        var $contactEmail = $this.find('.field_contactemail input');
        var $mc = $this.find('.message_container');

        if ($contactEmail.length && $contactEmail.val().length && $contactEmail.val().indexOf('@') < 0) {
            $contactEmail.parent().addClass('validation_error');

            if (!$mc.length) {
                $mc = $('<div class="message_container" />').prependTo($('.task_container', this));
            }

            $mc.find('#eminvalidEmail').remove();

            $('<div class="message error" />').attr('id', 'eminvalidEmail').text('Contact Email: Invalid email').appendTo($mc);
            return false;
        }

        return true;
    }

    var it_opts = {postUpdate: it_postUpdate, onSubmit: it_onSubmit}, forms = $('form.miwt-form');
    forms.prop('submit_options', it_opts);
    forms.each(updateAnchors);


    function hashChangeHighlight(){
        if((location.hash||'').indexOf('#note_') == 0) {
            $('.note_selected').removeClass('note_selected');
            $(location.hash).closest('.note').addClass('note_selected');
        }
    }
    if(window.addEventListener)
        window.addEventListener('hashchange', hashChangeHighlight, false);
    hashChangeHighlight();

    var inIE=false, updateMIWTFormFlag=false, lastAutoUpdate=0;
    function updateMIWTForm(){
        if(!updateMIWTFormFlag) return;
        updateMIWTFormFlag=false;
        var now = new Date().getTime(), diff = now - lastAutoUpdate;
        var runSearch = diff > 45000;
        var reload = diff > 3000;
        //console.log(diff);
        if(!reload) return;
        //console.log('Update form');
        $('#issue_tracker .miwt-form').each(function(i, e){
            e.MIWTSubmit({serialize:function(form,sv){
                var fs = miwt.serialize(form,sv);
                if(runSearch) fs = fs + '&il2s=1';
                return fs;
            }});
        });
        lastAutoUpdate=now;
    }
    function prepareForFocus()
    {
        if(inIE) return;
        updateMIWTFormFlag=true;
        lastAutoUpdate=new Date().getTime();
    }
    // Check to see if we are in an interactive element, that could interfere with the auto update
    function inIECheck(event)
    {
        var el = event.target;
        if(el && el.type == 'file'){
            inIE=true;
        } else {
            inIE=false;
        }
    }
    $(document).click(inIECheck).focus(inIECheck);

    $(window).blur(prepareForFocus).focus(function(){
        // Delay in case focus was regained by clicking an MIWT button - need to give it a chance first.
        // MIWT internally prevents multiple submits back-to-back, so no additional work should need to be done.
        setTimeout(updateMIWTForm,150);
    });

});
