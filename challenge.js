class Challenge {
  constructor(path, readyCallback) {
    this.readyCallback = readyCallback;
    var client = new XMLHttpRequest();
    client.open('GET', path);
    client.onreadystatechange = () => {
      if (client.readyState === XMLHttpRequest.DONE) {
        this.setFromString(client.responseText);
      }
    }
    client.send();
  }

  parseObjectFromString(data) {
    let result = {};
    const lines = data.split("\n");
    let identifier = "";
    let value = "";
    const idRegex = /^([a-z]+)\:$/;

    for (let l of lines) {
      const line = l.trimEnd();
      const m = line.match(idRegex);
      if (m && m.length > 0) {
        if (identifier != "") {
          result[identifier] = value;
          value = "";
        }
        identifier = m[1];
        console.log(identifier);
      } else {
        value += line + "\n";
      }
    }
    if (identifier) {
      result[identifier] = value;
    }
    return result;
  }

  setFromString(data) {
    const o = this.parseObjectFromString(data);
    if (o.flowers) {
      this.flowers = JSON.parse(o.flowers);
    } else {
      this.flowers = [];
    }
    if (o.goal) {
      this.goal = parseInt(o.goal);
    } else {
      this.goal = this.flowers.length;
    }

    this.instructions = o.instructions;
    this.code = o.code;
    this.code = this.code.replace(/\(\=/g, "<span contenteditable>");
    this.code = this.code.replace(/\=\)/g, "</span>");

    this.readyCallback(this);
  }
}