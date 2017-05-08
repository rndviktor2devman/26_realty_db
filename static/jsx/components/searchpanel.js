import React, {Component} from 'react';

class SearchPanel extends Component{
    constructor(props, context){
        super(props, context);

        this.state = {
            main_cities: [],
            letters: [],
            min_price: null,
            max_price: null,
            settlement: '',
            new_building: false
        }
    }

    componentDidMount(){
        var sendurl = '/get_district_list';
        $.ajax({
          url: sendurl,
          dataType: 'json',
          cache: false,
          success: function(data) {
              if(data){
                  var default_settlement = (data.main_cities_map && data.main_cities_map.length > 0)?
                      data.main_cities_map[0].district
                      : (data.letters.length > 0? data.letters[0].array[0].district: "");
                this.setState({
                    main_cities: data.main_cities_map,
                    letters: data.letters,
                    settlement: default_settlement
                });
              }
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
        this.hanldeSubmitFilter();
    }

    hanldeSubmitFilter() {
        var filter = {
            'min_price': this.state.min_price? this.state.min_price : 0,
            'max_price': this.state.max_price? this.state.max_price : 0,
            'settlement': this.state.settlement,
            'new_building': this.state.new_building
        };
        console.log(filter);
        this.props.callbackFilterChange(filter);
    }

    validateNumber(text) {
        var newText = '';
        var numbers = '0123456789';
        for (var i=0; i < text.length; i++) {
            if(numbers.indexOf(text[i]) > -1 ) {
                 newText = newText + text[i];
            }
        }
        return newText;
    }

    onChangedMin(event){
        var text = event.target.value;
        var newText = this.validateNumber(text);
        this.setState({min_price: newText});
    }

    onChangedMax(event) {
        var text = event.target.value;
        var newText = this.validateNumber(text);
        this.setState({max_price: newText});
    }

    handleNewBuilding(event) {
        const target = event.target;
        const value =  target.checked;
        this.setState({ new_building: value});
    }

    handleCitySelection(event) {
        var value = event.target.value;
        this.setState({settlement: value});
    }

    render() {
        var main_cities = this.state.main_cities;
        var letters = this.state.letters;
        return(<div className="panel-body">
                  <p>город / районный центр</p>
                  <div className="form-group">
                    <select className="form-control" onChange={this.handleCitySelection.bind(this)} value={this.state.settlement}>
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
                          <input type="checkbox" onChange={this.handleNewBuilding.bind(this)} checked={this.state.new_building}/>
                        только новостройки
                      </label>
                    </div>
                  </div>
                  <p><strong>Цена</strong></p>
                  <div className="form-group ">
                    <div className="input-group">
                      <span className="input-group-addon">от</span>
                        <input type="text" value={this.state.min_price} onChange={this.onChangedMin.bind(this)} className="form-control js-price-format" placeholder="любая" />
                      <span className="input-group-addon">р.</span>
                    </div>
                  </div>
                  <div className="form-group ">
                    <div className="input-group">
                      <span className="input-group-addon">до</span>
                        <input type="text" value={this.state.max_price} onChange={this.onChangedMax.bind(this)} className="form-control js-price-format" placeholder="любая" />
                      <span className="input-group-addon">р.</span>
                    </div>
                  </div>
                  <button type="button" className="btn btn-success" onClick={this.hanldeSubmitFilter.bind(this)}>Показать</button>
                </div>
        )
    }
};

export default SearchPanel;
