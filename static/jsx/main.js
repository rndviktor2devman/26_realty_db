import React, {Component} from 'react';
import ADList from './components/adlist';
import SearchPanel from './components/searchpanel';
import DbSetupPanel from './components/dbsetupanel';
import Pager from 'react-pager';


class MainSitePanel extends Component{
    constructor(props, context){
        super(props, context);

        this.state = {
            ads: [],
            total: 0,
            current: 0,
            visiblePages: 3,
            filter: {}
        }
    }

    pushFilterState(filter) {
        this.showFilteredPage(1, filter);
    }

    handlePageChanged(newPage){
        newPage += 1;
        var filter = this.state.filter;
        this.showFilteredPage(newPage, filter);
    }

    showFilteredPage(pageNumber, newFilter){
        var sendurl = '/get_ads';
        var request_data = {
            'filter': newFilter,
            'page': pageNumber
        };
        $.ajax({
          url: sendurl,
          type: 'POST',
          data: JSON.stringify(request_data),
          contentType: 'application/json;charset=UTF-8',
          success: function(data) {
              this.setState({ads: data.ads, total: data.pages_count, current: data.current_page, filter: newFilter});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
    }

    render() {
        var pagesCount = this.state.total;
        return(<div>
            <div className="row">
                <div className="col-md-9">
                  <div className="row">
                    <div className="col-sm-4">
                      <form role="form" className="panel panel-default">
                        <SearchPanel callbackFilterChange={this.pushFilterState.bind(this)}/>
                      </form>
                      <form role="form" className="panel panel-default">
                        <DbSetupPanel/>
                      </form>
                    </div>
                    <div className="col-sm-8">
                      <div className="panel panel-default">
                        <ADList ads={this.state.ads}/>
                        {(pagesCount && pagesCount > 1)?
                            <Pager total={this.state.total}
				                   current={this.state.current}
                                   visiblePages={this.state.visiblePages}
                                   titles={{ first: '|<', last: '>|' }}
                                   className="pagination-sm pull-right"
                                   onPageChanged={this.handlePageChanged.bind(this)}/>
                            : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
        </div>);
    }
}

ReactDOM.render(
    <MainSitePanel/>,
    document.getElementById('main_site_panel')
);