import React from 'react';
import logo from './logo.svg';
import './App.css';
import './index.css';
import Login from './Login';
import FormControl from './FormControl';
import ListControl from './ListControl';
import ReportData from './ReportData';
import {
  Container,
  Header,
  Menu
} from 'semantic-ui-react';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      'token':null,
      'loggedIn':false,
      'studentId':null
    };
  }

  getProfile(token) {
    fetch('http://www.db.grad.nu.ac.th/apps/ws/profile',{
      headers: {
        'Authorization':'JWT '+token
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      this.setState({'token':token,'loggedIn':true,'studentId':responseJson.UserID.name});
    })
    .catch((error) => {
      console.error(error);
    });
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {

    if(this.state.loggedIn) {
      const { activeItem } = this.state
      if(this.state.activeItem==='editorials') {
        return (
          <div>
            <Menu fixed='top' inverted>
              <Container>
                <Menu.Item
                  as='a'
                  name='createform'
                  active={activeItem === 'createform'}
                  onClick={this.handleItemClick}
                  header>
                  เพิ่มข้อมูล
                </Menu.Item>
                <Menu.Item
                  as='a'
                  name='editorials'
                  active={activeItem === 'editorials'}
                  header>
                  จัดการข้อมูล
                </Menu.Item>
                <Menu.Item
                  as='a'
                  name='reportdata'
                  active={activeItem === 'reportdata'}
                  onClick={this.handleItemClick}
                  header>
                  รายงานผล
                </Menu.Item>

              </Container>
            </Menu>
            <header style={{ marginTop: '1em' }}>
              <h1 className="App-title" style={{ marginTop: '0.5em' }}>Welcome to Graduate School</h1>
            </header>
            <Container textAlign='right' style={{ marginTop: '0.1em' }}>
            <ListControl token={this.state.token}
              onLogout={() => { this.setState({'loggedIn':false}) }}>
            </ListControl>
            </Container>
          </div>
        );
      } else if (this.state.activeItem==='reportdata')  {
        return (
          <div>
            <Menu fixed='top' inverted>
              <Container>
                <Menu.Item
                  as='a'
                  name='createform'
                  active={activeItem === 'createform'}
                  onClick={this.handleItemClick}
                  header>
                  เพิ่มข้อมูล
                </Menu.Item>
                <Menu.Item
                  as='a'
                  name='editorials'
                  active={activeItem === 'editorials'}
                  onClick={this.handleItemClick}
                  header>
                  จัดการข้อมูล
                </Menu.Item>
                <Menu.Item
                  as='a'
                  name='reportdata'
                  active={activeItem === 'reportdata'}
                  header>
                  รายงานผล
                </Menu.Item>

              </Container>
            </Menu>
            <header style={{ marginTop: '1em' }}>
              <h1 className="App-title" style={{ marginTop: '0.5em' }}>Welcome to Graduate School</h1>
            </header>
            <Container textAlign='right' style={{ marginTop: '0.1em' }}>
            <ReportData token={this.state.token}
              onLogout={() => { this.setState({'loggedIn':false}) }}>
            </ReportData>
            </Container>
          </div>
        );
      } else {
        return (
          <div>
            <Menu fixed='top' inverted>
              <Container>
                <Menu.Item
                  as='a'
                  name='createform'
                  active={activeItem === 'createform'}
                  header>
                  เพิ่มข้อมูล
                </Menu.Item>
                <Menu.Item
                  as='a'
                  name='editorials'
                  active={activeItem === 'editorials'}
                  onClick={this.handleItemClick}
                  header>
                  จัดการข้อมูล
                </Menu.Item>
                <Menu.Item
                  as='a'
                  name='reportdata'
                  active={activeItem === 'reportdata'}
                  onClick={this.handleItemClick}
                  header>
                  รายงานผล
                </Menu.Item>
              </Container>
            </Menu>
            <header style={{ marginTop: '1em' }}>
              <h1 className="App-title" style={{ marginTop: '0.5em' }}>Welcome to Graduate School</h1>
            </header>
            <Container textAlign='right' style={{ marginTop: '0.1em' }}>
              <FormControl token={this.state.token}
                onLogout={() => { this.setState({'loggedIn':false}) }}
                studentId={this.state.studentId}>
              </FormControl>
            </Container>
          </div>
        );
      }
    } else {
      return (
        <div className="App">
          <Menu fixed='top' inverted>
            <Container>
              <Menu.Item as='a' header>
                Home
              </Menu.Item>
            </Container>
          </Menu>
          <header className="App-header" style={{ marginTop: '1em' }}>
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title" style={{ marginTop: '0.5em' }}>Welcome to Graduate School, Naresuan University</h1>
          </header>
          <Container textAlign='right' style={{ marginTop: '0.1em' }}>
            <Header as='h1'>  </Header>
            <Login onToken={(token) => this.getProfile(token)}/>
          </Container>
        </div>
      );
    }

  }
}

export default App;
