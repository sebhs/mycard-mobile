import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import Home from './Home'
import AuthLoadingScreen from './AuthLoadingScreen';
import AuthScreen from './AuthScreen';
import Login from './Login';



const AppNav = createSwitchNavigator({
    AuthLoading: AuthLoadingScreen,
    App: Home,
    Auth: Login,
  },
  {
    initialRouteName: 'AuthLoading',
  })

const AppContainer = createAppContainer(AppNav);

export default AppContainer
