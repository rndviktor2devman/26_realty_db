$('#passhandle').on('keypress', function (e) {
    if(e.which === 13){
        var password = {'password': $("#passhandle").val()};
        $.ajax({
          url: '/check_db_pass',
          type: 'POST',
          data: JSON.stringify(password),
          contentType: 'application/json;charset=UTF-8',
          success: function(data) {
              if($('#input-path').attr("disabled")){
                $('#input-path').removeAttr("disabled");
              }
              if($('#submit-path').attr("disabled")){
                $('#submit-path').removeAttr("disabled");
              }
              if(!$('#error-show').hasClass('hidden')){
                $('#error-show').addClass('hidden')
              }
          }.bind(this),
          error: function(xhr, status, err) {
              if(xhr.status == 400){
                if($('#error-show').hasClass('hidden')){
                    $('#error-show').removeClass('hidden')
                }
              }
          }.bind(this)
        });
    }
});

$('#submit-path').click(function(){
    var dbUpdateData = {
        'password': $("#passhandle").val(),
        'flats-data': $('#input-path').val()
    };
    $.ajax({
      url: '/update_database',
      type: 'POST',
      data: JSON.stringify(dbUpdateData),
      contentType: 'application/json;charset=UTF-8',
      success: function(data) {
        if(!$('#database-status').hasClass('hidden')){
            $('#database-status').addClass('hidden');
        }
        if(!$('#error-show').hasClass('hidden')){
            $('#error-show').addClass('hidden');
        }

        setTimeout(function () {
            window.location.href = '/';
        }, 1000);
      }.bind(this),
      error: function(xhr, status, err) {
          if((xhr.status == 400 || xhr.status == 500) && $('#database-status').hasClass('hidden')) {
            $('#database-status').removeClass('hidden');
          }
          if(xhr.status == 401 && $('#error-show').hasClass('hidden')){
            $('#error-show').removeClass('hidden');
          }
      }.bind(this)
    });
});

$( document ).ready(function() {
    if(window.pageState.pages_count){
        $('#pager_component').twbsPagination({
            totalPages: window.pageState.pages_count,
            startPage: window.pageState.current_page,
            visiblePages: 5,
            initiateStartPageClick: false,
            onPageClick: function (event, page) {
                $('#page-content').text('Page ' + page);
                var url = window.location.href;
                if(url.indexOf('?') > -1){
                    var pagePosition = url.indexOf('page');
                    if(pagePosition > -1){
                        url = url.slice(0, pagePosition) + 'page=' + page;
                    } else {
                        url += '&page=' + page;
                    }
                } else{
                    url += '?page=' + page;
                }
                if(window.location.href != url){
                    window.location.href = url;
                }
            }
        });
    }
});