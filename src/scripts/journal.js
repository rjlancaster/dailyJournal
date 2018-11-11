import { formManager } from "./formManager"
import { domRender } from "./domRender"
import { saveJournal } from "./saveJournal"
import { edfJournal } from "./edfJournal"

const journal = () => {
  // inserts input form to #input div in DOM
  document.querySelector("#input").innerHTML = formManager.htmlForm()
  //loads JSON array to DOM on window load
  domRender()
  // function for saveBtn click event, save to JSON, clear output div and reloads JSON array to DOM
  saveJournal()
  // function for edit and delete buttons
  edfJournal.editDelete()
  // function for mood filter
  edfJournal.filter()
}


export { journal }