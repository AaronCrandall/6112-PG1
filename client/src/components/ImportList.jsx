import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as xlsx from 'xlsx';
//import * as mapping from "./RecordList";
import { useParams, useNavigate } from "react-router-dom";
const Record = (props) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.record.name }
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.record.position }
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.record.level }
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      <div className="flex gap-2">
        <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          /*to={`/edit/${props.record._id}`}*/ dont let the edit button do anything
        >
          Edit
        </Link>
        <button
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3"
          color="red"
          type="button"
          //onClick={() => {
          //  props.deleteRecord(props.record._id);
          //}} dont let the delete button do anything
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);


export default function Import(){
  const navigate = useNavigate();
  const params = useParams();
  const [records, setRecords] = useState([]);
  const [isRecordsSet, setIsRecordsSet] = useState(false);
  

  async function deleteRecord(id) {
    await fetch(`http://localhost:5050/record/${id}`, {
      method: "DELETE",
    });
    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);
  }

  function recordList() {
    return records.map((record) => {
      return (
        <Record
          record={record}
          deleteRecord={() => deleteRecord(record._id)}
          key={record._id}
        />
      );
    });
  }

  const Reject = () => {
    records.length = 0;
    navigate("/");
  }
  async function Accept(){
    for(let i = 0; i < records.length; i++){
      var person = records[i];
      try {
        // if the id is present, we will set the URL to /record/:id, otherwise we will set the URL to /record.
      const response = await fetch(`http://localhost:5050/record${params.id ? "/"+params.id : ""}`, {
        // if the id is present, we will use the PATCH method, otherwise we will use the POST method.
        method: `${params.id ? "PATCH" : "POST"}`,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(person),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      } catch (error) {
        console.error('A problem occurred adding or updating a record: ', error);
      }
   }
    records.length = 0;
    navigate("/");
    
  }

  const onFileChange = (e) => {
  e.preventDefault();
  
  if (e.target.files) {
    const reader = new FileReader();
    reader.onload = (e) => {  
      var data = e.target.result;
      const workbook = xlsx.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = xlsx.utils.sheet_to_json(worksheet);
      console.log(json);
      if (json.length < 10){
        for(let i = 0; i < json.length; i++) {
          records.push(json[i]);
        }
      setRecords(records);
      setIsRecordsSet(true);
      recordList();
      }
      else {
        for(let i = 0; i < 10; i++) {
          records.push(json[i]);
        }
      setRecords(records)
      setIsRecordsSet(true);
      recordList();
        for(let i = 10; i < json.length; i++){
          records.push(json[i]);
        }
      }
    };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
    return;
  }
  return (
    <>
      <h3 className="text-lg font-semibold p-4">Employee Records</h3>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&amp;_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Position
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Level
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="[&amp;_tr:last-child]:border-0">
              {isRecordsSet ? recordList() : null}
            </tbody>
          </table>
        </div>
      </div>
      {/*<button className='input-container'>*/}
        <input type="file" onChange={onFileChange} id="excel_file" accept=".xlsx, .xls"/>
            <label htmlFor="excel_file">
              Upload an Excel File
            </label>
      {/*</button>*/}
      <button className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" onClick={Accept}>
        Accept File
      </button>
      <button className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" onClick={Reject}>
        Reject File
      </button>
    </>
  );
}
  
//get records from the recordlist getrecords function but instead do it for the first 10 excel imports then show the records like in the
//records list, after that make two buttons on this page one to submit the records one to cancel, delete records. both buttons go back
//home. 