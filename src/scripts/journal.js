/*
Main application logic that uses the functions and objects
defined in the other JavaScript files.

Change the fake variable names below to what they should be
to get the data and display it.
*/
const submitBtn = document.querySelector("#submitBtn")
const entryLog = document.querySelector("#entryLog")
const radioButton = document.getElementsByName("mood")

// on window load, existing journal entries will show on page
API.getJournalEntries()
  .then((entries) =>
  entries.forEach(entry => {
    let renderedJournal = journalAsHTML(entry)
    entryLog.innerHTML += renderedJournal
  }))

// function takes user input and puts it in journal entry format
function formatUserInput() {
  const journalDate = $("#journalDate").val()
  const conceptsCoveredText = $("#conceptsCoveredText").val()
  const journalEntryText = $("#journalEntryText").val()
  const moodValue = $("#moodValue").val()
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
  // .then(contactList => console.log(contactList))
})

// newArray = homes.filter(function (el) {
//   return el.price <= 1000 &&
//          el.sqft >= 500 &&
//          el.num_of_beds >=2 &&
//          el.num_of_baths >= 2.5;
// });

radioButton.forEach(button => {
  button.addEventListener("click", (e) => {
    for (let i = 0; i < radioButton.length; i++) {
      if (radioButton[i].value === e.target.id) {
        radioButtonClicked = radioButton[i]
        entryLog.innerHTML = ""
        // renderCachedEntries(cache.filter(entry => entry.mood === radioButtonClicked.value));
        // API.getJournalEntries().then
        API.getJournalEntries().then(domString => console.log(domString))
      }
    }
  })
})



// event => {
//   const mood = event.target.value
//   return mood
// console.log(mood)
    // if (mood === five) {
    //   API.getJournalEntries().then(domstring => {
    //     let filteredMood = domstring.filter(obj.mood === "5 - Whoa, ecstatic!")
    //     return filteredMood
    //   })
    //   .then(filteredMood => entryLog.innerHTML = filteredMood)
    // }