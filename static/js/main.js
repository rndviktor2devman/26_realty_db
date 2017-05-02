(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ADList = React.createClass({displayName: "ADList",
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
        return(React.createElement("div", null, 
                 ads.length === 0? React.createElement("div", null, "Жилья не найдено, измените условия поиска или обновите базу"):
                React.createElement("ul", {className: "list-unstyled"}, 
                    ads.map(function(ad){
                        return React.createElement("li", null, 
                            React.createElement("div", {className: "panel-body"}, 
                                React.createElement("div", {className: "row"}, 
                                  React.createElement("div", {className: "col-sm-12"}, 
                                    React.createElement("div", null, 
                                      React.createElement("div", {className: "row"}, 
                                        React.createElement("div", {className: "col-sm-7"}, 
                                          React.createElement("p", null, React.createElement("strong", null, "Продается ",  ad.rooms_number, "-комнатная квартира"))
                                        ), 
                                        React.createElement("div", {className: "col-sm-5"}, 
                                          React.createElement("p", {className: "text-right"}, React.createElement("strong", {class: "nowrap"},  ad.price, " р."))
                                        )
                                      ), 
                                      React.createElement("div", {className: "row"}, 
                                        React.createElement("div", {className: "col-sm-12"}, 
                                          React.createElement("p", null,  ad.settlement, ", ",  ad.address)
                                        )
                                      )
                                    )
                                  ), 
                                  React.createElement("div", {className: "col-sm-12"}, 
                                    React.createElement("p", null, 
                                      React.createElement("span", {className: "label label-success"}, "комнат: ",  ad.rooms_number), 
                                      React.createElement("span", {className: "label label-primary"},  ad.premise_area, " кв.м.")
                                    )
                                  )
                                )
                              )
                        )
                    })
                )
                
            )
        )
    }
});


var SearchPanel = React.createClass({displayName: "SearchPanel",
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
        return(React.createElement("div", {className: "panel-body"}, 
                  React.createElement("p", null, "город / районный центр"), 
                  React.createElement("div", {className: "form-group"}, 
                    React.createElement("select", {name: "oblast_district", className: "form-control"}, 
                        
                            main_cities.map(function(city){
                                return React.createElement("option", {value: city.district}, city.name)
                            }), 
                        

                        
                            letters.map(function(letter) {
                                return React.createElement("optgroup", {label: letter.letter}, 
                                
                                    letter.array.map(function (city) {
                                        return React.createElement("option", {value: city.district}, city.name)
                                    })
                                
                                )
                            })
                        
                    )
                  ), 
                  React.createElement("div", {className: "form-group "}, 
                    React.createElement("div", {className: "checkbox"}, 
                      React.createElement("label", null, 
                          React.createElement("input", {type: "checkbox", name: "new_building", value: "True"}), 
                        "только новостройки"
                      )
                    )
                  ), 
                  React.createElement("p", null, React.createElement("strong", null, "Цена")), 
                  React.createElement("div", {className: "form-group "}, 
                    React.createElement("div", {className: "input-group"}, 
                      React.createElement("span", {className: "input-group-addon"}, "от"), 
                        React.createElement("input", {type: "text", value: "", name: "min_price", className: "form-control js-price-format", placeholder: "любая"}), 
                      React.createElement("span", {className: "input-group-addon"}, "р.")
                    )
                  ), 
                  React.createElement("div", {className: "form-group "}, 
                    React.createElement("div", {className: "input-group"}, 
                      React.createElement("span", {className: "input-group-addon"}, "до"), 
                        React.createElement("input", {type: "text", value: "", name: "max_price", className: "form-control js-price-format", placeholder: "любая"}), 
                      React.createElement("span", {className: "input-group-addon"}, "р.")
                    )
                  )
                )
        )
    }
});

var DbSetupPanel = React.createClass({displayName: "DbSetupPanel",
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
        return(React.createElement("div", {className: "panel-body"}, 
            React.createElement("div", {className: "form-group"}, 
                React.createElement("label", null, "База данных ", React.createElement("p", null, this.state.update_datetime))
            ), 
            React.createElement("div", {className: passError? "has-error" : "form-group"}, 
                React.createElement("input", {name: "password", className: "form-control", type: "password", onChange: this.handlePassword, onKeyDown: this.handleInputKeyDown, placeholder: "Пароль от базы", value: this.state.password}), 
                passError ? React.createElement("span", {className: "error-field"}, "Некорректный пароль") : null
            ), 
            React.createElement("div", {className: updateError? "has-error" : "form-group"}, 
                React.createElement("input", {className: "form-control", disabled: !editMode, placeholder: "Путь к Json-файлу или Url", value: this.state.path, onChange: this.handlePath}), 
                updateMessage ? React.createElement("span", {className: updateError ? "error-field" : "success-field"}, this.state.update_message) : null
            ), 
            React.createElement("div", {className: "form-group"}, 
                React.createElement("button", {type: "button", className: "btn btn-primary", disabled: !editMode, onClick: this.updateDatabase}, "Обновить базу")
            ), 
            updateSucceed ?
                React.createElement("div", {className: "form-group"}, 
                    React.createElement("button", {type: "button", className: "btn btn-primary", onClick: this.refreshPage}, "Работать с новой базой")
                )
                : null
            
        ) )
    }
});

var MainSitePanel = React.createClass({displayName: "MainSitePanel",
    //init state
    getInitialState: function(){
      return {
      };
    },

    render: function () {
        return(React.createElement("div", null, 
            React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "col-md-9"}, 
                  React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-sm-4"}, 
                      React.createElement("form", {role: "form", className: "panel panel-default"}, 
                        React.createElement(SearchPanel, null)
                      ), 
                      React.createElement("form", {role: "form", className: "panel panel-default"}, 
                        React.createElement(DbSetupPanel, null)
                      )
                    ), 
                    React.createElement("div", {className: "col-sm-8"}, 
                      React.createElement("div", {className: "panel panel-default"}, 
                        React.createElement(ADList, null)
                        /*<div className="panel-body">*/
                          /*<div className="clearfix">*/
                            /*<ul className="pagination pull-right">*/
                              /*<li className="disabled"><span>«</span></li>*/
                              /*<li className="active"><span>1 <span className="sr-only">(current)</span></span></li>*/
                              /*<li><a href="?page=2" role="next">2</a></li>*/
                              /*<li><a href="?page=3" role="next">3</a></li>*/
                              /*<li><a href="?page=4" role="next">4</a></li>*/
                              /*<li><a href="?page=2" role="next">»</a></li>*/
                            /*</ul>*/
                          /*</div>*/
                        /*</div>*/
                      )
                    )
                  )
                )
              )
        ));
    }
});

ReactDOM.render(
    React.createElement(MainSitePanel, null),
    document.getElementById('main_site_panel')
);

},{}]},{},[1]);
