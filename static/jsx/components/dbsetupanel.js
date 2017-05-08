import React, {Component} from 'react';

class DbSetupPanel extends Component{
    constructor(props, context){
        super(props, context);

        this.state = {
            password: '',
            passwordError: false,
            editMode: false,
            path: '',
            update_datetime: '',
            update_error: false,
            update_message: ''
        }
    }

    componentDidMount(){
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
    }

    handleInputKeyDown(event) {
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
    }

    handlePassword(event){
        if(!this.state.editMode){
            this.setState({password:event.target.value});
        }
    }

    handlePath(event){
        var newPath = event.target.value;
        this.setState({path: newPath});
    }

    updateDatabase(){
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
    }

    refreshPage(){
        window.location.href = '/';
    }

    render(){
        var passError = this.state.passwordError && this.state.password && this.state.password.length > 0;
        var updateError = this.state.update_error;
        var updateMessage = this.state.update_message && this.state.update_message.length > 0;
        var updateSucceed = updateMessage && !updateError;
        var editMode = this.state.editMode;
        return(<div className="panel-body">
            <div className="form-group">
                <label>База данных <p>{this.state.update_datetime}</p></label>
            </div>
            <div className={passError? "has-error" : "form-group"} >
                <input name="password" className="form-control" type="password" onChange={this.handlePassword} onKeyDown={this.handleInputKeyDown.bind(this)} placeholder="Пароль от базы" value={this.state.password}/>
                {passError ? <span className="error-field">Некорректный пароль</span> : null}
            </div>
            <div className={updateError? "has-error" : "form-group"}>
                <input className="form-control" disabled={!editMode} placeholder="Путь к Json-файлу или Url" value={this.state.path} onChange={this.handlePath.bind(this)}/>
                {updateMessage ? <span className={updateError ? "error-field" : "success-field"}>{this.state.update_message}</span> : null}
            </div>
            <div className="form-group">
                <button type="button" className="btn btn-primary" disabled={!editMode} onClick={this.updateDatabase.bind(this)}>Обновить базу</button>
            </div>
            {updateSucceed ?
                <div className="form-group">
                    <button type="button" className="btn btn-primary" onClick={this.refreshPage}>Работать с новой базой</button>
                </div>
                : null
            }
        </div> )
    }
};

export default DbSetupPanel;
