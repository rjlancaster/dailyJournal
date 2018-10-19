
// 1. iterate over journalEntries[i] in order to retrieve journalEntries[i].name, journalEntries[i].concept, etc
// 2. plug journalEntries[i].name, journalEntries[i].concept, etc into function that plugs pieces into HTML.  Have this equal new variable.
// const addJournalToDom = document.querySelector(".foodList");
// addJournalToDom += variable from step 2

// Create function to populate JSON details into HTML format.
const journalAsHTML = (date, concept, entry, mood) => `
<div id = "dayEntry">
<h3>${date}</h3>
<p>Subject matter is... ${concept}</p>
<p>${entry}</p>
<p>Mood for the day: ${mood}</p>
</div>
`

// Create function to loop over JSON array, execute journalAsHTML function and add results to class within HTML Doc
const renderJournalEntries = (entries) => {
  for (let i = 0; i < entries.length; i++) {
    const entryClass = document.querySelector(".entryLog")
    let taco = journalAsHTML(entries[i].date, entries[i].concept, entries[i].entry, entries[i].mood);
    entryClass.innerHTML += taco;
  }
}
// fetch request to populate results into json format and execute renderJournalEntries
fetch("http://localhost:8081/journalEntries/")
  .then(entries => entries.json())
  .then(json => {
    renderJournalEntries(json);
  }
  )

