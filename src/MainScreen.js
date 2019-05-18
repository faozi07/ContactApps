import React from 'react';
import { View, FlatList, ProgressBarAndroid } from 'react-native';
const dismissKeyboard = require('dismissKeyboard');

class MainScreen extends React.Component {

  constructor (props) {
    super(props);
  }

  componentWillMount () {
    dismissKeyboard();
  }

  render () {
    return (
      <View style={{ flex:1, backgroundColor:'#fff' }}>
        <FlatList
          contentContainerStyle={{ padding:10 }}
          keyboardShouldPersistTaps='always'
          keyboardDismissMode='none'
          data={this.state.listFilterTransaction}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={{ margin:5, justifyContent:'center', alignSelf:'center', alignItems:'center' }}>
            </View>
          )}
        />
      </View>
    );
  }
}


export default MainScreen;
