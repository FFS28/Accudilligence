import React from 'react';
import './ProjectPanel.css';


class ProjectPanel extends React.Component {
  constructor(props) { super(props); this.state = { data: [] }; }

  render(){
    return (
      <div className="ProjectPanel">
        Project List:<br/>
        {"Parent data" + this.props.data}
        <div className="toDo">
          <p>Read Client info from database</p>
          <p>Create Project: Open form for new project submission</p>
          <p>Create Project: If user not in client -> assign as client user group</p>
          <p>List Project: Grab projects related to this user</p>
          <p> Display Open New Project</p>
        </div>       
      </div>
    )
  }

}

ProjectPanel.propTypes = {
    /* TODO: Review ProTypes */
}

export default ProjectPanel;