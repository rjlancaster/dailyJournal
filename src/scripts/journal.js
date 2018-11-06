/*
    Main application logic that uses the functions and objects
    defined in the other JavaScript files.

    Change the fake variable names below to what they should be
    to get the data and display it.
*/
const submitBtn = document.querySelector("#submitBtn")
const entryLog = document.querySelector("#entryLog")

// on window load, existing journal entries will show on page
API.getJournalEntries().then(domString => entryLog.innerHTML = domString)

// function takes user input and puts it in journal entry format
function formatUserInput() {
  const journalDate = document.querySelector("#journalDate").value
  const conceptsCoveredText = document.querySelector("#conceptsCoveredText").value
  const journalEntryText = document.querySelector("#journalEntryText").value
  const moodValue = document.querySelector("#moodValue").value
  const journalEntryToSave = {
    date: journalDate,
    concept: conceptsCoveredText,
    entry: journalEntryText,
    mood: moodValue
  }
  return journalEntryToSave
}

// Journal entry submit form executes user input retrieval function, stores to variable and posts to JSON
submitBtn.addEventListener("click", () => {
  let journalEntryObject = formatUserInput()
  API.postJournalEntries(journalEntryObject)
})
