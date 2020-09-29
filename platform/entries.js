var entryMap = new Map();
var match;

function buildEntryMap() {
  addEntry(new KeyBot());
  addEntry(new CircleBot());
  addEntry(new KeyBot2());
  addEntry(new RudeBot());
  addEntry(new CloseBot());
  addEntry(new LearnBot());
  addEntry(new SquareBot());
  addEntry(new SteveBot());
  addEntry(new Roomba());
  addEntry(new MattBot());
  let leftEntryChoice = createSelect();
  let rightEntryChoice = createSelect();
  match = new Match(leftEntryChoice, rightEntryChoice);
  return [leftEntryChoice, rightEntryChoice];
}

class Match {
  constructor(leftEntryChoice, rightEntryChoice) {
    this.leftEntryChoice = leftEntryChoice;
    this.rightEntryChoice = rightEntryChoice;
    this.populateChoice(this.leftEntryChoice);
    this.populateChoice(this.rightEntryChoice);
    this.setToOtherValue(rightEntryChoice, leftEntryChoice);
    this.leftEntryChoice.changed(this.handleChange.bind(this));
    this.rightEntryChoice.changed(this.handleChange.bind(this));
  }

  /**
   * 
   * @param {number} i
   * @returns {RobotContainer} 
   */
  getEntry(i) {
    if (i == 0) {
      return entryMap.get(this.leftEntryChoice.value());
    } else {
      return entryMap.get(this.rightEntryChoice.value());
    }
  }

  remove() {
    leftEntryChoice.remove();
    rightEntryChoice.remove();
  }

  /**
   * 
   * @param {Element} choice 
   */
  populateChoice(choice) {
    for (let label of entryMap.keys()) {
      choice.option(label);
    }
    choice.tabindex = "-1";
  }

  setToOtherValue(choiceToChange, choiceToKeep) {
    for (let label of entryMap.keys()) {
      if (label != choiceToKeep.value()) {
        choiceToChange.elt.value = label;
        break;
      }
    }
  }

  /**
   * 
   * @param {Event} e 
   */
  handleChange(e) {
    console.log("Change");
    if (this.leftEntryChoice.value() == this.rightEntryChoice.value()) {
      console.log("Same");
      if (leftEntryChoice.elt == e.target) {
        this.setToOtherValue(rightEntryChoice, leftEntryChoice);
      } else {
        this.setToOtherValue(leftEntryChoice, rightEntryChoice);
      }
    }
  }
}
