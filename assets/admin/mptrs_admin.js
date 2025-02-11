(function ($) {
    // =====================sidebar modal open close=============
    $(document).on('click', '[data-modal]', function (e) {
        const modalTarget = $(this).data('modal');
        $(`[data-modal-target="${modalTarget}"]`).addClass('open');
    });
    $(document).on('click', '[data-modal-target] .mptrs-modal-close', function (e) {
        $(this).closest('[data-modal-target]').removeClass('open');

    });
    // ============= Faq sidebar modal ======================
    $(document).on('click', '.mptrs-faq-item-new', function (e) {
        $('#mptrs-faq-msg').html('');
        $('.mptrs_faq_save_buttons').show();
        $('.mptrs_faq_update_buttons').hide();
        empty_faq_form();
    });
    function close_sidebar_modal(e) {
        e.preventDefault();
        e.stopPropagation();
        $('.mptrs-modal-container').removeClass('open');
    }
    $(document).on('click', '.mptrs-faq-item-edit', function (e) {
        $('#mptrs-faq-msg').html('');
        $('.mptrs_faq_save_buttons').hide();
        $('.mptrs_faq_update_buttons').show();
        var itemId = $(this).closest('.mptrs-faq-item').data('id');
        var parent = $(this).closest('.mptrs-faq-item');
        var headerText = parent.find('.faq-header p').text().trim();
        var faqContentId = parent.find('.faq-content').text().trim();
        var editorId = 'mptrs_faq_content';
        $('input[name="mptrs_faq_title"]').val(headerText);
        $('input[name="mptrs_faq_item_id"]').val(itemId);
        if (tinymce.get(editorId)) {
            tinymce.get(editorId).setContent(faqContentId);
        } else {
            $('#' + editorId).val(faqContentId);
        }
    });
    $(document).on('click', '.mptrs-faq-item-delete', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var itemId = $(this).closest('.mptrs-faq-item').data('id');
        var isConfirmed = confirm('Are you sure you want to delete this row?');
        if (isConfirmed) {
            delete_faq_item(itemId);
        } else {
            console.log('Deletion canceled.' + itemId);
        }
    });
    function empty_faq_form() {
        $('input[name="mptrs_faq_title"]').val('');
        tinyMCE.get('mptrs_faq_content').setContent('');
        $('input[name="mptrs_faq_item_id"]').val('');
    }
    $(document).on('click', '#mptrs_faq_update', function (e) {
        e.preventDefault();
        update_faq();
    });
    $(document).on('click', '#mptrs_faq_save', function (e) {
        e.preventDefault();
        save_faq();
    });
    $(document).on('click', '#mptrs_faq_save_close', function (e) {
        e.preventDefault();
        save_faq();
        close_sidebar_modal(e);
    });
    function update_faq() {
        var title = $('input[name="mptrs_faq_title"]');
        var content = tinyMCE.get('mptrs_faq_content').getContent();
        var postID = $('input[name="mptrs_post_id"]');
        var itemId = $('input[name="mptrs_faq_item_id"]');
        $.ajax({
            url: mptrs_admin_ajax.ajax_url,
            type: 'POST',
            data: {
                action: 'mptrs_faq_data_update',
                mptrs_faq_title: title.val(),
                mptrs_faq_content: content,
                mptrs_faq_postID: postID.val(),
                mptrs_faq_itemID: itemId.val(),
                nonce: mptrs_admin_ajax.nonce
            },
            success: function (response) {
                $('#mptrs-faq-msg').html(response.data.message);
                $('.mptrs-faq-items').html('');
                $('.mptrs-faq-items').append(response.data.html);
                setTimeout(function () {
                    $('.mptrs-modal-container').removeClass('open');
                    empty_faq_form();
                }, 1000);
            },
            error: function (error) {
                console.log('Error:', error);
            }
        });
    }
    function save_faq() {
        var title = $('input[name="mptrs_faq_title"]');
        var content = tinyMCE.get('mptrs_faq_content').getContent();
        var postID = $('input[name="mptrs_post_id"]');
        $.ajax({
            url: mptrs_admin_ajax.ajax_url,
            type: 'POST',
            data: {
                action: 'mptrs_faq_data_save',
                mptrs_faq_title: title.val(),
                mptrs_faq_content: content,
                mptrs_faq_postID: postID.val(),
                nonce: mptrs_admin_ajax.nonce
            },
            success: function (response) {
                $('#mptrs-faq-msg').html(response.data.message);
                $('.mptrs-faq-items').html('');
                $('.mptrs-faq-items').append(response.data.html);
                empty_faq_form();
            },
            error: function (error) {
                console.log('Error:', error);
            }
        });
    }
    function delete_faq_item(itemId) {
        var postID = $('input[name="mptrs_post_id"]');
        $.ajax({
            url: mptrs_admin_ajax.ajax_url,
            type: 'POST',
            data: {
                action: 'mptrs_faq_delete_item',
                mptrs_faq_postID: postID.val(),
                itemId: itemId,
                nonce: mptrs_admin_ajax.nonce
            },
            success: function (response) {
                $('.mptrs-faq-items').html('');
                $('.mptrs-faq-items').append(response.data.html);
            },
            error: function (error) {
                console.log('Error:', error);
            }
        });
    }
})(jQuery);
