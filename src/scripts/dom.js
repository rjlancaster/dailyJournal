import { dataManager } from "./dataManager"
import { htmlEntry } from "./htmlEntry"

const dom = {
  domEntries: (entry) => {
    document.querySelector("#output").innerHTML += entry
  },

  domMoods: (entry) => {
    document.querySelector("#moodOptions").innerHTML += entry
  },
  domInstructor: (entry) => {
    document.querySelector("#instructorOptions").innerHTML += entry
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
          dom.domMoods(moodHtml)
        })
      })
  },
  instructorsRender: () => {
    dataManager.fetchInstructors()
      .then(instructors => {
        instructors.forEach(instructor => {
          const instructorHtml = htmlEntry.instructorEntry(instructor)
          dom.domInstructor(instructorHtml)
        })
      })
  }
}

export { dom }