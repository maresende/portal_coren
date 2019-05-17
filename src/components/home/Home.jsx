import React from 'react'
import Axios from 'axios'
import Main from '../template/Main'
import './Home.css'
import $ from 'jquery';

import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
window.$ = $;

const baseurl = 'https://unifi.corenmg.gov.br:9999/'
const baseurl2 = 'https://unifi.corenmg.gov.br:9999/ldap/'
const initialState = {
	user: {documento: '', birth: '', isGoing: false, ip: '', password: ''},
	list: [],
	formato_errado: false,
	funcionario: false,
	funcionario_errado: false,
	login_errado: false,
	cpfinvalido: false
}

window.global_ip = 666;
function validarCPF(cpf) {	
	var i, add, rev;
	cpf = cpf.replace(/[^\d]+/g,'');	
	if(cpf === '') return false;	
	if (cpf.length != 11 || 
		cpf == "00000000000" || 
		cpf == "11111111111" || 
		cpf == "22222222222" || 
		cpf == "33333333333" || 
		cpf == "44444444444" || 
		cpf == "55555555555" || 
		cpf == "66666666666" || 
		cpf == "77777777777" || 
		cpf == "88888888888" || 
		cpf == "99999999999")
			return false;		
																		// Valida 1o digito	
	add = 0;	
	for (i=0; i < 9; i ++)		
		add += parseInt(cpf.charAt(i)) * (10 - i);	
		rev = 11 - (add % 11);	
		if (rev == 10 || rev == 11)		
			rev = 0;	
		if (rev != parseInt(cpf.charAt(9)))		
			return false;		
		add = 0;	
		for (i = 0; i < 10; i ++)		
			add += parseInt(cpf.charAt(i)) * (11 - i);	
		rev = 11 - (add % 11);	
		if (rev == 10 || rev == 11)	
			rev = 0;	
		if (rev != parseInt(cpf.charAt(10)))
			return false;		
			return true;   
	}

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
		if(e.target.name === 'password'){
			return;
		}
                var currentValue = $(e.target).val();
                var newValue = autocompleteMMDDYYYYDateFormat( currentValue );
                if( newValue !== currentValue ){
                        $(e.target).val( newValue );
                }
        });
});
/**
:* This function helps to autocomplete the date format MMDDYYY
* Converts M to 0M and MMD to MM0D. Ex. `1/` to `01/`, `01/1/` to `01/01/`
* Adds slash for MM and MMDD Ex. `01` to `01/`, `01/02` to `01/02/`
* Converts YY to YYYY. Ex. `01/01/01` to `01/01/2001`
*
* @param {String} str
* @return {String}
*/
var autocompleteMMDDYYYYDateFormat = function (str) {
        str = str.trim();
        var     looksLike_MM_slash_DD = /^(\d\d\/)?\d\d$/,
                looksLike_MM_slash_D_slash = /^(\d\d\/)?(\d\/)$/,
                looksLike_MM_slash_DD_slash_DD = /^(\d\d\/\d\d\/)(\d\d)$/;

        if( looksLike_MM_slash_DD.test(str) ){
		if(str > 31){
			str = 31;	
		}
                str += "/";
	
        }else if( looksLike_MM_slash_D_slash.test(str) ){
                str = str.replace( looksLike_MM_slash_D_slash, "$10$2");
        }else if( looksLike_MM_slash_DD_slash_DD.test(str) ){
        }
        return str;
};


export default class USerCrud extends React.Component {
  
  state = {...initialState}


  clear(event) {
	console.log(event)
	this.setState({ user: initialState.user})
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
	               var valido = validarCPF(this.state.user.documento);

	
			if(valido){
				Axios.post(baseurl, user , {headers : headers})
					.then(resp => {
						//const list = this.getUpdatedList(resp.data)
						console.log(resp)
						console.log(resp.data)
						//this.setState({ user: initialState.user, list})
						if (resp.data.length === 0) {
							document.location.assign("https://www.corenmg.gov.br");
							console.log('Usuario inexistente')
						} else {
							document.location.assign("https://www.corenmg.gov.br");
							console.log('Usuario encontrado')
						}
					})
				.catch( (error) => 
					{
						if(error.response){
							(error.response.status === 400) ? this.setState({formato_errado: true }) : this.clear()
						}
					})
			}
			else{
				this.setState({cpfinvalido: true})
			}
  }

  save2(event) {
	
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
			

			Axios.post(baseurl2, user , {headers : headers})
				.then(resp => {
					//const list = this.getUpdatedList(resp.data)
					console.log(resp)
					console.log(resp.data)
					//this.setState({ user: initialState.user, list})
					if (resp.data.length === 0) {
						document.location.assign("https://www.corenmg.gov.br");
						console.log('Usuario inexistente')
					} else {
						document.location.assign("https://www.corenmg.gov.br");
						console.log('Usuario encontrado')
					}
				})
			.catch( (error) => {

				if(error.response!== undefined) {
					if(error.response.status === 408){
						console.log('sei que nao foi autenticado')
						this.setState({funcionario_errado: true})
					}
					else if(error.response.status === 410){
						this.setState({login_errado: true})
					}
				}
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
	console.log(this.state)
  }
 

  updateCheckbox(event) {
	const user = {...this.state.user}
	user[event.target.name] = event.target.checked
	this.setState({ user })
  }
 


setButton(event) {
	console.log(this.state.user)
        //this.state.user.ip = result
	console.log(this.state)
	this.save()
}

setFuncionario(event) {
	this.setState({funcionario: true});
	this.clear();
}

setInscrito(event) {
	this.setState({funcionario: false});
	this.clear();
}

voltainicio(event){
	this.setState({formato_errado: false})
}

voltainiciofuncionario(event){
	this.setState({funcionario_errado:false})
}

voltainiciologin(event){
	this.setState({login_errado: false})
}

voltacpfinvalido(event){
	this.setState({cpfinvalido: false})
}

  renderForm() {
	return (
		<div className="form quadro">
			<div className="row superior-nav">
				<ButtonGroup toggle size="lg">
					 <Button onClick={e => this.setInscrito(e)}>
					      Inscritos
					</Button>
    					<Button onClick={e => this.setFuncionario(e)}>
    					      Funcionários
   					 </Button>
				</ButtonGroup>
			</div>	
			<div className="row center_div">
				<div className="ploc">
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
				<div className="ploc">
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
				<div className="col-12 d-flex justify-content-end">
					<button className="btn btn-primary" onClick={e => this.save(e)}>
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
	

  renderForm2() {
	return (
		<div className="form quadro">
			<div className="row superior-nav">
				<ButtonGroup toggle size="lg">
					 <Button onClick={e => this.setInscrito(e)}>
					      Inscritos
					</Button>
    					<Button onClick={e => this.setFuncionario(e)}>
    					      Funcionários
   					 </Button>
				</ButtonGroup>
			</div>	
			<div className="row center_div">
				<div className="ploc">
					<div className="form-group">
						<label>Login</label>
						<input type="text" className="form-control"
							name="documento"
							value={this.state.user.documento}
							onChange={e => this.updateField(e)}
							placeholder="Login corenmg" />			
					</div>
				</div>
			</div>
   			<div className="row center_div">
				<div className="ploc">
					<div className="form-group">
						<label>Senha</label>
						<input type="password" className="form-control" 
							name="password"
							value={this.state.user.password}
							onChange={e => this.updateField(e)}
							placeholder="senha corenmg" />			
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-12 d-flex justify-content-end">
					<button className="btn btn-primary" onClick={e => this.save2(e)}>
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
   componentDidMount() {
	console.log('rodou')	
   }

   render() {
	console.log('state is')
	console.log(this.state)
	
	if(!this.state.funcionario){
		if(this.state.cpfinvalido){
				return (
					<Main>
						<p>  
							<font color="red">
								O cpf digitado é inválido!
							</font>
						</p>
						<div className="row">
							<div className="col-12 d-flex justify-content-end" onClick={e => this.voltacpfinvalido(e)}>
								<button className="btn btn-primary">
									Voltar
								</button>
							</div>
						</div>	
						</Main>
				)

		}
		else if(this.state.formato_errado){
			return (
				<Main>
					<p>  
					<font color="red">
						Você não é inscrito e já excedeu suas 2 horas de tempo de acesso!
					</font>
				</p>
				<div className="row">
					<div className="col-12 d-flex justify-content-end" onClick={e => this.voltainicio(e)}>
						<button className="btn btn-primary">
							Voltar
						</button>
				</div>
			</div>	

			</Main>
		)}
		else{
			return (
					<Main>
						{this.renderForm()}
					</Main>
				)
		}
	  	
	
	} else {
		if(!this.state.login_errado){

			if(!this.state.funcionario_errado){
				return (
					<Main>
						{this.renderForm2()}
					</Main>
				)
			}
			else{
				return(
				<Main>
					<p>  
						<font color="red">
							Senha incorreta
						</font>
					</p>
					<div className="row">
						<div className="col-12 d-flex justify-content-end" onClick={e => this.voltainiciofuncionario(e)}>
							<button className="btn btn-primary">
								Voltar
							</button>
						</div>
					</div>	

				</Main>
				)
			}
		}
		else{
				return(
				<Main>
					<p>  
						<font color="red">
							Login incorreto
						</font>
					</p>
					<div className="row">
						<div className="col-12 d-flex justify-content-end" onClick={e => this.voltainiciologin(e)}>
							<button className="btn btn-primary">
								Voltar
							</button>
						</div>
					</div>	

				</Main>
				)

		}
		}
   	}

}
