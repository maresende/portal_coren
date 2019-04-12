import React from 'react'
import Axios from 'axios'
import Main from '../template/Main'
import './Home.css'
import $ from 'jquery';

window.$ = $;

const baseurl = 'http://10.1.1.35:9999/'
const initialState = {
	user: {documento: '', birth: '', isGoing: false, ip: ''},
	list: [],
	formato_errado: false
}

window.global_ip = 666;

function parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}



$(function(){
        $(".date").keyup(function(e){
                var currentValue = $(e.target).val();
                var newValue = autocompleteMMDDYYYYDateFormat( currentValue );
                if( newValue != currentValue ){
                        $(e.target).val( newValue );
                }
        });
});
/**
* This function helps to autocomplete the date format MMDDYYY
* Converts M to 0M and MMD to MM0D. Ex. `1/` to `01/`, `01/1/` to `01/01/`
* Adds slash for MM and MMDD Ex. `01` to `01/`, `01/02` to `01/02/`
* Converts YY to YYYY. Ex. `01/01/01` to `01/01/2001`
*
* @param {String} str
* @return {String}
*/
var autocompleteMMDDYYYYDateFormat = function (str) {
        str = str.trim();
        var matches, year,
                looksLike_MM_slash_DD = /^(\d\d\/)?\d\d$/,
                looksLike_MM_slash_D_slash = /^(\d\d\/)?(\d\/)$/,
                looksLike_MM_slash_DD_slash_DD = /^(\d\d\/\d\d\/)(\d\d)$/;

        if( looksLike_MM_slash_DD.test(str) ){
                str += "/";
        }else if( looksLike_MM_slash_D_slash.test(str) ){
                str = str.replace( looksLike_MM_slash_D_slash, "$10$2");
        }else if( looksLike_MM_slash_DD_slash_DD.test(str) ){
                matches = str.match( looksLike_MM_slash_DD_slash_DD );
                year = Number( matches[2] )
        }
        return str;
};



function windowLocation(url){
    var X = setTimeout(function(){
        window.location.replace(url);
        return true;
    },300);

    if( window.location = url ){
        clearTimeout(X);
        return true;
    } else {
        if( window.location.href = url ){
            clearTimeout(X);
            return true;
        }else{
            clearTimeout(X);
            window.location.replace(url);
            return true;
        }
    }
    return false;
};


export default class USerCrud extends React.Component {
  
  state = {...initialState}

  clear() {
	this.setState({user: initialState.user})
  }
	 


  save(event) {
	
        const user = {...this.state.user}
	
			var loc = window.location.href
			var ip = parseQuery(loc.split('?')[1]).id
			console.log(ip)
			user.ip = ip
			this.setState({ user })
			console.log(user)
			var headers = {
				'Content-Type' : 'application/json',
				'Acess-Control-Allow-Origin' : '*'
		
			}
			
			

			Axios.post(baseurl, user , {headers : headers})
				.then(resp => {
					//const list = this.getUpdatedList(resp.data)
					console.log(resp)
					console.log(resp.data)
					//this.setState({ user: initialState.user, list})
					if (resp.data.length === 0) {
						windowLocation("https://www.corenmg.gov.br");
						console.log('Usuario inexistente')
					} else {
						windowLocation("https://www.corenmg.gov.br");
						console.log('Usuario encontrado')
					}
				})
			.catch((error) => {
				console.log(error)
				this.setState({ formato_errado: false} )	
				this.clear()

			})

  }

  getUpdatedList(user) {
	const list = this.state.list.filter(u => u.id !== user.id)
	list.unshift(user)
  }

  

  updateField(event) {
	const user = { ...this.state.user}
        user[event.target.name] = event.target.value
	this.setState({ user })
  }
 
  updateCheckbox(event) {
	const user = {...this.state.user}
	user[event.target.name] = event.target.checked
	this.setState({ user })
  }
 


setButton(event) {
	console.log(this.state.user)
       // this.state.user.ip = result
	console.log(this.state)
	this.save()
}

  renderForm() {
	return (
		<div className="form quadro">
			<div className="row center_div">
				<div className="col-12 col-md-6">
					<div className="form-group">
						<label>Documento</label>
						<input type="text" className="form-control"
							name="documento"
							value={this.state.user.documento}
							onChange={e => this.updateField(e)}
							placeholder="CPF" />			
					</div>
				</div>
			</div>
   			<div className="row center_div">
				<div className="col-12 col-md-6">
					<div className="form-group">
						<label>Nascimento</label>
						<input type="text" className="date form-control" 
							name="birth"
							value={this.state.user.birth}
							onChange={e => this.updateField(e)}
							placeholder="dd/mm/aaaa" />			
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-12 d-flex justify-content-end" onClick={e => this.save(e)}>
					<button className="btn btn-primary">
						Conectar
					</button>
					<button className="btn btn-secondary ml-2" onClick={e => this.clear(e)}>
						Limpar		
					</button>
				</div>
			</div>	
		</div>
	)

   }


   render() {
	
	if(this.state.formato_errado){
		return (
			<Main>
				{this.renderForm2()}
			</Main>
		)
	
	} else {
		return (
			<Main>
				{this.renderForm()}
			</Main>
		)
   	}
   }

}
