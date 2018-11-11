import { dataManager } from "./dataManager"
import { formManager } from "./formManager"
import { domRender } from "./domRender"

const saveJournal = () => {
  document.querySelector("#saveBtn").addEventListener("click", () => {
    const title = document.querySelector("#title").value
    const content = document.querySelector("#content").value
    const date = document.querySelector("#date").value
    const mood = document.querySelector("#mood").value
    if (!title || !content || !date || !mood) {
      alert("Please fill all entries in form")
    } else {
      dataManager.saveEntry(formManager.formatUserInput())
        .then(() => {
          formManager.clearForm()
          domRender()
        })
    }
  })
}

export { saveJournal }