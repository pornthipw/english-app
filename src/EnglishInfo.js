import React from 'react';
import {  Divider,Form,Select,Step,Segment,Header } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
//import DatePicker from 'react-datepicker';
//import 'react-datepicker/dist/react-datepicker.css';


export default class EnglishInfo extends React.Component {
  constructor(props){
    super(props);
    this.state={
      month:{value:'',isAssign:false},
      year:{value:'',isAssign:false},
      type:{value:'',isAssign:false},
      dateTest:moment(),
      message:''
    }
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  handleDateChange(date){
    this.setState({dateTest: date });
    console.log(date);
    if(this.props.onDateLoaded) this.props.onDateLoaded(date);
  }

  handleChange = (event,{name,value}) => {
    const state = this.state;
    state[name] = {'value':value,'isAssign':true}
    let setted = ['month','year','type'].filter((item) => state[item].isAssign);
    console.log(setted);
    this.setState({[name]:{'value':value,'isAssign':true}});

    if(setted.length === 3) {
      if(this.props.onFinish) this.props.onFinish();
      if(this.props.onEnglishLoaded) this.props.onEnglishLoaded(this.state.month.value,this.state.year.value,this.state.type.value);
    }
  }

  render() {
    const { month,year,type } = this.state;
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
    const steps = [
      { key: 'english', active: true, title: 'English Exam Testing Information', description: 'เพิ่มข้อมูลเกี่ยวกับการการสอบภาษาอังกฤษ' },
      { key: 'student', disabled: true, title: 'Student English Exam Testing & Save', description: 'เพิ่มข้อมูลรายละเอียดผลสอบของนิสิตระดับบัณฑิตศึกษา' },
    ]
    /*const description = [
      'Amy is a violinist with 2 years experience in the wedding industry.',
      'She enjoys the outdoors and currently resides in upstate New York.',
    ].join(' ')
    */
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
              <Form.Field>
              <label>วันที่สอบ (DateTest)</label>
              <DatePicker
                selected={this.state.dateTest}
                onChange={this.handleDateChange}
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"

              />
              </Form.Field>
            </Form.Group>
          </Form>
        );

    return (
      <div>
      <Segment padded='very'>
        <Header size='medium'>แบบฟอร์มบันทึกข้อมูล</Header>
        <Divider clearing />
        {content}
      </Segment>
        <Step.Group items={steps} ordered />
      </div>
    );
  }
}
