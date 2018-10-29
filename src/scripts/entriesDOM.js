// Code in this file is responsible for modifying the DOM.

// Create function to loop over JSON array, execute journalAsHTML function and add results to class within HTML 
const renderJournalEntries = (entries) => {
  for (let i = 0; i < entries.length; i++) {
    const entryClass = document.querySelector(".entryLog")
    let writeToDOM = journalAsHTML(entries[i].date, entries[i].concept, entries[i].entry, entries[i].mood);
    entryClass.innerHTML += writeToDOM;
  }
}