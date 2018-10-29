// Code in this file deals with getting the data.


// const API = {
//   getJournalEntries() {
//     return fetch("http://localhost:8081/journalEntries/")
//       .then(response => response.json())
//   }
// }

// fetch request to populate results into json format and execute renderJournalEntries
fetch("http://localhost:8081/journalEntries/")
  .then(entries => entries.json())
  .then(json => {
    renderJournalEntries(json);
  }
  )