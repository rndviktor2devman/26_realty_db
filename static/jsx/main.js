var ADList = React.createClass({
    //init state
    getInitialState: function(){
        return{
            ads: [],
            filter: null,
            page: 1
        }
    },

    setFilters: function (filter) {

    },

    componentDidMount: function(){
        var sendUrl = '/get_ads';
        var request_data = {
            'filter': this.state.filter,
            'page': this.state.page
        };
        $.ajax({
          url: sendUrl,
          type: 'POST',
          data: JSON.stringify(request_data),
          contentType: 'application/json;charset=UTF-8',
          success: function(data) {
              this.setState({ads: data.ads});
              console.log(data.total);
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
    },

    render: function () {
        var ads = this.state.ads;
        return(<div>
                { ads.length === 0? <div>Жилья не найдено, измените условия поиска или обновите базу</div>:
                <ul className="list-unstyled">
                    {ads.map(function(ad){
                        return <li>
                            <div className="panel-body">
                                <div className="row">
                                  <div className="col-sm-12">
                                    <div>
                                      <div className="row">
                                        <div className="col-sm-7">
                                          <p><strong>Продается { ad.rooms_number }-комнатная квартира</strong></p>
                                        </div>
                                        <div className="col-sm-5">
                                          <p className="text-right"><strong class="nowrap">{ ad.price } р.</strong></p>
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-sm-12">
                                          <p>{ ad.settlement }, { ad.address }</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-sm-12">
                                    <p>
                                      <span className="label label-success">комнат: { ad.rooms_number }</span>
                                      <span className="label label-primary">{ ad.premise_area } кв.м.</span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                        </li>
                    })}
                </ul>
                }
            </div>
        )
    }
});


var SearchPanel = React.createClass({
    //init state
    getInitialState: function(){
        return {
            main_cities: [],
            letters: [],
            priceFrom: null,
            priceTo: null,
            selectedCity: '',
            selectedNew: false
        }
    },

    componentDidMount: function(){
        sendUrl = '/get_district_list';
        $.ajax({
          url: sendUrl,
          dataType: 'json',
          cache: false,
          success: function(data) {
              if(data){
                console.log(data);
                this.setState({
                    main_cities: data.main_cities_map,
                    letters: data.letters
                });
              }
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
    },

    render: function () {
        var main_cities = this.state.main_cities;
        var letters = this.state.letters;
        return(<div className="panel-body">
                  <p>город / районный центр</p>
                  <div className="form-group">
                    <select name="oblast_district" className="form-control">
                        {
                            main_cities.map(function(city){
                                return <option value={city.district}>{city.name}</option>
                            })
                        }

                        {
                            letters.map(function(letter) {
                                return <optgroup label={letter.letter}>
                                {
                                    letter.array.map(function (city) {
                                        return <option value={city.district}>{city.name}</option>
                                    })
                                }
                                </optgroup>
                            })
                        }
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

    handleInputKeyDown: function (event) {
        if(event.keyCode === 13 && !this.state.editMode){
            var password = {'password': this.state.password};
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
                  if(xhr.responseJSON.error_type == 1){
                    this.setState({update_message: '', editMode: false, passwordError: true});
                  }else{
                    this.setState({update_message: xhr.responseJSON.message, update_error: true});
                  }
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
                <input name="password" className="form-control" type="password" onChange={this.handlePassword} onKeyDown={this.handleInputKeyDown} placeholder="Пароль от базы" value={this.state.password}/>
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

var MainSitePanel = React.createClass({
    //init state
    getInitialState: function(){
      return {
      };
    },

    render: function () {
        return(<div>
            <div className="row">
                <div className="col-md-9">
                  <div className="row">
                    <div className="col-sm-4">
                      <form role="form" className="panel panel-default">
                        <SearchPanel/>
                      </form>
                      <form role="form" className="panel panel-default">
                        <DbSetupPanel/>
                      </form>
                    </div>
                    <div className="col-sm-8">
                      <div className="panel panel-default">
                        <ADList/>
                        {/*<div className="panel-body">*/}
                          {/*<div className="clearfix">*/}
                            {/*<ul className="pagination pull-right">*/}
                              {/*<li className="disabled"><span>«</span></li>*/}
                              {/*<li className="active"><span>1 <span className="sr-only">(current)</span></span></li>*/}
                              {/*<li><a href="?page=2" role="next">2</a></li>*/}
                              {/*<li><a href="?page=3" role="next">3</a></li>*/}
                              {/*<li><a href="?page=4" role="next">4</a></li>*/}
                              {/*<li><a href="?page=2" role="next">»</a></li>*/}
                            {/*</ul>*/}
                          {/*</div>*/}
                        {/*</div>*/}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
        </div>);
    }
});

ReactDOM.render(
    <MainSitePanel/>,
    document.getElementById('main_site_panel')
);