const moment = require('moment')

const templateEmail = (props) => {
  console.log(props, 'ticket props')
  return  `<style>
  table, th, td {
    border: 1px solid black;
    border-collapse: collapse;
  }
  th, td {
    padding: 5px;
    text-align: left;
  }
  </style>
  <table>
  <tr>
    <th>Title</th>
    <td>${props.title}</td>
  </tr>
  <tr>
      <th>Severity</th>
      <td>${props.severity}</td>
  </tr>
  <tr>
      <th>Assigned to</th>
      <td>${props.assignToName}</td>
  </tr>
  <tr>
      <th>Start Date</th>
      <td>${moment(props.startDate).format('DD/MM/YYYY')}</td>
  </tr>
  <tr>
      <th>Start Time</th>
      <td>${moment(props.startDate).format('h:mm:ss a')}</td>
  </tr>
  <tr>
      <th>End Date</th>
      <td>${moment(props.endDate).format('DD/MM/YYYY')}</td>
  </tr>
  <tr>
      <th>Project</th>
      <td>${props.project.name}</td>
  </tr>
  <tr>
      <th>Client</th>
      <td>${props.project.client.name}</td>
  </tr>
  <tr>
      <th>Type of Project</th>
      <td>${props.type}</td>
  </tr>
  <tr>
      <th>Release Milestone</th>
      <td>${props.releaseMilestone}</td>
  </tr>
</table>
`

}

module.exports = templateEmail