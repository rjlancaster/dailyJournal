import { dataManager } from "./dataManager"
import { domRender } from "./domRender"
import { htmlEntry } from "./htmlEntry"

const edfJournal = {

  editDelete: () => {
    document.querySelector("#output").addEventListener("click", evt => {
      if (evt.target.id.startsWith("delete")) {
        const id = evt.target.id.split("!")[1]
        dataManager.deleteEntry(id).then(() => domRender())
      }
      if (evt.target.id.startsWith("edit")) {
        const id = evt.target.id.split("!")[1]
        // console.log(id)
        dataManager.singleEntry(id).then((entry) => {
          document.querySelector("#title").value = entry.title
          document.querySelector("#content").value = entry.content
          document.querySelector("#date").value = entry.date
          document.querySelector("#mood").value = entry.mood
        })
      }
    })
  },

  filter: () => {
    const radioBtn = document.getElementsByName("mood")
    radioBtn.forEach(button => {
      button.addEventListener("click", (e) => {
        for (let i = 0; i < radioBtn.length; i++) {
          if (radioBtn[i].value === e.target.value) {
            let radioBtnClicked = radioBtn[i].value
            output.innerHTML = ""
            dataManager.getEntries()
              .then(entries =>
                entries.filter(entry => entry.mood === radioBtnClicked))
              .then(entries => {
                entries.forEach(entry => {
                  let entryHtml = htmlEntry(entry)
                  document.querySelector("#output").innerHTML += entryHtml
                })
              })
          }
        }
      })
    })
  }
}
export { edfJournal }