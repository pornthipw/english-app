import React, { Component } from 'react';
import { Button, Form, Grid,  Segment } from 'semantic-ui-react'

export default class Login extends Component {
  constructor(props){
    super(props);
    this.state={
      password:'',
      username:'',
      token:'',
      message:''
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleClick(event) {
    //console.log(this.state.username);
    fetch('http://10.10.26.104:30003/login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      "username": this.state.username,
      "password": this.state.password

      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.token) {
        if(this.props.onToken) {
          if (responseJson.userID===this.state.username){
             this.props.onToken(responseJson.token);
          } else {
            this.setState({'message':'Invalid Login'});
          }
        }
      } else {
        this.setState({'message':'Invalid Login'});
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {

    return (
      <div className='login-form' style={{ float:'right'}}>
    {/*
      Heads up! The styles below are necessary for the correct render of this example.
      You can do same with CSS, the main idea is that all the elements up to the `Grid`
      below must have a height of 100%.
    */}
    <style>
    {`
      body > div,
      body > div > div,
      body > div > div > div.login-form { height: 50%; }
    `}</style>

    <Grid
      textAlign='center'
      style={{ height: '100%' }}
      verticalAlign='middle'
    >
      <Grid.Column style={{ maxWidth: 450 }}>

        <Form size='large'>
          <Segment stacked>
            <Form.Input
              fluid
              icon='user'
              iconPosition='left'
              placeholder='NUnet account'
              value={this.state.username}
              onChange={this.handleChange('username')}
            />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type='password'
              value={this.state.password}
              onChange={this.handleChange('password')}
            />

            <Button
              onClick={(event) => this.handleClick(event)}>
              เข้าสู่ระบบ
            </Button>
            {this.state.message}
          </Segment>
        </Form>


      </Grid.Column>
    </Grid>
  </div>

    );

  }

}
