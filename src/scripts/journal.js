import { formManager } from "./formManager"
import { dom } from "./dom"
import { saveJournal } from "./saveJournal"
import { edfJournal } from "./edfJournal"

const journal = () => {
  // inserts input form to #input div in DOM
  document.querySelector("#input").innerHTML = formManager.htmlForm()
  //loads JSON array to DOM on window load
  dom.domRender()
  dom.moodRender()
  // function for saveBtn click event, save to JSON, clear output div and reloads JSON array to DOM
  saveJournal()
  // function for edit and delete buttons
  edfJournal.editDelete()
  // function for mood filter
  edfJournal.filter()

}


export { journal }