import React from 'react';
import { Grid } from 'semantic-ui-react';


export default class EnglishSave extends React.Component {
  constructor(props){
    super(props);
    this.state={
      message:''
    }
  }

handleClick = (event) => {
  //var level = this.state.course.split('#')[1];
  //this.setState({'clickAble':false});
  //this.setState({'clickAble':true});
  //this.props.onSave();
  console.log('ok');
  if(this.props.studentInfo) {
    fetch('http://10.10.26.104:30003/english/create',{
      method:'PUT',
      headers:{
        'Content-Type':'application/json',
        'Authorization': 'JWT '+this.props.token,
      },
      body:JSON.stringify({
        values:{
          studentId:this.props.studentInfo1.STUDENTCODE,
          prefix:this.props.studentInfo1.PREFIXNAME,
          name:this.props.studentInfo1.STUDENTNAME+''+this.state.studentInfo1.STUDENTSURNAME,
          facultyName:this.props.facultyInfo.FACULTYNAME,
          programName:this.props.studentInfo1.PROGRAMNAME,
          levelName:this.props.levelInfo.LEVELNAME,
          level:this.props.level,
          type:this.props.type,
          dateTest:this.props.dateTest,
          score:this.props.score,
          month:this.props.month,
          year:this.props.year
        }
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.error) {
        this.setState({'message':responseJson.error});
      } else {
        this.setState({'message':''});
        this.props.onBack();
        this.props.onSave();
        //this.checkExist();
      }
    });
  }
  }

  render() {

    return (
      <div>

            <p>{this.props.studentInfo1}</p>

      </div>

    );
  }


}
