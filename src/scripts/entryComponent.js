// Code in this file is responsible for creating the journal entry HTML component


// Create function to populate JSON details into HTML format.
const journalAsHTML = (obj) => {
  let journalComponent = `
<div class="dayEntry">
<h3>${obj.date}</h3>
<p>Subject matter is... ${obj.concept}</p>
<p>${obj.entry}</p>
<p>Mood for the day: ${obj.mood}</p>
</div>
`
  return journalComponent
}