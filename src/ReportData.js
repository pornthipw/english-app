import React from 'react';
import { Button,Form,Select,Label,List } from 'semantic-ui-react';
import pdfMake from "pdfmake/build/pdfmake";
//import pdfFonts from "./vfs_fonts";
//import pdfFonts from 'pdfmake/build/vfs_fonts';
import pdfFonts from "./vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

pdfMake.fonts = {
  THSarabunNew: {
    normal: 'THSarabunNew.ttf',
    bold: 'THSarabunNew Bold.ttf',
    italics: 'THSarabunNew-Italic.ttf',
    bolditalics: 'THSarabunNew-BoldItalic.ttf'
  },
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf'
  }
}

export default class ReportData extends React.Component {
  constructor(props){
    super(props);
    this.state={
      'month':{value:'',isAssign:false},
      'year':{value:'',isAssign:false},
      'type':{value:'',isAssign:false},
      'contentfac':[],
      'item':'',
      'student':{},
      'bodys' : [],
      'bodysPhd' : [],

    }
  }

componentDidMount() {
  //this.getPDFReport();
}

handlePDFLoaded = () => {
  this.getFacultyReport();
}

handleChange = (event,{name,value}) => {
  const state = this.state;
  state[name] = {'value':value,'isAssign':true}
  let setted = ['month','year','type'].filter((item) => state[item].isAssign);
  console.log(setted);
  this.setState({[name]:{'value':value,'isAssign':true}});

  if(setted.length === 3) {
    this.getFacultyReport();
    //if(this.handlePDFLoaded) this.handlePDFLoaded();
  }
}

handleItemClick = (event) => {
  this.setState({ item: event.target.innerText });
  if(event.target.innerText){
     this.getResult(event.target.innerText);
  }
}

printPDF() {
   console.log('print');
   console.log(this.state.bodys);
   console.log(this.state.bodysPhd);
    var docDefinition = {
      pageSize: 'A4',
      styles: {
        topheader: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
          margin:[0,20,0,0]
        },
        header: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
          margin:[0,4,0,0]
        },
        title: {
          fontSize: 16,
          bold: true,
          alignment: 'left',
        },
        content: {
          fontSize: 15,
          bold: true,
          alignment: 'center',
        },
        contentin: {
          fontSize: 15,
          alignment: 'center',
        },
      },
      pageMargins: [ 23, 60, 10, 10 ],
        header: {
          //margin: 10,
          columns: [
            {
                margin: [10, 10, 0, 0],
                text: '[บัณฑิตวิทยาลัย มหาวิทยาลัยนเรศวร]'
            },
          ]
        },
        content: [
          { text: this.state.student.type,  style: [ 'topheader']},
          { text: 'ประจำเดือน'+this.state.student.month+' '+this.state.student.year, style: [ 'header']},
          { text: this.state.student.facultyName, style: [ 'header']},
          { text: '',  fontSize: 16, margin:[0,30,10,0]},
          {
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: [ 24,'auto', 78, 70,150,32,45,'auto' ],
              body: this.state.bodys
            }
          },
          { text: '',fontSize: 15, margin:[0,20,10,0] },
          {
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: [ 24,'auto', 78, 70,150,32,45,'auto' ],
              body: this.state.bodysPhd
            }
          },
        ],
        defaultStyle:{
          font:'THSarabunNew',
        }

    };
    pdfMake.createPdf(docDefinition).open()
    //pdfMake.createPdf(docDefinition).open({}, win);
  }

getResult(faculty) {
   var rows = [];
   var rowsPhd = [];
   var secondRow = [];
   var firstRow = [];
   var total =1;
   var totalPhd =1;
   fetch('http://10.10.26.104:30003/english/liststudent',{
     method:'POST',
     headers:{
       'Content-Type':'application/json',
       'Authorization': 'JWT '+this.props.token,
     },
     body:JSON.stringify({
       values:{
         type:this.state.type.value,
         month:this.state.month.value,
         year:this.state.year.value,
         facultyName:faculty
       }
     })
   })
   .then((response) => response.json())
   .then((responseJson) => {
     console.log(responseJson.result);
     var peajes = responseJson.result;
     console.log(peajes);
     //var countnumber =0;

     if(responseJson.result.length >= 1){
        this.setState({'student':responseJson.result[0]});
        rows.push(['ลำดับ', 'รหัส', 'ชื่อ','นามสกุล', 'สาขาวิชา', 'คะแนน', 'ผลสอบ','หมายเหตุ']);
        rowsPhd.push(['ลำดับ', 'รหัส', 'ชื่อ','นามสกุล', 'สาขาวิชา', 'คะแนน', 'ผลสอบ','หมายเหตุ']);


        for(var i=0 ; i < responseJson.result.length+1; i++)
        {
          if (peajes.hasOwnProperty(i)) {
            var peaje = peajes[i];
            if (peaje.levelAbb==="ปริญญาโท") {
                rows.push(['#',peaje.studentId.toString(),peaje.prefix.toString()+''+peaje.name.toString(),peaje.lastName.toString(),peaje.programName.toString(),peaje.score,peaje.level.toString(),'']);
              } else  {
                rowsPhd.push(['#',peaje.studentId.toString(),peaje.prefix.toString()+''+peaje.name.toString(),peaje.lastName.toString(),peaje.programName.toString(),peaje.score,peaje.level.toString(),'']);
              }

          }
        }

        if (rowsPhd.length >= 2 ) {
          if (rows.length >= 22 ) {
            secondRow.push([{fontSize:16,text:'',colSpan:8,border: [false, false, false, false],pageBreak: 'before', margin: [0, 0, 0, 8]},'','','','','','','']);
            secondRow.push([{fontSize:16,text:'นิสิตระดับปริญญาเอก',colSpan:8,border: [false, false, false, true],style: [ 'title']},'','','','','','','']);
          } else {
            secondRow.push([{fontSize:16,text:'นิสิตระดับปริญญาเอก',colSpan:8,border: [false, false, false, true],style: [ 'title']},'','','','','','','']);
          }
          if (this.state.type.value==='Cambridge English Placement Test') {
            secondRow.push([{fontSize:15,text:'ลำดับ',alignment: 'center',style: [ 'content']}, {fontSize:15,text:'รหัส',alignment: 'center',style: [ 'content']}, {fontSize:15,text:'ชื่อ-นามสกุล',alignment: 'center',colSpan:2,border: [false, false, true, false],style: [ 'content']},'', {fontSize:15,text:'สาขาวิชา',alignment: 'center',style: [ 'content']}, {fontSize:15,text:'คะแนน',alignment: 'center',style: [ 'content']}, {fontSize:15,text:'CEFR Level',alignment: 'center',style: [ 'content']},{fontSize:15,text:'หมายเหตุ',alignment: 'center',style: [ 'content']}]);
          } else {
            secondRow.push([{fontSize:15,text:'ลำดับ',alignment: 'center',style: [ 'content']}, {fontSize:15,text:'รหัส',alignment: 'center',style: [ 'content']}, {fontSize:15,text:'ชื่อ-นามสกุล',alignment: 'center',colSpan:2,border: [false, false, true, false],style: [ 'content']},'', {fontSize:15,text:'สาขาวิชา',alignment: 'center',style: [ 'content']}, {fontSize:15,text:'คะแนน',alignment: 'center',style: [ 'content']}, {fontSize:15,text:'ผลสอบ',alignment: 'center',style: [ 'content']},{fontSize:15,text:'หมายเหตุ',alignment: 'center',style: [ 'content']}]);
          }
          for(var j=1 ; j < rowsPhd.length; j++)
          {
            var peaje2 = rowsPhd[j];
            secondRow.push([{fontSize:14,text:j,alignment: 'center'},{fontSize:14,text:peaje2[1]},{fontSize:14,text:peaje2[2],border: [true, true, false, true]},{fontSize:14,text:peaje2[3],border: [false, true, true, true]},{fontSize:14,text:peaje2[4]},{fontSize:14,text:peaje2[5],alignment: 'center'},{fontSize:14,text:peaje2[6],alignment: 'center'},'']);
          }
        }else{
          secondRow.push([]);
        }


        if (rows.length >= 2 ) {
          firstRow.push([{fontSize:16,text:'นิสิตระดับปริญญาโท',colSpan:8,border: [false, false, false, true],style: [ 'title']},'','','','','','','']);
          if (this.state.type.value==='Cambridge English Placement Test') {
            firstRow.push([{fontSize:15,text:'ลำดับ',alignment: 'center',style: [ 'content']}, {fontSize:15,text:'รหัส',alignment: 'center',style: [ 'content']}, {fontSize:15,text:'ชื่อ-นามสกุล',alignment: 'center',colSpan:2,border: [false, false, true, false],style: [ 'content']},'', {fontSize:15,text:'สาขาวิชา',alignment: 'center',style: [ 'content']}, {fontSize:15,text:'คะแนน',alignment: 'center',style: [ 'content']}, {fontSize:15,text:'CEFR Level',alignment: 'center',style: [ 'content']},{fontSize:15,text:'หมายเหตุ',alignment: 'center',style: [ 'content']}]);
          } else {
            firstRow.push([{fontSize:15,text:'ลำดับ',alignment: 'center',style: [ 'content']}, {fontSize:15,text:'รหัส',alignment: 'center',style: [ 'content']}, {fontSize:15,text:'ชื่อ-นามสกุล',alignment: 'center',colSpan:2,border: [false, false, true, false],style: [ 'content']},'', {fontSize:15,text:'สาขาวิชา',alignment: 'center',style: [ 'content']}, {fontSize:15,text:'คะแนน',alignment: 'center',style: [ 'content']}, {fontSize:15,text:'ผลสอบ',alignment: 'center',style: [ 'content']},{fontSize:15,text:'หมายเหตุ',alignment: 'center',style: [ 'content']}]);
          }
          for(var k=1 ; k < rows.length; k++)
          {
            var peaje3 = rows[k];
            firstRow.push([{fontSize:14,text:k,alignment: 'center'},{fontSize:14,text:peaje3[1]},{fontSize:14,text:peaje3[2],border: [true, true, false, true]},{fontSize:14,text:peaje3[3],border: [false, true, true, true]},{fontSize:14,text:peaje3[4]},{fontSize:14,text:peaje3[5],alignment: 'center'},{fontSize:14,text:peaje3[6],alignment: 'center'},'']);
          }
        }else{
          firstRow.push([]);
        }

        //console.log(rowsPhd.length);
        //console.log(rows.length);
        //console.log(secondRow);

      }
      this.setState({'bodys':firstRow,'bodysPhd':secondRow});
      //console.log(rows);
      this.printPDF();
   })
   .catch((error) => {
     console.error(error);
   });
}

getFacultyReport() {
  var arry_faculty = [];
  fetch('http://10.10.26.104:30003/english/faculty',{
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
    var index1 = 1;
    var fac = responseJson.result;
    arry_faculty.push({'facultys':[]});
      fac.forEach(function(item,index) {
        arry_faculty[index1-1].facultys.push(item);
     });
     this.setState({'contentfac':arry_faculty});
  })
  .catch((error) => {
    console.error(error);
  });
}

  render() {
    const { activeItem } = this.state;
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

    const list = this.state.contentfac.map((item, i) =>
        <List>{item.facultys.map((fac,j)=>
          <List.Item content={fac.facultyName} value={j} key={j} active={activeItem === fac.facultyName}
          onClick={this.handleItemClick}>{fac.facultyName}</List.Item>)}
        </List>
    );

    return (
      <div>
        <p></p>
        {content}
        <p>{list}</p>
        <Button onClick={(event) => this.props.onLogout()} content="ออกจากระบบ"/>
      </div>
    );
  }
}
