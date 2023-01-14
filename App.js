import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Auth from './screens/Auth';
import Home from './screens/Home';
import Register from './screens/Register';
import Scanner from './screens/Scanner';
import Riwayat from './screens/Riwayat';
import Profil from './screens/Profil';
import ChangePassword from './screens/ChangePassword';
import UserData from './screens/UserData';
import ForgotPassword from './screens/ForgotPassword';
import LoginProvider from './api/LoginProvider';

export default function App() {
  const Stack = createStackNavigator();
  return (
    <LoginProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Auth' screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="Auth"
            component={Auth}
          />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Scanner" component={Scanner} />
          <Stack.Screen name="Riwayat" component={Riwayat} options={{ headerTitle: true }} />
          <Stack.Screen name="Profil" component={Profil} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} />
          <Stack.Screen name="UserData" component={UserData} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </Stack.Navigator>
      </NavigationContainer>
    </LoginProvider>
  );
}