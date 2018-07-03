import React from 'react';
import { Button, Message} from 'semantic-ui-react';
import EnglishInfo from './EnglishInfo';
import StudentInfo from "./StudentInfo";
import moment from 'moment';

export default class FormControl extends React.Component {
  constructor(props){
    super(props);
    this.state={
      formId:0,
      clickAble:false,
      clickBackAble:false,
      clickSaveAble:false,
      exists:false,
      studentInfo:{},
      facultyInfo:{},
      programInfo:{},
      levelInfo:{},
      score:'',
      level:'',
      month:'',
      year:'',
      type:'',
      current:{},
      dateTest:moment()
    }

  }

  onNext = () => {
    this.setState({clickAble:true})
  }

  onBack = () => {
    this.setState({clickBackAble:true})
  }

  onSave= () => {
    this.setState({clickSaveAble:true})
  }

  handleNext = () => {
    const { formId } = this.state;
    this.setState({formId:formId+1});
    this.setState({clickAble:false})

  }

  handleBack = () => {
    const { formId } = this.state;
    if(formId>0){
      this.setState({formId:formId-1});
    }
    this.setState({clickBackAble:false})
  }

  handleStudentLoaded = (student,faculty,program,level) => {
    //console.log(student);
    //this.checkExist();
    this.setState({clickBackAble:false})
    this.setState({studentInfo:student,facultyInfo:faculty,programInfo:program,levelInfo:level})
  }

  handleScoreLoaded = (score) => {
    this.setState({score:score})
  }

  handleLevelLoaded = (level) => {
    this.setState({level:level})
  }

  handleEnglishLoaded = (month,year,type) => {
    this.setState({month:month,year:year,type:type})
  }

  handleDateLoaded = (date) => {
    this.setState({dateTest:date})
  }

  checkExist() {
    return new Promise((resolve,reject) => {
      fetch('http://10.10.26.104:30003/english/query',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'Authorization': 'JWT '+this.props.token,
        },
        body:JSON.stringify({
          query:{
            year:this.state.year,
            month:this.state.month,
            type:this.state.type,
            studentId:this.state.studentInfo.STUDENTCODE
          }
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        if(responseJson.result.length >= 1) {
          resolve(true)
        } else {
          resolve(false);
        }
      });
    });
  }


  handleSave = (event) => {
    console.log(event);
    this.checkExist().then((exists) => {
      console.log(exists);
      if(exists){
        this.setState({clickSaveAble:false,clickAble:false})
        this.handleStudentLoaded();
      } else {

        var currentst = this.state.levelInfo.LEVELNAME;
        var st = currentst.split(' ');
        var newst = st[0];
        var currentprogramst = this.state.programInfo.PROGRAMNAMECERTIFY;
        console.log(currentprogramst);
        var programst = currentprogramst.split(' ');
        if (programst[1]) {
          var newprogramst = programst[1].replace(/สาขา|วิชา/g,'');
        } else {
          var newprogramst = this.state.programInfo.PROGRAMNAME;
        }

        fetch('http://10.10.26.104:30003/english/create',{
          method:'PUT',
          headers:{
            'Content-Type':'application/json',
            'Authorization': 'JWT '+this.props.token,
          },
          body:JSON.stringify({
            values:{
              studentId:this.state.studentInfo.STUDENTCODE,
              prefix:this.state.studentInfo.PREFIXNAME,
              name:this.state.studentInfo.STUDENTNAME,
              lastName:this.state.studentInfo.STUDENTSURNAME,
              facultyName:this.state.facultyInfo.FACULTYNAME,
              //programName:this.state.programInfo.PROGRAMNAME,
              programName:newprogramst,
              levelName:this.state.levelInfo.LEVELNAME,
              levelAbb:newst,
              level:this.state.level,
              type:this.state.type,
              dateTest:this.state.dateTest,
              score:this.state.score,
              month:this.state.month,
              year:this.state.year
            }
          })
        })
        .then((response) => response.json())
        .then((responseJson) => {
          if(responseJson.error) {
            this.setState({'message':responseJson.error});
          } else {
            this.setState({'message':'',clickSaveAble:false,clickAble:false});
          }
        });
      }
    });
  }

  render() {

      const { token}  = this.props;
      const { formId,clickAble,clickBackAble,clickSaveAble,month,type,year,dateTest }  = this.state;

      var content = <p></p>
      var contentMessage = <p></p>
      var contentSuccess = <p></p>
      if(formId === 0) {
        content = <EnglishInfo token={token}
                  onFinish={this.onNext}
                  onEnglishLoaded={this.handleEnglishLoaded}
                  onDateLoaded={this.handleDateLoaded}
                  ></EnglishInfo>
      }else{
        if(formId === 1) {
          content = <StudentInfo studentId={this.props.studentId}
                    token={token} month={month} year={year} type={type} dateTest={dateTest}
                    onStudentLoaded={this.handleStudentLoaded}
                    onScoreLoaded={this.handleScoreLoaded}
                    onLevelLoaded={this.handleLevelLoaded}
                    onBack={this.onBack}
                    onSave={this.onSave}
                    >
                  </StudentInfo>

        }
      }


    return (
      <div>
        {content}
        <p>{contentMessage}</p>

        <Button onClick={(event) => this.props.onLogout()} content="ออกจากระบบ"/>
        <Button disabled={!clickBackAble}
          content="Back"
          onClick={this.handleBack}/>
        <Button disabled={!clickAble}
          content="Next"
          onClick={this.handleNext}/>
        <Button disabled={!clickSaveAble}
            content="Save"
            onClick={this.handleSave}/>
      </div>
    );
  }
}
