import React from 'react';
import { Button,Table,Icon,Form,Select} from 'semantic-ui-react';
const facultys = [
  "วิทยาลัยโลจิสติกส์และโซ่อุปทาน",
  "คณะศึกษาศาสตร์",
  "คณะสถาปัตยกรรมศาสตร์",
  "คณะวิศวกรรมศาสตร์",
  "คณะวิทยาศาสตร์การแพทย์",
  "คณะมนุษยศาสตร์",
  "คณะวิทยาศาสตร์",
  "คณะสังคมศาสตร์",
  "คณะเกษตรศาสตร์ ทรัพยากรธรรมชาติและสิ่งแวดล้อม",
  "คณะบริหารธุรกิจ เศรษฐศาสตร์และการสื่อสาร",
  "คณะเภสัชศาสตร์",
  "คณะสหเวชศาสตร์",
  "วิทยาลัยเพื่อการค้นคว้าระดับรากฐาน",
  "คณะพยาบาลศาสตร์",
  "คณะสาธารณสุขศาสตร์",
  "วิทยาลัยการจัดการระบบสุขภาพ",
  "คณะแพทยศาสตร์",
  "วิทยาลัยพลังงานทดแทน"
];

const levels = [
  'ปริญญาเอก',
  'ปริญญาโท'
];

export default class ListControl extends React.Component {
  constructor(props){
    super(props);
    this.state={
      'month':{value:'',isAssign:false},
      'year':{value:'',isAssign:false},
      'type':{value:'',isAssign:false},
      'content':[]
    }
  }
  componentDidMount() {
    this.getReport();
  }

  handleLoaded = () => {
    this.getReport();
  }

  handleChange = (event,{name,value}) => {
    const state = this.state;
    state[name] = {'value':value,'isAssign':true}
    let setted = ['month','year','type'].filter((item) => state[item].isAssign);
    console.log(setted);
    this.setState({[name]:{'value':value,'isAssign':true}});

    if(setted.length === 3) {
      if(this.handleLoaded) this.handleLoaded();
    }
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
            dateTest:this.state.dateTest,
            score:this.state.score,
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

  deleteClick = (event,value) => {
    this.checkExist().then((exists) => {
      console.log(exists);
      if(exists){
        //this.setState({clickSaveAble:false,clickAble:false})
        //this.handleStudentLoaded();
      } else {

       fetch('http://10.10.26.104:30003/delete_english/'+value,{
          method:'DELETE',
          headers:{
            'Content-Type':'application/json',
            'Authorization': 'JWT '+this.props.token,
          }
        })
        .then((response) => response.json())
        .then((responseJson) => {
          //if(responseJson.result.length == 1){
            this.setState({'exists':false});
          //}
        });
      }
    });
  }

  getReport() {
    var arry = [];
    for(var i=0;i<facultys.length;i++) {
        arry.push({'faculty':facultys[i],'items':[],'itemsphd':[]});
      }

    fetch('http://10.10.26.104:30003/english/report',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization': 'JWT '+this.props.token,
      },
      body:JSON.stringify({
        values:{
          type:this.state.type.value,
          month:this.state.month.value,
          year:this.state.year.value
        }
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      responseJson.result.forEach(function(item) {

        var c = facultys.indexOf(item.facultyName);
        if(c !== -1) {
           if (item.levelAbb==="ปริญญาเอก") {
               arry[c].itemsphd.push(item);
           } else if (item.levelAbb==="ปริญญาโท")  {
               arry[c].items.push(item);
           }
         } else {
           console.log(item.facultyName);
         }

      });
      this.setState({'content':arry});

    })
    .catch((error) => {
      console.error(error);
    });

  }


  render() {

    //const { month,year,type,token } = this.state;
    const months = [
      {key:1,text:'มกราคม',value:'มกราคม'},
      {key:2,text:'กุมภาพันธ์',value:'กุมภาพันธ์'},
      {key:3,text:'มีนาคม',value:'มีนาคม'},
      {key:4,text:'เมษายน',value:'เมษายน'},
      {key:5,text:'พฤษภาคม',value:'พฤษภาคม'},
      {key:6,text:'มิถุนายน',value:'มิถุนายน'},
      {key:7,text:'กรกฎาคม',value:'กรกฎาคม'},
      {key:8,text:'สิงหาคม',value:'สิงหาคม'},
      {key:9,text:'กันยายน',value:'กันยายน'},
      {key:10,text:'ตุลาคม',value:'ตุลาคม'},
      {key:11,text:'พฤศจิกายน',value:'พฤศจิกายน'},
      {key:12,text:'ธันวาคม',value:'ธันวาคม'}
    ];
    const years = [
      {key:1,text:'2560',value:'2560'},
      {key:2,text:'2561',value:'2561'}
    ];
    const types = [
      {key:1,text:'CEPT',value:'Cambridge English Placement Test'},
      {key:2,text:'NU Writing',value:'NU Writing Proflciency Test'}
    ];


    const listItems = this.state.content.map((faculty,index) =>
    <Table celled striped>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell colSpan='8'>{faculty.faculty}</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell colSpan='8'>นิสิตปริญญาโท</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell collapsing><Icon name='folder' /> ลำดับ</Table.Cell>
          <Table.Cell>รหัส</Table.Cell>
          <Table.Cell>ชื่อ-นามสกุล</Table.Cell>
          <Table.Cell>สาขาวิชา</Table.Cell>
          <Table.Cell>คะแนน</Table.Cell>
          <Table.Cell>ผลสอบ</Table.Cell>
          <Table.Cell>จัดการข้อมูล</Table.Cell>
          <Table.Cell collapsing textAlign='right'>หมายเหตุ</Table.Cell>
        </Table.Row>
        {faculty.items.map((student,index2) =>
        <Table.Row>
          <Table.Cell collapsing><Icon name='folder' /></Table.Cell>
          <Table.Cell>{student.studentId}</Table.Cell>
          <Table.Cell>{student.prefix}{student.name}  {student.lastName}</Table.Cell>
          <Table.Cell>{student.programName}</Table.Cell>
          <Table.Cell>{student.score}</Table.Cell>
          <Table.Cell>{student.level}</Table.Cell>
          <Table.Cell>
            <Icon name='edit' />

          </Table.Cell>
          <Table.Cell collapsing textAlign='right'>{student.month}/{student.year}</Table.Cell>
        </Table.Row>
      )}
        <Table.Row>
          <Table.Cell colSpan='8'>นิสิตปริญญาเอก</Table.Cell>
        </Table.Row>
      {faculty.itemsphd.map((student,index2) =>
      <Table.Row>
        <Table.Cell collapsing><Icon name='folder' /></Table.Cell>
        <Table.Cell>{student.studentId}</Table.Cell>
        <Table.Cell>{student.prefix}{student.name}</Table.Cell>
        <Table.Cell>{student.programName}</Table.Cell>
        <Table.Cell>{student.score}</Table.Cell>
        <Table.Cell>{student.level}</Table.Cell>
        <Table.Cell>
        
        <Icon name='edit' />

        </Table.Cell>
        <Table.Cell collapsing textAlign='right'>{student.month}/{student.year}</Table.Cell>
      </Table.Row>
    )}
      </Table.Body>
    </Table>
  );


    var content = <p></p>
    content = (
      <Form>
        <Form.Group widths='equal'>
          <Form.Field control={Select}
            onChange={this.handleChange}
            name="month"
            label='เดือนที่รายงานผล'
            options={months}/>
          <Form.Field control={Select}
            onChange={this.handleChange}
            name="year"
            label='ปีพ.ศ.ที่รายงานผล'
            options={years}/>
          <Form.Field control={Select}
            onChange={this.handleChange}
            name="type"
            label='ประเภทการสอบเทียบ'
            options={types}/>
        </Form.Group>
      </Form>
    );

    return (
      <div>
      <p></p>
      {content}
      <p></p>
      <p>{listItems}</p>

        <p></p>
          <Button onClick={(event) => this.props.onLogout()} content="ออกจากระบบ"/>
      </div>
    );
  }
}
