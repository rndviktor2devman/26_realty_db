(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ADList = React.createClass({displayName: "ADList",
    //init state
    getInitialState: function(){
        return{
            ads: [],
        }
    },

    componentDidMount: function(){

    },

    render: function () {
        return(React.createElement("div", null

            )
        )
    }
});


var SearchPanel = React.createClass({displayName: "SearchPanel",
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
        return(React.createElement("div", {className: "panel-body"}, 
                  React.createElement("p", null, "город / районный центр"), 
                  React.createElement("div", {className: "form-group"}, 
                    React.createElement("select", {name: "oblast_district", className: "form-control"}, 
                      React.createElement("option", {value: "Череповецкий район"}, "Череповец"), 
                      React.createElement("option", {value: "Шекснинский район"}, "Шексна"), 
                      React.createElement("option", {value: "Вологодский район"}, "Вологда"), 
                      React.createElement("optgroup", {label: "Б"}, 
                        React.createElement("option", {value: "Бабаевский район"}, "Бабаево"), 
                        React.createElement("option", {value: "Бабушкинский район"}, "Село имени Бабушкина"), 
                        React.createElement("option", {value: "Белозерский район"}, "Белозерск")
                      ), 
                      React.createElement("optgroup", {label: "В"}, 
                        React.createElement("option", {value: "Великоустюгский район"}, "Великий Устюг"), 
                        React.createElement("option", {value: "Верховажский район"}, "Верховажье"), 
                        React.createElement("option", {value: "Вожегодский район"}, "Вожега"), 
                        React.createElement("option", {value: "Вологодский район"}, "Вологда"), 
                        React.createElement("option", {value: "Вытегорский район"}, "Вытегра")
                      ), 
                      React.createElement("optgroup", {label: "Г"}, 
                        React.createElement("option", {value: "Грязовецкий район"}, "Грязовец")
                      ), 
                      React.createElement("optgroup", {label: "К"}, 
                        React.createElement("option", {value: "Кадуйский район"}, "Кадуй"), 
                        React.createElement("option", {value: "Кирилловский район"}, "Кириллов"), 
                        React.createElement("option", {value: "Кичменгско-Городецкий район"}, "Кичменгский Городок")
                      ), 
                      React.createElement("optgroup", {label: "Л"}, 
                        React.createElement("option", {value: "Вашкинский район"}, "Липин Бор")
                      ), 
                      React.createElement("optgroup", {label: "Н"}, 
                        React.createElement("option", {value: "Никольский район"}, "Никольск"), 
                        React.createElement("option", {value: "Нюксенский район"}, "Нюксеница")
                      ), 
                      React.createElement("optgroup", {label: "С"}, 
                        React.createElement("option", {value: "Сокольский район"}, "Сокол"), 
                        React.createElement("option", {value: "Сямженский район"}, "Сямжа")
                      ), 
                      React.createElement("optgroup", {label: "Т"}, 
                        React.createElement("option", {value: "Тарногский район"}, "Тарногский Городок"), 
                        React.createElement("option", {value: "Тотемский район"}, "Тотьма")
                      ), 
                      React.createElement("optgroup", {label: "У"}, 
                        React.createElement("option", {value: "Усть-Кубинский район"}, "Устье"), 
                        React.createElement("option", {value: "Устюженский район"}, "Устюжна")
                      ), 
                      React.createElement("optgroup", {label: "Х"}, 
                        React.createElement("option", {value: "Харовский район"}, "Харовск")
                      ), 
                      React.createElement("optgroup", {label: "Ч"}, 
                        React.createElement("option", {value: "Чагодощенский район"}, "Чагода"), 
                        React.createElement("option", {value: "Череповецкий район"}, "Череповец")
                      ), 
                      React.createElement("optgroup", {label: "Ш"}, 
                        React.createElement("option", {value: "Шекснинский район"}, "Шексна"), 
                        React.createElement("option", {value: "Междуреченский район"}, "Шуйское")
                      )
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

//ReactDOM.render(
//    <ADList/>,
//    document.getElementById('ads_panel')
//);

ReactDOM.render(
    React.createElement(SearchPanel, null),
    document.getElementById('search_panel')
);

},{}]},{},[1]);
