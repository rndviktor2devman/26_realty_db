import React, {Component} from 'react';

class ADList extends Component{
    render() {
        var ads = this.props.ads;
        return (<div>
                { (!ads || ads.length == 0)? <div>Жилья не найдено, измените условия поиска или обновите базу</div>:
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
};


export default ADList;
