// Code in this file deals with posting and retrieving the data from JSON.


// fetch request to populate results into json format and execute renderJournalEntries
const API = {

  getJournalEntries: () => {
    return fetch("http://localhost:8081/journalEntries/")
      .then(response => response.json())
      .then(json => {
        let domString = ""
        json.forEach(obj => {
          // console.log(obj)
          let returnedNames = journalAsHTML(obj)
          domString += returnedNames
        })
        return domString
      })
    },

    postJournalEntries: (journalEntryObject) => {
      fetch("http://localhost:8081/journalEntries/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(journalEntryObject)
      })
    }
  }

  // export default API
