const formManager = {
  // function that will be called to represent HTML on main page
  htmlForm: () => {
    return `
    <div class="journal">
    <fieldset class="journalBox">
      <label class="journalInputs" for="date">Date of Entry
        <input type="date" name="Date" id="date"></label>
      <label class="journalInputs" for="title">Concept Covered
        <input type="text" name="title" id="title" placeholder="What concept are you covering today?"></label>
      <label class="journalInputs" for="content">Journal Entry
        <textarea rows="3" columns="40" name="content" id="content" placeholder="Tell me what's on your mind"></textarea></label>
        <label class="journalInputs" for="instructor">Instructor
        <select id="instructorOptions"></select></label>
      <label class="journalInputs" for="mood">Mood for the Day
        <select id="moodOptions"></select></label>
      <button type="button" class="btn btn-light btn-sm" id="saveBtn">Record Journal Entry</button>
      <div>
        <legend>Filter Entries by Mood</legend>
        <div id="moodFilters">
          <div>
            <input type="radio" id="sad" name="mood" value="Sad" />
            <label for="one">Sad</label>
            <input type="radio" id="struggling" name="mood" value="Struggling" />
            <label for="two">Struggling</label>
            <input type="radio" id="ok" name="mood" value="OK" />
            <label for="three">OK</label>
            <input type="radio" id="good" name="mood" value="Good" />
            <label for="four">Good</label>
            <input type="radio" id="excited" name="mood" value="Excited" />
            <label for="five">Excited</label>
          </div>
        </div>
      </div>
    </fieldset>
  </div>
    `
  },
  // function that will be called to clear the form after save click
  clearForm: () => {
    document.querySelector("#title").value = ""
    document.querySelector("#content").value = ""
    document.querySelector("#date").value = ""
    document.querySelector("#mood").value = ""
  },

  formatUserInput: () => {
    const title = document.querySelector("#title").value
    const content = document.querySelector("#content").value
    const date = document.querySelector("#date").value
    const moodID = document.querySelector("#mood").value
    const journalEntryToSave = {
      date: date,
      title: title,
      content: content,
      moodID: moodID
    }
    return journalEntryToSave
  }
}

export { formManager }