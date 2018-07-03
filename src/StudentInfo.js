import React from 'react';
import { Divider,Form,Input,Select,Segment,Header,Step,Grid } from 'semantic-ui-react';
//import DatePicker from 'react-datepicker';
import moment from 'moment';

export default class StudentInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      studId:'',
      score:'',
      level:{value:'',isAssign:false},
      studentInfo:{},
      facultyInfo:{},
      programInfo:{},
      levelInfo:{},
    }
  }

  componentDidMount() {
    this.props.onBack();
  }
  getStudentCheck(sid,cb) {
    console.log('getStudentCheck',sid);
  fetch('http://www.db.grad.nu.ac.th/apps/ws/get_student_info/'+sid, {
    method: 'post',
    headers: {
      'Authorization': 'JWT '+this.props.token,
    }
  })
  .then((response) => response.json())
  .then((responseJson) => {
    //console.log(responseJson);
    if(responseJson.result.length === 1) {
      var student = responseJson.result[0];
    //  console.log(student.STUDENTNAME);
        cb(student);
        //this.setState({'studentInfo1':responseJson.result[0]});
    }else{
      this.setState({ studentInfo1:{},facultyInfo:{},programInfo:{},levelInfo:{} })
    }
  })
  .catch((error) => {
    console.error(error);
  });
}

getProgram(programId,cb) {
   return fetch('http://www.db.grad.nu.ac.th/apps/ws/get_program/'+programId,{  // url +'/' +this.props.staffid
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization' : 'JWT '+this.props.token
     }
   })
   .then(response => response.json())
   .then(responseJson => {
     if(responseJson.result.length === 1) {
      cb(responseJson.result[0]);
     }
   })
   .catch(error => {
     console.error(error);
   });
 }

 getFaculty(facultyId,cb) {
   return fetch('http://www.db.grad.nu.ac.th/apps/ws/get_faculty/'+facultyId,{  // url +'/' +this.props.staffid
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization' : 'JWT '+this.props.token
     }
   })
   .then(response => response.json())
   .then(responseJson => {
     cb(responseJson.result[0]);
   })
   .catch(error => {
     console.error(error);
   });
 }

 getLevel(levelId,cb) {
   return fetch('http://www.db.grad.nu.ac.th/apps/ws/get_level/'+levelId,{  // url +'/' +this.props.staffid
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization' : 'JWT '+this.props.token
     }
   })
   .then(response => response.json())
   .then(responseJson => {
     //this.setState({'programinfo':responseJson.result[0]});
     if(responseJson.result.length === 1) {
      cb(responseJson.result[0]);
     }
   })
   .catch(error => {
     console.error(error);
   });
 }

 handleLevelChange = (event,{name,value}) => {
   const state = this.state;
   state[name] = {'value':value,'isAssign':true}
   let setted = ['level'].filter((item) => state[item].isAssign);
   console.log(setted);
   this.setState({[name]:{'value':value,'isAssign':true}});
   if(this.props.onLevelLoaded) this.props.onLevelLoaded(this.state.level.value);
   //this.setState({[name]:value});
   //this.props.onFinish();
 }

 handleChange = (event)  => {
   var self = this;
   var change = {}
   if(event.target.name === 'studId')  {
     var sid = event.target.value;
     change[event.target.name]=sid;
     this.setState(change);
      if ((event.target.value).length===8)  {
        this.getStudentCheck(sid,function(student) {
          self.getProgram(student.PROGRAMID,function(program) {
            self.getFaculty(program.FACULTYID,function(faculty) {
              self.getLevel(program.LEVELID,function(level) {
                console.log(student.STUDENTNAME);
                if(self.props.onStudentLoaded) self.props.onStudentLoaded(student,faculty,program,level);
                self.setState({studentInfo:student, facultyInfo:faculty, programInfo:program,levelInfo:level})
              });
            });

          });
        });
      }
    }
    if(event.target.name === 'score')  {
      this.setState({  [event.target.name]: event.target.value });
      if(this.props.onScoreLoaded) this.props.onScoreLoaded(event.target.value);
    }
    this.props.onSave();
  };

  render() {
    const { type } = this.props;
    let levels = [
      {key:1,text:'ผ่าน',value:'ผ่าน'},
      {key:2,text:'ไม่ผ่าน',value:'ไม่ผ่าน'}
    ];
    if(type !== 'NU Writing Proflciency Test') {
      levels = [
        {key:1,text:'Below A1',value:'Below A1'},
        {key:2,text:'A1',value:'A1'},
        {key:3,text:'A1',value:'A1'},
        {key:4,text:'A2',value:'A2'},
        {key:5,text:'B1',value:'B1'},
        {key:6,text:'B2',value:'B2'},
        {key:7,text:'C1 or above',value:'C1 or above'}
      ];
    }

    const steps = [
      { key: 'english', disabled: true, title: 'English Exam Testing Information', description: 'เพิ่มข้อมูลเกี่ยวกับการการสอบภาษาอังกฤษ' },
      { key: 'student', active: true, title: 'Student English Exam Testing & Save', description: 'เพิ่มข้อมูลรายละเอียดผลสอบของนิสิตระดับบัณฑิตศึกษา' },
    ]

    var content =<Segment></Segment>
      content = (
        <Form>
          <Form.Field>
            <label>รหัสนิสิต</label>
            <Form.Field control={Input}
              onChange={this.handleChange}
              value={this.state.studId}
              name="studId"/>
          </Form.Field>
          <Form.Field control={Select}
            onChange={this.handleLevelChange}
            name="level"
            label='ระดับ'
            options={levels}/>
          <Form.Field>
            <label>คะแนน</label>
            <Form.Field control={Input}
              onChange={this.handleChange}
              value={this.state.score}
              name="score"/>
          </Form.Field>
        </Form>
      );
    return (

      <div>
      <Segment padded='very'>
        <Header size='medium'>แบบฟอร์มบันทึกข้อมูล</Header>
        <Divider clearing />
        <Grid>
          <Grid.Row>
            <Grid.Column width={4}><br/>
              <Segment>
                <p>ข้อมูลภาษาอังกฤษ</p>
                <p>เดือนที่รายงานผล : {this.props.month} ปี {this.props.year}</p>
                <p>ประเภทการสอบ : {this.props.type} </p>
              </Segment>
            </Grid.Column>
            <Grid.Column width={6}><br/>
              {content}
            </Grid.Column>
            <Grid.Column width={6}><br/>
              <Segment>
                <p>ข้อมูลนิสิต</p>
                <p>
                  {this.props.studId}  {this.state.studentInfo.STUDENTCODE}
                  {this.state.studentInfo.PREFIXNAME}{this.state.studentInfo.STUDENTNAME}  {this.state.studentInfo.STUDENTSURNAME}
                </p>
                <p> ระดับการศึกษา : {this.state.levelInfo.LEVELNAME} </p>
                <p>สาขาวิชา : {this.state.studentInfo.PROGRAMNAME} </p>
                <p>คณะ/วิทยาลัย : {this.state.facultyInfo.FACULTYNAME} </p>
              </Segment>
            </Grid.Column>

          </Grid.Row>
        </Grid>
      </Segment>


      <Step.Group items={steps} ordered />
      </div>
    );
  }
}
