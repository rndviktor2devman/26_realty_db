import Pager from 'react-pager';

var DbSetupPanel = React.createClass({
    getInitialState: function () {
        return {
            password: '',
            passwordError: false,
            editMode: false,
            path: '',
            update_datetime: '',
            update_error: false,
            update_message: ''
        }
    },

    componentDidMount: function () {
        var sendurl = '/get_database_status';
        $.ajax({
          url: sendurl,
          dataType: 'json',
          cache: false,
          success: function(data) {
              this.setState({path:data.path, update_datetime:data.update_datetime});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
    },

    handleInputKeyDown: function(event) {
        if(event.keyCode === 13 && !this.state.editMode){
            var password = {'password': this.state.password};
            var sendurl = '/check_db_pass';
            $.ajax({
              url: sendurl,
              type: 'POST',
              data: JSON.stringify(password),
              contentType: 'application/json;charset=UTF-8',
              success: function(data) {
                  this.setState({editMode: true, passwordError: false});
              }.bind(this),
              error: function(xhr, status, err) {
                  if(xhr.status == 400){
                      this.setState({editMode: false, passwordError: true});
                  }
              }.bind(this)
            });
        }
    },

    handlePassword: function(event){
        if(!this.state.editMode){
            this.setState({password:event.target.value});
        }
    },

    handlePath: function(event){
        var newPath = event.target.value;
        this.setState({path: newPath});
    },

    updateDatabase: function(){
        var sendurl = '/update_database';
        var sendData = {
            'password': this.state.password,
            'path': this.state.path
        };
        $.ajax({
          url: sendurl,
          type: 'POST',
          data: JSON.stringify(sendData),
          contentType: 'application/json;charset=UTF-8',
          success: function(data) {
              this.setState({update_message: data.update_message, update_datetime:data.update_datetime, update_error: false});
              setTimeout(function () {
                window.location.href = '/';
              }, 1000);
          }.bind(this),
          error: function(xhr, status, err) {
              if(xhr.status == 400) {
                  if(xhr.responseJSON.error_type == 1){
                    this.setState({update_message: '', editMode: false, passwordError: true});
                  }else{
                    this.setState({update_message: xhr.responseJSON.message, update_error: true});
                  }
              }
          }.bind(this)
        });
    },

    render(){
        var passError = this.state.passwordError && this.state.password && this.state.password.length > 0;
        var updateError = this.state.update_error;
        var updateMessage = this.state.update_message && this.state.update_message.length > 0;
        var editMode = this.state.editMode;
        return(<div className="panel-body">
            <div className="form-group">
                <label>База данных <p>{this.state.update_datetime}</p></label>
            </div>
            <div className={passError? "has-error" : "form-group"} >
                <input name="password" className="form-control" type="password" onChange={this.handlePassword.bind(this)} onKeyDown={this.handleInputKeyDown.bind(this)} placeholder="Пароль от базы" value={this.state.password}/>
                {passError ? <span className="error-field">Некорректный пароль</span> : null}
            </div>
            <div className={updateError? "has-error" : "form-group"}>
                <input className="form-control" disabled={!editMode} placeholder="Путь к Json-файлу или Url" value={this.state.path} onChange={this.handlePath.bind(this)}/>
                {updateMessage ? <span className={updateError ? "error-field" : "success-field"}>{this.state.update_message}</span> : null}
            </div>
            <div className="form-group">
                <button type="button" className="btn btn-primary" disabled={!editMode} onClick={this.updateDatabase.bind(this)}>Обновить базу</button>
            </div>
        </div> )
    }
});

var PagerComponent = React.createClass({
    getInitialState: function () {
        return {
            total: 0,
            visiblePages: 3,
            current: 0
        }
    },

    componentDidMount: function () {
        this.setState({current: window.pageState.current_page, total: window.pageState.pages_count});
    },

    handlePageSelection: function (newPage) {
        newPage += 1;
        var url = window.location.href;
        if(url.indexOf('?') > -1){
            var pagePosition = url.indexOf('page');
            if(pagePosition > -1){
                url = url.slice(0, pagePosition) + 'page=' + newPage;
            } else {
                url += '&page=' + newPage;
            }
        } else{
            url += '?page=' + newPage;
        }

        window.location.href = url;
    },

    render(){
        var pagesCount = this.state.total;
        return(<div>
            {pagesCount > 1?
               <Pager total={this.state.total}
                   current={this.state.current}
                   visiblePages={this.state.visiblePages}
                   titles={{ first: '|<', last: '>|' }}
                   className="pagination-sm pull-right"
                   onPageChanged={this.handlePageSelection}/>
            : null}
        </div>)
    }
});

ReactDOM.render(
    <DbSetupPanel />, document.getElementById("db_setup_panel")
);

ReactDOM.render(
    <PagerComponent/>, document.getElementById("pager_component")
);
