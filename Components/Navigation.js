import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';
import Home from './Home'
import AuthLoadingScreen from './AuthLoadingScreen';
import AuthScreen from './AuthScreen';
import Login from './Login';
import Signup from './Signup';
import * as signupFlow from './SignUpFlow';



const SignupFlow = createStackNavigator({
  SocialMedia: {
    screen: signupFlow.SocialMedia,
    navigationOptions: () => ({
      headerShown:false
    })
  },
  InputName: {
    screen: signupFlow.InputName,
    navigationOptions: () => ({
      headerShown:false
    })
  },
  CreateContact: {
    screen: signupFlow.CreateContact,
    navigationOptions: () => ({
      headerShown:false
    })
  },
},{
  initialRouteName: 'InputName',
  // mode: 'modal',
});


const AppNav = createSwitchNavigator({
   AuthLoading: AuthLoadingScreen,

    Home: Home,
    Signup: Signup,
    // Signup: AuthScreen, //Auth Login as Neo
    SignupFlow:SignupFlow,
    Login:Login,
  },
  {
    initialRouteName: 'AuthLoading',
  })

const AppContainer = createAppContainer(AppNav);

export default AppContainer
