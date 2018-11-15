import { dataManager } from "./dataManager"
import { htmlEntry } from "./htmlEntry"

const dom = {
  domEntries: (entry) => {
    document.querySelector("#output").innerHTML += entry
  },

  domMoods: (entry) => {
    document.querySelector("#moodOptions").innerHTML += entry
  },

  domRender: () => {
    document.querySelector("#output").innerHTML = ""
    dataManager.getEntries()
      .then(entries => {
        entries.forEach(entry => {
          const entryHtml = htmlEntry.outputEntry(entry)
          dom.domEntries(entryHtml)
        })
      })
  },

  moodRender: () => {
    dataManager.fetchMoods()
      .then(moods => {
        moods.forEach(mood => {
          const moodHtml = htmlEntry.moodEntry(mood)
          console.log(moodHtml)
          dom.domMoods(moodHtml)
        })
      })
  }
}

export { dom }