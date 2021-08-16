// import logo from './logo.svg';
import './App.css';
import { useFilePicker } from 'use-file-picker'
import { useState } from 'react';
import { Chart } from "react-google-charts";

function App() {
  const [masterData, setMasterData] = useState([])
  const [masterDataState, setMasterDataState] = useState(false)
  let barData = []
  const [openFileSelector, { filesContent, loading }] = useFilePicker({
    accept: '.csv',
  })
  const handleFileUpload = () => {
    let allData = filesContent[0].content.split('\n')
    allData = allData.slice(1, allData.length)
    for (let i = allData.length - 1; i >= 0; i--) {
      if (allData[i].trim() == '') {
        allData.splice(i, 1)
      }
    }
    setMasterData(allData)
    setMasterDataState(true)
    // setTimeout(() => {
    //   console.log(masterData)
    // }, 4000)
  }

  const MeetingStats = (props) => {

    const hostDetails = masterData.find((ele) => {
      const [, , , guest] = ele.split(',')
      return guest.trim().toLowerCase() === 'no'
    })
    const [name, , duration] = hostDetails.split(',')
    const totalHrs = Math.floor(Number(duration) / 60)
    const totalMins = (Number(duration)) - totalHrs * 60

    return (
      <section>
        <h3>Report</h3>
        <p> Host - {name}</p>
        <p> Total Participants - {masterData.length}</p>
        <p> Duration - {duration} min or {totalHrs} hr {totalMins} min  </p>
      </section>
    )
  }

  const GenrateBarChart = (props) => {
    // console.log(...barData)
    return (
      <div>
        <Chart
          width={'500px'}
          height={'300px'}
          chartType="ColumnChart"
          loader={<div>Loading Chart</div>}
          data={barData}
          options={{
            title: 'Student Presence Bar Chart',
            chartArea: { width: '50%' },
            vAxis: {
              title: 'Total Duration',
            },
            hAxis: {
              title: 'Student',
            },
          }}
          // For tests
          rootProps={{ 'data-testid': '1' }}
        />
      </div>
    )
  }

  const DisplayTable = (props) => {
    console.log(masterData)
    barData = [['name', 'duration']]
    // barData.push(['name', 'duration'])
    return (
      <table>
        <thead >
          <tr>
            <td style={{ border: '1px solid black' }}>Name</td>
            <td style={{ border: '1px solid black' }}>email</td>
            <td style={{ border: '1px solid black' }}>duration</td>
          </tr>
        </thead>
        <tbody >
          {masterData.map((ele, indx) => {
            const [name, email, duration] = ele.split(',')
            barData.push([name, Number(duration)])
            // { console.log(...barData) }
            return (<tr key={indx}>
              <td style={{ border: '1px solid black' }}>{name}</td>
              <td style={{ border: '1px solid black' }}>{email}</td>
              <td style={{ border: '1px solid black' }}>{duration}</td>
            </tr>)
          })}
        </tbody>
        {/* {console.log(...barData)} */}
      </table>
    )
  }
  return (
    <div >
      <h1>csv parser</h1>
      <button onClick={() => openFileSelector()} style={{ margin: '8px' }}>Select files </button>
      <button onClick={() => handleFileUpload()} style={{ margin: '8px' }}>See Report </button>
      <br />
      <hr />
      {masterDataState && <MeetingStats />}
      <div className="App">
        {masterDataState && <DisplayTable />}
        {masterDataState && <GenrateBarChart />}

      </div>
    </div>
  );
}

export default App;
