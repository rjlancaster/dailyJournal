// Code in this file is responsible for modifying the DOM.

// Create function to loop over JSON array, execute journalAsHTML function and add results to class within HTML

const renderJournalEntries = (obj) => {
  for (let i = 0; i < obj.length; i++) {
    const entryClass = document.querySelector(".entryLog")
    let writeToDOM = journalAsHTML(obj[i].date, obj[i].concept, obj[i].entry, obj[i].mood);
    entryClass.innerHTML += writeToDOM;
  }
}