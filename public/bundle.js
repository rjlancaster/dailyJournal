(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataManager = void 0;
// Code in this file deals with posting and retrieving the data from JSON.
const url = "http://localhost:3000/journalentries?_expand=mood";
const dataManager = {
  getEntries: () => {
    return fetch(`${url}`).then(res => res.json()); // .then(res => console.log(res))
  },
  saveEntry: entry => {
    return fetch(`${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(entry)
    }).then(res => res.json());
  },
  deleteEntry: id => {
    return fetch(`${url}/${id}`, {
      method: "DELETE"
    }).then(res => res.json());
  },
  editEntry: (entry, id) => {
    return fetch(`${url}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(entry)
    }).then(res => res.json());
  },
  singleEntry: id => {
    return fetch(`${url}/${id}`).then(res => res.json());
  },
  fetchMoods: () => {
    return fetch("http://localhost:3000/moods").then(res => res.json()).then(res => res);
  }
};
exports.dataManager = dataManager;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dom = void 0;

var _dataManager = require("./dataManager");

var _htmlEntry = require("./htmlEntry");

const dom = {
  domEntries: entry => {
    document.querySelector("#output").innerHTML += entry;
  },
  domMoods: entry => {
    document.querySelector("#moodOptions").innerHTML += entry;
  },
  domRender: () => {
    document.querySelector("#output").innerHTML = "";

    _dataManager.dataManager.getEntries().then(entries => {
      entries.forEach(entry => {
        const entryHtml = _htmlEntry.htmlEntry.outputEntry(entry);

        dom.domEntries(entryHtml);
      });
    });
  },
  moodRender: () => {
    _dataManager.dataManager.fetchMoods().then(moods => {
      moods.forEach(mood => {
        const moodHtml = _htmlEntry.htmlEntry.moodEntry(mood);

        console.log(moodHtml);
        dom.domMoods(moodHtml);
      });
    });
  }
};
exports.dom = dom;

},{"./dataManager":1,"./htmlEntry":5}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.edfJournal = void 0;

var _dataManager = require("./dataManager");

var _dom = require("./dom");

var _htmlEntry = require("./htmlEntry");

const edfJournal = {
  editDelete: () => {
    document.querySelector("#output").addEventListener("click", evt => {
      if (evt.target.id.startsWith("delete")) {
        const id = evt.target.id.split("!")[1];

        _dataManager.dataManager.deleteEntry(id).then(() => _dom.dom.domRender());
      }

      if (evt.target.id.startsWith("edit")) {
        const id = evt.target.id.split("!")[1];

        _dataManager.dataManager.singleEntry(id).then(entry => {
          document.querySelector("#title").value = entry.title;
          document.querySelector("#content").value = entry.content;
          document.querySelector("#date").value = entry.date;
          document.querySelector("#mood").value = entry.mood;
        });
      }
    });
  },
  filter: () => {
    const radioBtn = document.getElementsByName("mood");
    radioBtn.forEach(button => {
      button.addEventListener("click", e => {
        for (let i = 0; i < radioBtn.length; i++) {
          if (radioBtn[i].value === e.target.value) {
            let radioBtnClicked = radioBtn[i].value;
            output.innerHTML = "";

            _dataManager.dataManager.getEntries().then(entries => entries.filter(entry => entry.mood.label === radioBtnClicked)).then(entries => {
              entries.forEach(entry => {
                let entryHtml = _htmlEntry.htmlEntry.outputEntry(entry);

                document.querySelector("#output").innerHTML += entryHtml;
              });
            });
          }
        }
      });
    });
  }
};
exports.edfJournal = edfJournal;

},{"./dataManager":1,"./dom":2,"./htmlEntry":5}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formManager = void 0;
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
    `;
  },
  // function that will be called to clear the form after save click
  clearForm: () => {
    document.querySelector("#title").value = "";
    document.querySelector("#content").value = "";
    document.querySelector("#date").value = "";
    document.querySelector("#mood").value = "";
  },
  formatUserInput: () => {
    const title = document.querySelector("#title").value;
    const content = document.querySelector("#content").value;
    const date = document.querySelector("#date").value;
    const mood = document.querySelector("#mood").value;
    const journalEntryToSave = {
      date: date,
      title: title,
      content: content,
      mood: mood
    };
    return journalEntryToSave;
  }
};
exports.formManager = formManager;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.htmlEntry = void 0;
// Create function to populate JSON details into HTML format.
const htmlEntry = {
  outputEntry: entry => {
    return `
  <div class="dayEntry">
  <h3>${entry.date}</h3>
  <p>Subject matter is... ${entry.title}</p>
  <p>${entry.content}</p>
  <p>Mood for the day: ${entry.mood.label}</p>
  <button class = "btn btn-light btn-sm" id="edit!${entry.id}">Edit</button>
  <button class = "btn btn-light btn-sm" id="delete!${entry.id}">Delete</button>
  </div>
  `;
  },
  moodEntry: entry => {
    return `
    <option value=${entry.label}>${entry.label}</option>
    `;
  }
};
exports.htmlEntry = htmlEntry;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.journal = void 0;

var _formManager = require("./formManager");

var _dom = require("./dom");

var _saveJournal = require("./saveJournal");

var _edfJournal = require("./edfJournal");

const journal = () => {
  // inserts input form to #input div in DOM
  document.querySelector("#input").innerHTML = _formManager.formManager.htmlForm(); //loads JSON array to DOM on window load

  _dom.dom.domRender();

  _dom.dom.moodRender(); // function for saveBtn click event, save to JSON, clear output div and reloads JSON array to DOM


  (0, _saveJournal.saveJournal)(); // function for edit and delete buttons

  _edfJournal.edfJournal.editDelete(); // function for mood filter


  _edfJournal.edfJournal.filter();
};

exports.journal = journal;

},{"./dom":2,"./edfJournal":3,"./formManager":4,"./saveJournal":8}],7:[function(require,module,exports){
"use strict";

var _journal = require("./journal");

var _dataManager = require("./dataManager");

// loads journal div to DOM
(0, _journal.journal)();

_dataManager.dataManager.getEntries();

},{"./dataManager":1,"./journal":6}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveJournal = void 0;

var _dataManager = require("./dataManager");

var _formManager = require("./formManager");

var _dom = require("./dom");

const saveJournal = () => {
  document.querySelector("#saveBtn").addEventListener("click", () => {
    const title = document.querySelector("#title").value;
    const content = document.querySelector("#content").value;
    const date = document.querySelector("#date").value;
    const mood = document.querySelector("#mood").value;

    if (!title || !content || !date || !mood) {
      alert("Please fill all entries in form");
    } else {
      _dataManager.dataManager.saveEntry(_formManager.formManager.formatUserInput()).then(() => {
        _formManager.formManager.clearForm();

        _dom.dom.domRender();
      });
    }
  });
};

exports.saveJournal = saveJournal;

},{"./dataManager":1,"./dom":2,"./formManager":4}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL2RhdGFNYW5hZ2VyLmpzIiwiLi4vc2NyaXB0cy9kb20uanMiLCIuLi9zY3JpcHRzL2VkZkpvdXJuYWwuanMiLCIuLi9zY3JpcHRzL2Zvcm1NYW5hZ2VyLmpzIiwiLi4vc2NyaXB0cy9odG1sRW50cnkuanMiLCIuLi9zY3JpcHRzL2pvdXJuYWwuanMiLCIuLi9zY3JpcHRzL21haW4uanMiLCIuLi9zY3JpcHRzL3NhdmVKb3VybmFsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FDQUE7QUFFQSxNQUFNLEdBQUcsR0FBRyxtREFBWjtBQUVBLE1BQU0sV0FBVyxHQUFHO0FBQ2xCLEVBQUEsVUFBVSxFQUFFLE1BQU07QUFDaEIsV0FBTyxLQUFLLENBQUUsR0FBRSxHQUFJLEVBQVIsQ0FBTCxDQUNKLElBREksQ0FDQyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUosRUFEUixDQUFQLENBRGdCLENBR2Q7QUFDSCxHQUxpQjtBQU1sQixFQUFBLFNBQVMsRUFBRyxLQUFELElBQVc7QUFDcEIsV0FBTyxLQUFLLENBQUUsR0FBRSxHQUFJLEVBQVIsRUFBVztBQUNyQixNQUFBLE1BQU0sRUFBRSxNQURhO0FBRXJCLE1BQUEsT0FBTyxFQUFFO0FBQ1Asd0JBQWdCO0FBRFQsT0FGWTtBQUtyQixNQUFBLElBQUksRUFBRSxJQUFJLENBQUMsU0FBTCxDQUFlLEtBQWY7QUFMZSxLQUFYLENBQUwsQ0FNSixJQU5JLENBTUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFKLEVBTlIsQ0FBUDtBQU9ELEdBZGlCO0FBZWxCLEVBQUEsV0FBVyxFQUFHLEVBQUQsSUFBUTtBQUNuQixXQUFPLEtBQUssQ0FBRSxHQUFFLEdBQUksSUFBRyxFQUFHLEVBQWQsRUFBaUI7QUFDM0IsTUFBQSxNQUFNLEVBQUU7QUFEbUIsS0FBakIsQ0FBTCxDQUVKLElBRkksQ0FFQyxHQUFHLElBQUks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TG9CLENBTXBCOzs7QUFDQSxrQ0FQb0IsQ0FRcEI7O0FBQ0EseUJBQVcsVUFBWCxHQVRvQixDQVVwQjs7O0FBQ0EseUJBQVcsTUFBWDtBQUVELENBYkQ7Ozs7Ozs7QUNMQTs7QUFDQTs7QUFDQTtBQUNBOztBQUVBLHlCQUFZLFVBQVo7Ozs7Ozs7Ozs7QUNMQTs7QUFDQTs7QUFDQTs7QUFFQSxNQUFNLFdBQVcsR0FBRyxNQUFNO0FBQ3hCLEVBQUEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsVUFBdkIsRUFBbUMsZ0JBQW5DLENBQW9ELE9BQXBELEVBQTZELE1BQU07QUFDakUsVUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsUUFBdkIsRUFBaUMsS0FBL0M7QUFDQSxVQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixVQUF2QixFQUFtQyxLQUFuRDtBQUNBLFVBQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLE9BQXZCLEVBQWdDLEtBQTdDO0FBQ0EsVUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsT0FBdkIsRUFBZ0MsS0FBN0M7O0FBQ0EsUUFBSSxDQUFDLEtBQUQsSUFBVSxDQUFDLE9BQVgsSUFBc0IsQ0FBQyxJQUF2QixJQUErQixDQUFDLElBQXBDLEVBQTBDO0FBQ3hDLE1BQUEsS0FBSyxDQUFDLGlDQUFELENBQUw7QUFDRCxLQUZELE1BRU87QUFDTCwrQkFBWSxTQUFaLENBQXNCLHlCQUFZLGVBQVosRUFBdEIsRUFDRyxJQURILENBQ1EsTUFBTTtBQUNWLGlDQUFZLFNBQVo7O0FBQ0EsaUJBQUksU0FBSjtBQUNELE9BSkg7QUFLRDtBQUNGLEdBZEQ7QUFlRCxDQWhCRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vIENvZGUgaW4gdGhpcyBmaWxlIGRlYWxzIHdpdGggcG9zdGluZyBhbmQgcmV0cmlldmluZyB0aGUgZGF0YSBmcm9tIEpTT04uXG5cbmNvbnN0IHVybCA9IFwiaHR0cDovL2xvY2FsaG9zdDozMDAwL2pvdXJuYWxlbnRyaWVzP19leHBhbmQ9bW9vZFwiXG5cbmNvbnN0IGRhdGFNYW5hZ2VyID0ge1xuICBnZXRFbnRyaWVzOiAoKSA9PiB7XG4gICAgcmV0dXJuIGZldGNoKGAke3VybH1gKVxuICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgICAvLyAudGhlbihyZXMgPT4gY29uc29sZS5sb2cocmVzKSlcbiAgfSxcbiAgc2F2ZUVudHJ5OiAoZW50cnkpID0+IHtcbiAgICByZXR1cm4gZmV0Y2goYCR7dXJsfWAsIHtcbiAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiXG4gICAgICB9LFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZW50cnkpXG4gICAgfSkudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgfSxcbiAgZGVsZXRlRW50cnk6IChpZCkgPT4ge1xuICAgIHJldHVybiBmZXRjaChgJHt1cmx9LyR7aWR9YCwge1xuICAgICAgbWV0aG9kOiBcIkRFTEVURVwiXG4gICAgfSkudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgfSxcbiAgZWRpdEVudHJ5OiAoZW50cnksIGlkKSA9PiB7XG4gICAgcmV0dXJuIGZldGNoKGAke3VybH0vJHtpZH1gLCB7XG4gICAgICBtZXRob2Q6IFwiUFVUXCIsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiXG4gICAgICB9LFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZW50cnkpXG4gICAgfSkudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgfSxcbiAgc2luZ2xlRW50cnk6IChpZCkgPT4ge1xuICAgIHJldHVybiBmZXRjaChgJHt1cmx9LyR7aWR9YClcbiAgICAgIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICB9LFxuICBmZXRjaE1vb2RzOiAoKSA9PiB7XG4gICAgcmV0dXJuIGZldGNoKFwiaHR0cDovL2xvY2FsaG9zdDozMDAwL21vb2RzXCIpXG4gICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAgIC50aGVuKHJlcyA9PiByZXMpXG4gIH1cbn1cblxuZXhwb3J0IHsgZGF0YU1hbmFnZXIgfVxuIiwiaW1wb3J0IHsgZGF0YU1hbmFnZXIgfSBmcm9tIFwiLi9kYXRhTWFuYWdlclwiXG5pbXBvcnQgeyBodG1sRW50cnkgfSBmcm9tIFwiLi9odG1sRW50cnlcIlxuXG5jb25zdCBkb20gPSB7XG4gIGRvbUVudHJpZXM6IChlbnRyeSkgPT4ge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjb3V0cHV0XCIpLmlubmVySFRNTCArPSBlbnRyeVxuICB9LFxuXG4gIGRvbU1vb2RzOiAoZW50cnkpID0+IHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21vb2RPcHRpb25zXCIpLmlubmVySFRNTCArPSBlbnRyeVxuICB9LFxuXG4gIGRvbVJlbmRlcjogKCkgPT4ge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjb3V0cHV0XCIpLmlubmVySFRNTCA9IFwiXCJcbiAgICBkYXRhTWFuYWdlci5nZXRFbnRyaWVzKClcbiAgICAgIC50aGVuKGVudHJpZXMgPT4ge1xuICAgICAgICBlbnRyaWVzLmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgICAgIGNvbnN0IGVudHJ5SHRtbCA9IGh0bWxFbnRyeS5vdXRwdXRFbnRyeShlbnRyeSlcbiAgICAgICAgICBkb20uZG9tRW50cmllcyhlbnRyeUh0bWwpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICB9LFxuXG4gIG1vb2RSZW5kZXI6ICgpID0+IHtcbiAgICBkYXRhTWFuYWdlci5mZXRjaE1vb2RzKClcbiAgICAgIC50aGVuKG1vb2RzID0+IHtcbiAgICAgICAgbW9vZHMuZm9yRWFjaChtb29kID0+IHtcbiAgICAgICAgICBjb25zdCBtb29kSHRtbCA9IGh0bWxFbnRyeS5tb29kRW50cnkobW9vZClcbiAgICAgICAgICBjb25zb2xlLmxvZyhtb29kSHRtbClcbiAgICAgICAgICBkb20uZG9tTW9vZHMobW9vZEh0bWwpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICB9XG59XG5cbmV4cG9ydCB7IGRvbSB9IiwiaW1wb3J0IHsgZGF0YU1hbmFnZXIgfSBmcm9tIFwiLi9kYXRhTWFuYWdlclwiXG5pbXBvcnQgeyBkb20gfSBmcm9tIFwiLi9kb21cIlxuaW1wb3J0IHsgaHRtbEVudHJ5IH0gZnJvbSBcIi4vaHRtbEVudHJ5XCJcblxuY29uc3QgZWRmSm91cm5hbCA9IHtcblxuICBlZGl0RGVsZXRlOiAoKSA9PiB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNvdXRwdXRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2dCA9PiB7XG4gICAgICBpZiAoZXZ0LnRhcmdldC5pZC5zdGFydHNXaXRoKFwiZGVsZXRlXCIpKSB7XG4gICAgICAgIGNvbnN0IGlkID0gZXZ0LnRhcmdldC5pZC5zcGxpdChcIiFcIilbMV1cbiAgICAgICAgZGF0YU1hbmFnZXIuZGVsZXRlRW50cnkoaWQpLnRoZW4oKCkgPT4gZG9tLmRvbVJlbmRlcigpKVxuICAgICAgfVxuICAgICAgaWYgKGV2dC50YXJnZXQuaWQuc3RhcnRzV2l0aChcImVkaXRcIikpIHtcbiAgICAgICAgY29uc3QgaWQgPSBldnQudGFyZ2V0LmlkLnNwbGl0KFwiIVwiKVsxXVxuICAgICAgICBkYXRhTWFuYWdlci5zaW5nbGVFbnRyeShpZCkudGhlbigoZW50cnkpID0+IHtcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3RpdGxlXCIpLnZhbHVlID0gZW50cnkudGl0bGVcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRlbnRcIikudmFsdWUgPSBlbnRyeS5jb250ZW50XG4gICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNkYXRlXCIpLnZhbHVlID0gZW50cnkuZGF0ZVxuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbW9vZFwiKS52YWx1ZSA9IGVudHJ5Lm1vb2RcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuXG4gIGZpbHRlcjogKCkgPT4ge1xuICAgIGNvbnN0IHJhZGlvQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoXCJtb29kXCIpXG4gICAgcmFkaW9CdG4uZm9yRWFjaChidXR0b24gPT4ge1xuICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhZGlvQnRuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHJhZGlvQnRuW2ldLnZhbHVlID09PSBlLnRhcmdldC52YWx1ZSkge1xuICAgICAgICAgICAgbGV0IHJhZGlvQnRuQ2xpY2tlZCA9IHJhZGlvQnRuW2ldLnZhbHVlXG4gICAgICAgICAgICBvdXRwdXQuaW5uZXJIVE1MID0gXCJcIlxuICAgICAgICAgICAgZGF0YU1hbmFnZXIuZ2V0RW50cmllcygpXG4gICAgICAgICAgICAgIC50aGVuKGVudHJpZXMgPT5cbiAgICAgICAgICAgICAgICBlbnRyaWVzLmZpbHRlcihlbnRyeSA9PiBlbnRyeS5tb29kLmxhYmVsID09PSByYWRpb0J0bkNsaWNrZWQpKVxuICAgICAgICAgICAgICAudGhlbihlbnRyaWVzID0+IHtcbiAgICAgICAgICAgICAgICBlbnRyaWVzLmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgICAgICAgICAgICAgbGV0IGVudHJ5SHRtbCA9IGh0bWxFbnRyeS5vdXRwdXRFbnRyeShlbnRyeSlcbiAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjb3V0cHV0XCIpLmlubmVySFRNTCArPSBlbnRyeUh0bWxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG59XG5cbmV4cG9ydCB7IGVkZkpvdXJuYWwgfSIsImNvbnN0IGZvcm1NYW5hZ2VyID0ge1xuICAvLyBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIHRvIHJlcHJlc2VudCBIVE1MIG9uIG1haW4gcGFnZVxuICBodG1sRm9ybTogKCkgPT4ge1xuICAgIHJldHVybiBgXG4gICAgPGRpdiBjbGFzcz1cImpvdXJuYWxcIj5cbiAgICA8ZmllbGRzZXQgY2xhc3M9XCJqb3VybmFsQm94XCI+XG4gICAgICA8bGFiZWwgY2xhc3M9XCJqb3VybmFsSW5wdXRzXCIgZm9yPVwiZGF0ZVwiPkRhdGUgb2YgRW50cnlcbiAgICAgICAgPGlucHV0IHR5cGU9XCJkYXRlXCIgbmFtZT1cIkRhdGVcIiBpZD1cImRhdGVcIj48L2xhYmVsPlxuICAgICAgPGxhYmVsIGNsYXNzPVwiam91cm5hbElucHV0c1wiIGZvcj1cInRpdGxlXCI+Q29uY2VwdCBDb3ZlcmVkXG4gICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJ0aXRsZVwiIGlkPVwidGl0bGVcIiBwbGFjZWhvbGRlcj1cIldoYXQgY29uY2VwdCBhcmUgeW91IGNvdmVyaW5nIHRvZGF5P1wiPjwvbGFiZWw+XG4gICAgICA8bGFiZWwgY2xhc3M9XCJqb3VybmFsSW5wdXRzXCIgZm9yPVwiY29udGVudFwiPkpvdXJuYWwgRW50cnlcbiAgICAgICAgPHRleHRhcmVhIHJvd3M9XCIzXCIgY29sdW1ucz1cIjQwXCIgbmFtZT1cImNvbnRlbnRcIiBpZD1cImNvbnRlbnRcIiBwbGFjZWhvbGRlcj1cIlRlbGwgbWUgd2hhdCdzIG9uIHlvdXIgbWluZFwiPjwvdGV4dGFyZWE+PC9sYWJlbD5cbiAgICAgIDxsYWJlbCBjbGFzcz1cImpvdXJuYWxJbnB1dHNcIiBmb3I9XCJtb29kXCI+TW9vZCBmb3IgdGhlIERheVxuICAgICAgICA8c2VsZWN0IGlkPVwibW9vZE9wdGlvbnNcIj48L3NlbGVjdD48L2xhYmVsPlxuICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWxpZ2h0IGJ0bi1zbVwiIGlkPVwic2F2ZUJ0blwiPlJlY29yZCBKb3VybmFsIEVudHJ5PC9idXR0b24+XG4gICAgICA8ZGl2PlxuICAgICAgICA8bGVnZW5kPkZpbHRlciBFbnRyaWVzIGJ5IE1vb2Q8L2xlZ2VuZD5cbiAgICAgICAgPGRpdiBpZD1cIm1vb2RGaWx0ZXJzXCI+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBpZD1cInNhZFwiIG5hbWU9XCJtb29kXCIgdmFsdWU9XCJTYWRcIiAvPlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cIm9uZVwiPlNhZDwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgaWQ9XCJzdHJ1Z2dsaW5nXCIgbmFtZT1cIm1vb2RcIiB2YWx1ZT1cIlN0cnVnZ2xpbmdcIiAvPlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cInR3b1wiPlN0cnVnZ2xpbmc8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIGlkPVwib2tcIiBuYW1lPVwibW9vZFwiIHZhbHVlPVwiT0tcIiAvPlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cInRocmVlXCI+T0s8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIGlkPVwiZ29vZFwiIG5hbWU9XCJtb29kXCIgdmFsdWU9XCJHb29kXCIgLz5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJmb3VyXCI+R29vZDwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgaWQ9XCJleGNpdGVkXCIgbmFtZT1cIm1vb2RcIiB2YWx1ZT1cIkV4Y2l0ZWRcIiAvPlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cImZpdmVcIj5FeGNpdGVkPC9sYWJlbD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2ZpZWxkc2V0PlxuICA8L2Rpdj5cbiAgICBgXG4gIH0sXG4gIC8vIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsZWQgdG8gY2xlYXIgdGhlIGZvcm0gYWZ0ZXIgc2F2ZSBjbGlja1xuICBjbGVhckZvcm06ICgpID0+IHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3RpdGxlXCIpLnZhbHVlID0gXCJcIlxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29udGVudFwiKS52YWx1ZSA9IFwiXCJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2RhdGVcIikudmFsdWUgPSBcIlwiXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtb29kXCIpLnZhbHVlID0gXCJcIlxuICB9LFxuXG4gIGZvcm1hdFVzZXJJbnB1dDogKCkgPT4ge1xuICAgIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0aXRsZVwiKS52YWx1ZVxuICAgIGNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRlbnRcIikudmFsdWVcbiAgICBjb25zdCBkYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNkYXRlXCIpLnZhbHVlXG4gICAgY29uc3QgbW9vZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbW9vZFwiKS52YWx1ZVxuICAgIGNvbnN0IGpvdXJuYWxFbnRyeVRvU2F2ZSA9IHtcbiAgICAgIGRhdGU6IGRhdGUsXG4gICAgICB0aXRsZTogdGl0bGUsXG4gICAgICBjb250ZW50OiBjb250ZW50LFxuICAgICAgbW9vZDogbW9vZFxuICAgIH1cbiAgICByZXR1cm4gam91cm5hbEVudHJ5VG9TYXZlXG4gIH1cbn1cblxuZXhwb3J0IHsgZm9ybU1hbmFnZXIgfSIsIi8vIENyZWF0ZSBmdW5jdGlvbiB0byBwb3B1bGF0ZSBKU09OIGRldGFpbHMgaW50byBIVE1MIGZvcm1hdC5cbmNvbnN0IGh0bWxFbnRyeSA9IHtcblxuICBvdXRwdXRFbnRyeTogKGVudHJ5KSA9PiB7XG4gICAgcmV0dXJuIGBcbiAgPGRpdiBjbGFzcz1cImRheUVudHJ5XCI+XG4gIDxoMz4ke2VudHJ5LmRhdGV9PC9oMz5cbiAgPHA+U3ViamVjdCBtYXR0ZXIgaXMuLi4gJHtlbnRyeS50aXRsZX08L3A+XG4gIDxwPiR7ZW50cnkuY29udGVudH08L3A+XG4gIDxwPk1vb2QgZm9yIHRoZSBkYXk6ICR7ZW50cnkubW9vZC5sYWJlbH08L3A+XG4gIDxidXR0b24gY2xhc3MgPSBcImJ0biBidG4tbGlnaHQgYnRuLXNtXCIgaWQ9XCJlZGl0ISR7ZW50cnkuaWR9XCI+RWRpdDwvYnV0dG9uPlxuICA8YnV0dG9uIGNsYXNzID0gXCJidG4gYnRuLWxpZ2h0IGJ0bi1zbVwiIGlkPVwiZGVsZXRlISR7ZW50cnkuaWR9XCI+RGVsZXRlPC9idXR0b24+XG4gIDwvZGl2PlxuICBgXG4gIH0sXG5cbiAgbW9vZEVudHJ5OiAoZW50cnkpID0+IHtcbiAgICByZXR1cm4gYFxuICAgIDxvcHRpb24gdmFsdWU9JHtlbnRyeS5sYWJlbH0+JHtlbnRyeS5sYWJlbH08L29wdGlvbj5cbiAgICBgXG4gIH1cbn1cblxuZXhwb3J0IHsgaHRtbEVudHJ5IH0iLCJpbXBvcnQgeyBmb3JtTWFuYWdlciB9IGZyb20gXCIuL2Zvcm1NYW5hZ2VyXCJcbmltcG9ydCB7IGRvbSB9IGZyb20gXCIuL2RvbVwiXG5pbXBvcnQgeyBzYXZlSm91cm5hbCB9IGZyb20gXCIuL3NhdmVKb3VybmFsXCJcbmltcG9ydCB7IGVkZkpvdXJuYWwgfSBmcm9tIFwiLi9lZGZKb3VybmFsXCJcblxuY29uc3Qgam91cm5hbCA9ICgpID0+IHtcbiAgLy8gaW5zZXJ0cyBpbnB1dCBmb3JtIHRvICNpbnB1dCBkaXYgaW4gRE9NXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjaW5wdXRcIikuaW5uZXJIVE1MID0gZm9ybU1hbmFnZXIuaHRtbEZvcm0oKVxuICAvL2xvYWRzIEpTT04gYXJyYXkgdG8gRE9NIG9uIHdpbmRvdyBsb2FkXG4gIGRvbS5kb21SZW5kZXIoKVxuICBkb20ubW9vZFJlbmRlcigpXG4gIC8vIGZ1bmN0aW9uIGZvciBzYXZlQnRuIGNsaWNrIGV2ZW50LCBzYXZlIHRvIEpTT04sIGNsZWFyIG91dHB1dCBkaXYgYW5kIHJlbG9hZHMgSlNPTiBhcnJheSB0byBET01cbiAgc2F2ZUpvdXJuYWwoKVxuICAvLyBmdW5jdGlvbiBmb3IgZWRpdCBhbmQgZGVsZXRlIGJ1dHRvbnNcbiAgZWRmSm91cm5hbC5lZGl0RGVsZXRlKClcbiAgLy8gZnVuY3Rpb24gZm9yIG1vb2QgZmlsdGVyXG4gIGVkZkpvdXJuYWwuZmlsdGVyKClcblxufVxuXG5cbmV4cG9ydCB7IGpvdXJuYWwgfSIsImltcG9ydCB7IGpvdXJuYWwgfSBmcm9tIFwiLi9qb3VybmFsXCJcbmltcG9ydCB7IGRhdGFNYW5hZ2VyIH0gZnJvbSBcIi4vZGF0YU1hbmFnZXJcIlxuLy8gbG9hZHMgam91cm5hbCBkaXYgdG8gRE9NXG5qb3VybmFsKCk7XG5cbmRhdGFNYW5hZ2VyLmdldEVudHJpZXMoKSIsImltcG9ydCB7IGRhdGFNYW5hZ2VyIH0gZnJvbSBcIi4vZGF0YU1hbmFnZXJcIlxuaW1wb3J0IHsgZm9ybU1hbmFnZXIgfSBmcm9tIFwiLi9mb3JtTWFuYWdlclwiXG5pbXBvcnQgeyBkb20gfSBmcm9tIFwiLi9kb21cIlxuXG5jb25zdCBzYXZlSm91cm5hbCA9ICgpID0+IHtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzYXZlQnRuXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3RpdGxlXCIpLnZhbHVlXG4gICAgY29uc3QgY29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29udGVudFwiKS52YWx1ZVxuICAgIGNvbnN0IGRhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2RhdGVcIikudmFsdWVcbiAgICBjb25zdCBtb29kID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtb29kXCIpLnZhbHVlXG4gICAgaWYgKCF0aXRsZSB8fCAhY29udGVudCB8fCAhZGF0ZSB8fCAhbW9vZCkge1xuICAgICAgYWxlcnQoXCJQbGVhc2UgZmlsbCBhbGwgZW50cmllcyBpbiBmb3JtXCIpXG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGFNYW5hZ2VyLnNhdmVFbnRyeShmb3JtTWFuYWdlci5mb3JtYXRVc2VySW5wdXQoKSlcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGZvcm1NYW5hZ2VyLmNsZWFyRm9ybSgpXG4gICAgICAgICAgZG9tLmRvbVJlbmRlcigpXG4gICAgICAgIH0pXG4gICAgfVxuICB9KVxufVxuXG5leHBvcnQgeyBzYXZlSm91cm5hbCB9Il19
