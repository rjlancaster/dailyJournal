// Code in this file is responsible for creating the journal entry HTML component


// Create function to populate JSON details into HTML format.
const journalAsHTML = (date, concept, entry, mood) => `
<div class="dayEntry">
<h3>${date}</h3>
<p>Subject matter is... ${concept}</p>
<p>${entry}</p>
<p>Mood for the day: ${mood}</p>
</div>
`