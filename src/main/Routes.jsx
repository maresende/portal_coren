import React from 'react'
import { Switch, Route, Redirect} from 'react-router'


import Home from '../components/home/Home'
import UserCrud from '../components/user/UserCrud'

export default props =>
	<Switch>
		<Route exact path='/guest/s' component={Home} />
		<Route path='/users' components={UserCrud} />
		//<Redirect from='*' to='/' />
	</Switch>
