import React from 'react';
import { View, FlatList, ProgressBarAndroid, Text, Image, TouchableOpacity, Dimensions, RefreshControl, Modal, TextInput, ActivityIndicator,
    ToastAndroid } from 'react-native';
import axios from 'axios';

const dismissKeyboard = require('dismissKeyboard');
const baseURL = 'https://simple-contact-crud.herokuapp.com/';
const colorRed = '#ee5253';
const colorGreen = '#008139';
const colorWhite = '#ffffff';
const colorGray = '#bbbbbb';

class MainScreen extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      loading: false,
      loadingAction: false,
      loadingContactInfo: false,
      listContact: [],
      errorMessage: '',
      refresh: false,
      showModal: false,
      showModalInfo: false,
      firstName: '',
      lastName: '',
      age: '',
      photo: '',
      fileName: '',
      imgType: '',
      isAddImage: false,
      addEdit: 'Add',
      id: ''
    };
  }

  componentWillMount () {
    dismissKeyboard();
    this.getDataContact();
  }

  getDataContact () {
    this.setState({ loading:true, errorMessage:'' });
    axios.get(`${baseURL}contact`)
      .then((response) => {
        console.log(response.data)
        this.setState({ listContact:response.data.data, loading:false });
      })
      .catch((err) => {
        console.log(err.response)
        if (err.response) {
          ToastAndroid.show(`Failed get data Contact ${err.response.data.message}`, ToastAndroid.LONG);
          this.setState({ loading:false });
        }
        else {
          ToastAndroid.show('Something wrong get data Contact', ToastAndroid.LONG);
          this.setState({ loading:false });
        }
      });
  }

  getDataContactById (id) {
    this.setState({ loadingContactInfo:true, showModalInfo:true });
    axios.get(`${baseURL}contact/${id}`)
      .then((response) => {
        console.log(response.data)
        let data = response.data.data;
        this.setState({ firstName:data.firstName, lastName:data.lastName, age:data.age.toString(), photo:data.photo,
          loadingContactInfo:false });
      })
      .catch((err) => {
        console.log(err.response)
        if (err.response) {
          ToastAndroid.show(`Failed get data Contact by Id ${err.response.data.message}`, ToastAndroid.LONG);
          this.setState({ firstName:'', lastName:'', age:'', photo:'', loadingContactInfo:false });
        }
        else {
          ToastAndroid.show('Something wrong get data Contact', ToastAndroid.LONG);
          this.setState({ firstName:'', lastName:'', age:'', photo:'', loadingContactInfo:false });
        }
      });
  }

  postContact () {
    dismissKeyboard();
    this.setState({ loading:false, errorMessage:'' });
    axios.post(`${baseURL}contact`, {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      age: this.state.age,
      photo: this.state.photo
    })
      .then((response) => {
        console.log(response.data)
        this.setState({ showModal:false, loadingAction:false });
        this.getDataContact();
        ToastAndroid.show('Success Add Contact', ToastAndroid.LONG);
      })
      .catch((err) => {
        console.log(err.response)
        if (err.response) {
          ToastAndroid.show(`Failed add data Contact ${err.response.data.message}`, ToastAndroid.LONG);
          this.setState({ showModal:false, loadingAction:false });
        }
        else {
          ToastAndroid.show('Something wrong get post data Contact', ToastAndroid.LONG);
          this.setState({ showModal:false, loadingAction:false });
        }
      });
  }

  editContact () {
    dismissKeyboard();
    this.setState({ loading:false, errorMessage:'' });
    axios.put(`${baseURL}contact/${this.state.id}`,{
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      age: this.state.age,
      photo: this.state.photo
    })
      .then((response) => {
        console.log(response.data)
        this.setState({ showModal:false, loadingAction:false });
        this.getDataContact();
        ToastAndroid.show('Success Edit Contact', ToastAndroid.LONG);
      })
      .catch((err) => {
        console.log(err.response)
        if (err.response) {
          ToastAndroid.show(`Failed edit data Contact ${err.response.data.message}`, ToastAndroid.LONG);
          this.setState({ showModal:false, loadingAction:false });
        }
        else {
          ToastAndroid.show('Something wrong edit data Contact', ToastAndroid.LONG);
          this.setState({ showModal:false, loadingAction:false });
        }
      });
  }

  deleteContact (id) {
    console.log(id)
    this.setState({ loading:true, errorMessage:'' });
    axios.delete(`${baseURL}contact/${id}`)
      .then((response) => {
        console.log(response.data)
        this.getDataContact();
        ToastAndroid.show('Success Delete Contact', ToastAndroid.LONG);
      })
      .catch((err) => {
        console.log(err.response)
        if (err.response) {
          ToastAndroid.show(`Failed delete data Contact ${err.response.data.message}`, ToastAndroid.LONG);
          this.setState({ loading:false });
        }
        else {
          ToastAndroid.show('Something wrong delete data Contact', ToastAndroid.LONG);
          this.setState({ loading:false });
        }
      });
  }

  renderEmptyList () {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <Text>Tidak ada data yang tersedia</Text>
      </View>
    );
  }

  renderAvatar (item) {
    let isNoPhoto = item.photo.indexOf('https') != -1 || item.photo.indexOf('http') != -1  ? { uri:item.photo }:require('./image/default_avatar.png');
    return (
      <Image resizeMode='cover'
        source={isNoPhoto}
        onError={() => {
          
        }}
        style={{ width:50, height:50, borderRadius:25, borderWidth:0.5, borderColor: colorGray,marginRight:10 }}
      />
    );
  }

  renderLoadData () {
    if (this.state.loading) {
      return (
        <View style={{ flex:1 }}>
          <ProgressBarAndroid
            style={{ marginTop:-6 }}
            indeterminate={true}
            styleAttr='Horizontal'
            progress={1}
            color={colorGreen}
          />
          <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
            <Text>Memuat data ...</Text>
          </View>
        </View>
      );
    }
    else {
      return (
        <View>
          <FlatList
            contentContainerStyle={{ flex:1 }}
            keyboardShouldPersistTaps='always'
            keyboardDismissMode='none'
            ListEmptyComponent={this.renderEmptyList()}
            refreshControl={<RefreshControl
              refreshing={this.state.refresh}
              onRefresh={() => {
                this.setState({ refresh:false });
                this.getDataContact();
              }}/>
            }
            data={this.state.listContact}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => {
                this.getDataContactById(item.id);
              }}>
                <View>
                    <View style={{ flexDirection:'row', margin:5, alignItems:'center' }}>
                    {this.renderAvatar(item)}
                    <View>
                    <Text style={{ fontSize:12 }}>Name : {item.firstName} {item.lastName}</Text>
                    <Text style={{ fontSize:10 }}>Age : {item.age}</Text>
                    </View>
                    </View>
                    <View style={{ flexDirection:'row', justifyContent:'flex-end' }}>
                    <TouchableOpacity onPress={() => {
                        this.setState({ showModal:true, firstName: item.firstName, lastName: item.lastName, age: item.age.toString(),
                        isAddImage: true, photo:item.photo, addEdit:'Edit', id: item.id });
                    }}>
                        <View style={{ width:70, height:30, justifyContent:'center', alignItems:'center' }}>
                            <Text style={{ color:colorGreen }}>Edit</Text>
                        </View>
                        </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this.deleteContact(item.id)
                    }}>
                        <View style={{ width:70, height:30, justifyContent:'center', alignItems:'center' }}>
                            <Text style={{ color:colorRed }}>Delete</Text>
                        </View>
                    </TouchableOpacity>
                    </View>
                    <View style={{ height:0.7, backgroundColor:colorGray }} />
                </View>
              </TouchableOpacity>
            )}
          />
          {this.renderModalAddContact()}
          {this.renderModalContactInfo()}
        </View>
      );
    }
  }

  renderBtnModal () {
    if (this.state.loadingAction) {
      return (
        <ActivityIndicator size='large' />
      );
    }
    else {
      return (
        <View style={{ flexDirection:'row', justifyContent:'space-between', marginTop:40 }}>
          <TouchableOpacity onPress={() => {
            this.setState({ showModal:false });
          }}>
            <View style={{ width: Dimensions.get('window').width*(42/100), backgroundColor:colorRed, padding:10, borderRadius:5, alignItems:'center' }}>
              <Text style={{ color:colorWhite }}>Cancel</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            this.setState({ loadingAction:true });
            if (this.state.addEdit === 'Add') {
              this.postContact();
            }
            else {
              this.editContact();
            }
          }}>
            <View style={{ width: Dimensions.get('window').width*(42/100), backgroundColor:colorGreen, padding:10, borderRadius:5, alignItems:'center' }}>
              <Text style={{ color:colorWhite }}>{this.state.addEdit === 'Add' ? 'Save':'Edit' }</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  }

  renderModalAddContact () {
    return (
      <Modal
        presentationStyle='overFullScreen'
        animationType="fade"
        transparent={false}
        visible={this.state.showModal}
        onRequestClose={() => {
          this.setState({ showModal:false });
        }}>
        <View style={{ flex:1, padding:20, justifyContent:'center' }}>
          <Text style={{ textAlign:'center', fontSize:18, fontWeight:'500', marginBottom:80 }}>{this.state.addEdit} Contact</Text>
          <TextInput
            ref={inFirstName => this.inFirstName = inFirstName}
            style={{ borderBottomWidth:0.7, borderColor:colorGray, padding:0, marginBottom:10 }}
            placeholder='First Name'
            value={this.state.firstName}
            returnKeyType='next'
            onChangeText={(firstName) => this.setState({ firstName })}
            onSubmitEditing={() => {
              this.inLastName.focus();
            }}
            blurOnSubmit={false}
          />
          <TextInput
            ref={inLastName => this.inLastName = inLastName}
            style={{ borderBottomWidth:0.7, borderColor:colorGray, padding:0, marginBottom:10 }}
            placeholder='Last Name'
            value={this.state.lastName}
            returnKeyType='next'
            onChangeText={(lastName) => this.setState({ lastName })}
            onSubmitEditing={() => {
              this.inAge.focus();
            }}
            blurOnSubmit={false}
          />
          <TextInput
            ref={inAge => this.inAge = inAge}
            style={{ borderBottomWidth:0.7, borderColor:colorGray, padding:0, marginBottom:10 }}
            placeholder='Age'
            value={this.state.age}
            returnKeyType='next'
            onChangeText={(age) => this.setState({ age })}
            onSubmitEditing={() => {
              this.inPhoto.focus();
            }}
            blurOnSubmit={false}
          />
          <TextInput
            ref={inPhoto => this.inPhoto = inPhoto}
            style={{ borderBottomWidth:0.7, borderColor:colorGray, padding:0, marginBottom:10 }}
            placeholder='Link Photo'
            value={this.state.photo}
            returnKeyType='done'
            onChangeText={(photo) => this.setState({ photo })}
          />
          {this.renderBtnModal()}
        </View>
      </Modal>
    );
  }

  renderModalItemContactInfo () {
    if (this.state.loadingContactInfo) {
      return (
        <ActivityIndicator size='large' />
      );
    }
    else {
      let isNoPhoto = this.state.photo.indexOf('https') != -1 || this.state.photo.indexOf('http') != -1 ?
        { uri:this.state.photo }:require('./image/default_avatar.png');
      return (
        <View style={{ alignItems:'center' }}>
          <Image resizeMode='cover'
            source={isNoPhoto}
            style={{ width:100, height:100, borderRadius:50, borderWidth:0.7, borderColor:colorGray, marginBottom:20 }}
          />
          <Text>First Name : {this.state.firstName}</Text>
          <Text>Last Name : {this.state.lastName}</Text>
          <Text>Age : {this.state.age}</Text>
          <TouchableOpacity onPress={() => {
            this.setState({ showModalInfo:false });
          }}>
            <View style={{ width:100, backgroundColor:colorGreen, padding:5, borderRadius:3, alignItems:'center', marginTop:70 }}>
              <Text style={{ color:colorWhite }}>Close</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  }

  renderModalContactInfo () {
    return (
      <Modal
        presentationStyle='overFullScreen'
        animationType="fade"
        transparent={false}
        visible={this.state.showModalInfo}
        onRequestClose={() => {
          this.setState({ showModalInfo:false });
        }}>
        <View style={{ flex:1, padding:20, justifyContent:'center' }}>
          {this.renderModalItemContactInfo()}
        </View>
      </Modal>
    );
  }

  render () {
    return (
      <View style={{ flex:1, backgroundColor:colorWhite }}>
        <View style={{ width:'100%', height:'100%', position:'absolute' }}>
          {this.renderLoadData()}
        </View>
        {
          !this.state.loading && (
            <View style={{ top:Dimensions.get('window').height*(85/100), alignSelf:'flex-end', padding:10 }}>
              <TouchableOpacity onPress={() => {
                this.setState({ showModal:true, firstName: '', lastName: '', age: '', isAddImage: false, photo:'', addEdit:'Add', id: '' });
              }}>
                <View style={{ width:50, height:50, borderRadius:25, elevation:5, padding:10, backgroundColor:colorGreen, justifyContent:'center', alignItems:'center', }}>
                  <Text style={{ fontSize:35, color:colorWhite }}>+</Text>
                </View>
              </TouchableOpacity>
            </View>
          )
        }
      </View>
    );
  }
}


export default MainScreen;
