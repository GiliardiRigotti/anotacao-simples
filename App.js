import { StatusBar } from 'expo-status-bar';
import 
  React,
{ 
  useState,
} from 'react';
import { StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Ionicons, MaterialIcons} from '@expo/vector-icons'
import { Keyboard } from 'react-native';
import { useEffect } from 'react';


export default function App() {

  const[task, setTask] = useState([])
  const[newTask, setNewTask] = useState('')

  async function addTask(){

    if(newTask===""){
      return;
    }

    const search = task.filter(task => task === newTask)

    if(search.length != 0){
      Alert.alert("Atenção!","Nome da tarefa repetido")
      return
    }

    setTask([...task, newTask])
    setNewTask("")

    Keyboard.dismiss()
  }

  useEffect(()=>{
    async function loadData(){
      const task = await AsyncStorage.getItem("task")

      if(task){
        setTask(JSON.parse(task))
      }
    }
    loadData();
  },[])

  useEffect(()=>{
    async function salveData(){
      AsyncStorage.setItem("task", JSON.stringify(task) )
    }
    salveData()
  },[task])

  async function removeTask(item){
    Alert.alert(
      "Deletar task",
      "Tem certeza que deseja remover esta anotação?",
      [
        {
          text:"Cancel",
          onPress: ()=>{
            return
          },
          style:'cancel'
        },
        {
          text:"Ok",
          onPress:()=>setTask(task.filter(task=>task!=item))
        }
      ],
      {cancelable: false}
    )
    
  }


  return (
    <>
    <KeyboardAvoidingView
    keyboardVerticalOffset={0}
    behavior="padding"
    style={{flex:1}}
    enabled={Platform.OS==='ios'}
    >
      <View style={styles.container}>
        <View style={styles.body}>
          <FlatList
          style={styles.flatlist}
          data={task}
          keyExtractor={item=> item.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({item})=>(
            <View style={styles.containerView}>
              <Text style={styles.text} >{item}</Text>
              <TouchableOpacity
              onPress={()=>removeTask(item)}
              >
                <MaterialIcons
                  name="delete-forever"
                  size={25}
                  color="#F64C75"
                />
              </TouchableOpacity>
            </View>
          )}
          />
        </View>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholderTextColor="#999"
            autoCorrect={true}
            placeholder="Adicione uma tarefa"
            maxLength={25}
            onChangeText={text => setNewTask(text)}
          />
          <TouchableOpacity 
          style={styles.button}
          onPress={()=>addTask()}
          >
            <Ionicons name="ios-add" size={25} color="#FFF"/>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#FFF',
    paddingHorizontal:20,
    paddingVertical:20,
    marginTop:20
  },
  body:{
    flex:1
  },
  form:{
    padding:0,
    height:60,
    justifyContent:'center',
    alignSelf:'stretch',
    flexDirection:'row',
    paddingTop:13,
    borderBottomWidth:1,
    borderColor:'#eee',
  },
  input:{
    flex:1,
    height:40,
    backgroundColor:'#eee',
    borderRadius:4,
    paddingVertical:5,
    paddingHorizontal:10,
    borderWidth: 1,
    borderColor:'#eee'
  },
  button:{
    height:40,
    width:40,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#1C6CCE',
    borderRadius: 4,
    marginLeft:10
  },
  flatlist:{
    flex:1,
    marginTop:5,
  },
  containerView:{
    marginBottom:15,
    padding:15,
    borderRadius:4,
    backgroundColor:'#eee',
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'space-between',
    borderWidth:1,
    borderColor:'#EEE',
  },
  text:{
    fontSize:14,
    color:'#333',
    fontWeight:'bold',
    marginTop:4,
    textAlign:'center'
  }
})