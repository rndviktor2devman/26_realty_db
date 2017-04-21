var ADList = React.createClass({
    //init state
    getInitialState: function(){
        return{
            ads: [],
        }
    },

    componentDidMount: function(){

    },

    render: function () {
        return(<div>

            </div>
        )
    }
});


var SearchPanel = React.createClass({
    //init state
    getInitialState: function(){
        return{
            priceFrom: null,
            priceTo: null,
            selectedCity: '',
            selectedNew: false
        }
    },

    componentDidMount: function(){

    },

    render: function () {
        return(<div className="panel-body">
                  <p>город / районный центр</p>
                  <div className="form-group">
                    <select name="oblast_district" className="form-control">
                      <option value="Череповецкий район">Череповец</option>
                      <option value="Шекснинский район">Шексна</option>
                      <option value="Вологодский район">Вологда</option>
                      <optgroup label="Б">
                        <option value="Бабаевский район">Бабаево</option>
                        <option value="Бабушкинский район">Село имени Бабушкина</option>
                        <option value="Белозерский район">Белозерск</option>
                      </optgroup>
                      <optgroup label="В">
                        <option value="Великоустюгский район">Великий Устюг</option>
                        <option value="Верховажский район">Верховажье</option>
                        <option value="Вожегодский район">Вожега</option>
                        <option value="Вологодский район">Вологда</option>
                        <option value="Вытегорский район">Вытегра</option>
                      </optgroup>
                      <optgroup label="Г">
                        <option value="Грязовецкий район">Грязовец</option>
                      </optgroup>
                      <optgroup label="К">
                        <option value="Кадуйский район">Кадуй</option>
                        <option value="Кирилловский район">Кириллов</option>
                        <option value="Кичменгско-Городецкий район">Кичменгский Городок</option>
                      </optgroup>
                      <optgroup label="Л">
                        <option value="Вашкинский район">Липин Бор</option>
                      </optgroup>
                      <optgroup label="Н">
                        <option value="Никольский район">Никольск</option>
                        <option value="Нюксенский район">Нюксеница</option>
                      </optgroup>
                      <optgroup label="С">
                        <option value="Сокольский район">Сокол</option>
                        <option value="Сямженский район">Сямжа</option>
                      </optgroup>
                      <optgroup label="Т">
                        <option value="Тарногский район">Тарногский Городок</option>
                        <option value="Тотемский район">Тотьма</option>
                      </optgroup>
                      <optgroup label="У">
                        <option value="Усть-Кубинский район">Устье</option>
                        <option value="Устюженский район">Устюжна</option>
                      </optgroup>
                      <optgroup label="Х">
                        <option value="Харовский район">Харовск</option>
                      </optgroup>
                      <optgroup label="Ч">
                        <option value="Чагодощенский район">Чагода</option>
                        <option value="Череповецкий район">Череповец</option>
                      </optgroup>
                      <optgroup label="Ш">
                        <option value="Шекснинский район">Шексна</option>
                        <option value="Междуреченский район">Шуйское</option>
                      </optgroup>
                    </select>
                  </div>
                  <div className="form-group ">
                    <div className="checkbox">
                      <label>
                          <input type="checkbox" name="new_building" value="True"/>
                        только новостройки
                      </label>
                    </div>
                  </div>
                  <p><strong>Цена</strong></p>
                  <div className="form-group ">
                    <div className="input-group">
                      <span className="input-group-addon">от</span>
                        <input type="text" value="" name="min_price" className="form-control js-price-format" placeholder="любая" />
                      <span className="input-group-addon">р.</span>
                    </div>
                  </div>
                  <div className="form-group ">
                    <div className="input-group">
                      <span className="input-group-addon">до</span>
                        <input type="text" value="" name="max_price" className="form-control js-price-format" placeholder="любая" />
                      <span className="input-group-addon">р.</span>
                    </div>
                  </div>
                </div>
        )
    }
});

var DbSetupPanel = React.createClass({
    //init state
    getInitialState: function(){
      return {
          password: '',
          passwordError: false,
          editMode: false,
          path: '',
          update_datetime: '',

          update_error: false,
          update_message: ''
      };
    },

    componentDidMount: function(){
        sendUrl = '/get_database_status';
        $.ajax({
          url: sendUrl,
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

    handlePassword: function(event){
        if(!this.state.editMode){
            var password = {'password': event.target.value};
            var sendUrl = '/check_db_pass';
            $.ajax({
              url: sendUrl,
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

            this.setState({password:password.password});
        }
    },

    handlePath: function(event){
        var newPath = event.target.value;
        this.setState({path: newPath});
    },

    updateDatabase: function(){
        var sendUrl = '/update_database';
        var sendData = {
            'password': this.state.password,
            'path': this.state.path
        };
        $.ajax({
          url: sendUrl,
          type: 'POST',
          data: JSON.stringify(sendData),
          contentType: 'application/json;charset=UTF-8',
          success: function(data) {
              this.setState({update_message: data.update_message, update_datetime:data.update_datetime, update_error: false});
          }.bind(this),
          error: function(xhr, status, err) {
              if(xhr.status == 400) {
                  this.setState({update_message: xhr.responseJSON.message, update_error: true});
              }
          }.bind(this)
        });
    },

    refreshPage: function(){
        window.location.href = '/';
    },

    render: function(){
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
                <input name="password" className="form-control" type="password" onChange={this.handlePassword} placeholder="Пароль от базы" value={this.state.password}/>
                {passError ? <span className="error-field">Некорректный пароль</span> : null}
            </div>
            <div className={updateError? "has-error" : "form-group"}>
                <input className="form-control" disabled={!editMode} placeholder="Путь к Json-файлу или Url" value={this.state.path} onChange={this.handlePath}/>
                {updateMessage ? <span className={updateError ? "error-field" : "success-field"}>{this.state.update_message}</span> : null}
            </div>
            <div className="form-group">
                <button type="button" className="btn btn-primary" disabled={!editMode} onClick={this.updateDatabase}>Обновить базу</button>
            </div>
            {updateSucceed ?
                <div className="form-group">
                    <button type="button" className="btn btn-primary" onClick={this.refreshPage}>Работать с новой базой</button>
                </div>
                : null
            }
        </div> )
    }
});

//ReactDOM.render(
//    <ADList/>,
//    document.getElementById('ads_panel')
//);



ReactDOM.render(
    <SearchPanel/>,
    document.getElementById('search_panel')
);

ReactDOM.render(
    <DbSetupPanel/>,
    document.getElementById('database_setup')
);