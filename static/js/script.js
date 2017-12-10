$('#passhandle').on('keypress', function (e) {
    if(e.which === 13){
        var password = {'password': $("#passhandle").val()};
        console.log(password)
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
        'path': $('#input-path').val()
    };
    $.ajax({
      url: '/update_database',
      type: 'POST',
      data: JSON.stringify(dbUpdateData),
      contentType: 'application/json;charset=UTF-8',
      success: function(data) {
          setTimeout(function () {
            window.location.href = '/';
          }, 1000);
      }.bind(this),
      error: function(xhr, status, err) {
          if(xhr.status == 400) {
              if(xhr.responseJSON.error_type != 1){
                if($('#error-show').hasClass('hidden')){
                    $('#error-show').removeClass('hidden');
                }
              }else{
                if($('#database-status').hasClass('hidden')){
                    $('#database-status').removeClass('hidden');
                }
                $('#database-status').val(xhr.responseJSON.message);
              }
          }
      }.bind(this)
    });
});

$( document ).ready(function() {
    $.ajax({
      url: '/get_database_status',
      dataType: 'json',
      cache: false,
      success: function(data) {
        $('#update-date-show').text(data.update_datetime);
        $('#input-path').val(data.path);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
});