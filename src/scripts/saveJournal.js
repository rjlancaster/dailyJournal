import { dataManager } from "./dataManager"
import { formManager } from "./formManager"
import { dom } from "./dom"

const saveJournal = () => {
  document.querySelector("#saveBtn").addEventListener("click", () => {
    const title = document.querySelector("#title").value
    const content = document.querySelector("#content").value
    const date = document.querySelector("#date").value
    const moodsID = document.querySelector("#mood").value
    const instructorsID = document.querySelector("#instructor").value
    if (!title || !content || !date || !moodsID || !instructorsID) {
      alert("Please fill all entries in form")
    } else {
      dataManager.saveEntry(formManager.formatUserInput())
        .then(() => {
          formManager.clearForm()
          dom.domRender()
        })
    }
  })
}

export { saveJournal }