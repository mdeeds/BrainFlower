var entryMap = new Map();
var match;

function robotName(robot) {
  return robot.name || robot.constructor.name;
}

function addEntry(robot) {
  let name = robotName(robot);
  entryMap.set(name, robot);
}

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
  addEntry(new monsterbot());
  addEntry(new Mooo());
  addEntry(new Kili());
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
    this.leftEntryChoice.remove();
    this.rightEntryChoice.remove();
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
    console.log("Changed to " + this.leftEntryChoice.value() + " and " +this.rightEntryChoice.value());
    if (this.leftEntryChoice.value() == this.rightEntryChoice.value()) {
      console.log("Same");
      if (this.leftEntryChoice.elt == e.target) {
        this.setToOtherValue(this.rightEntryChoice, this.leftEntryChoice);
      } else {
        this.setToOtherValue(this.leftEntryChoice, this.rightEntryChoice);
      }
    }
  }
}
