import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

//ADDED CHECK BOX
const Record = (props) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      <input 
        type="checkbox"
        value={props.record._id} 
        onChange={() => {props.updateCheckbox(props.record._id)}}
        checked={props.record.checked}
      ></input>
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.record.name}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.record.position}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.record.level}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      <div className="flex gap-2">
        <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          to={`/edit/${props.record._id}`}
        >
          Edit
        </Link>
        <button
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3"
          color="red"
          type="button"
          onClick={() => {
            props.deleteRecord(props.record._id);
          }}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

export default function RecordList() {
  const [records, setRecords] = useState([]);
  //NEW WAY OF USING CHECK BOXES
  const [allChecked, setAllChecked] = useState(false);

  // This method fetches the records from the database.
  useEffect(() => {
    async function getRecords() {
      const response = await fetch(`http://localhost:5050/record/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const records = await response.json();
      // ADD CHECK KEY
      records.forEach((record) => {
        record.checked = false;
      })
      setRecords(records);
    }
    getRecords();
    return;
  }, [records.length]);

  // This method will delete a record
  async function deleteRecord(id) {
    await fetch(`http://localhost:5050/record/${id}`, {
      method: "DELETE",
    });
    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);
  }

  //NEW FUNCTION TO UPDATE CHECK BOXES
  function updateCheckbox(id) {
    let newRecords = []
    records.forEach((record) => {
      if (record._id === id) {
        record.checked = !record.checked;
      }
      newRecords.push(record);
    })
    setRecords(newRecords);
  }

  //NEW FUNCTION TO TOGGLE CHECK ALL
  function toggleCheckAll() {
    if (!allChecked) {
      setRecords(records.map(record => ({...record, checked: true})))
      setAllChecked(true);
    }
    else {
      setRecords(records.map(record => ({...record, checked: false})))
      setAllChecked(false);
    }
  }

  //ADD IN UPDATE CHECKBOX
  // This method will map out the records on the table
  function recordList() {
    return records.map((record) => {
      return (
        <Record
          record={record}
          updateCheckbox={() => updateCheckbox(record._id)}
          deleteRecord={() => deleteRecord(record._id)}
          key={record._id}
        />
      );
    });
  }

  //ADD IN DELETE SELECTED FUNCTION
  async function deleteSelected() {
    let deleteList = []
    records.forEach((record) => {
      if (record.checked) {
        deleteList.push(record._id);
      }
    })
    let deleteIds = "";
    if (deleteList.length != 0) {
      deleteList.forEach((deleteEntry) => 
        deleteIds = deleteIds.concat(deleteEntry, "-"));
      await fetch(`http://localhost:5050/record/bulkdelete/${deleteIds}`, {
        method: "DELETE",
      });
    }
    const newRecords = [];
    records.forEach((record) => {
      if (!deleteList.includes(record._id)) {
        newRecords.push(record);
      }
    })
    setRecords(newRecords);
    setAllChecked(false);
  }

  // ADD IN SELECT ALL BUTTON
  // ADD IN DELETE SELECTED BUTTON
  // This following section will display the table with the records of individuals.
  return (
    <>
      <h3 className="text-lg font-semibold p-4">Employee Records</h3>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&amp;_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  <input type="checkbox" value="selectAll" onChange={() => toggleCheckAll()} checked={allChecked}></input>
                </th>
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
              {recordList()}
            </tbody>
          </table>
        </div>
      </div>
      <button 
      className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3"
      type="button" onClick={() => {deleteSelected()}}>Delete Selected</button>
    </>
  );
}
