import React from 'react';
import { Button} from 'semantic-ui-react';


export default class ReportData extends React.Component {
  constructor(props){
    super(props);
    this.state={

    }

  }


  render() {

    return (
      <div>
        <p></p>
          <Button onClick={(event) => this.props.onLogout()} content="ออกจากระบบ"/>
      </div>
    );
  }
}
