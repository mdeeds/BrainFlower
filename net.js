
class SvgContext {
    constructor(svg) {
        this.svg = svg;
        this.stroke = "black";
        this.fill = "white";
    }
    line(parent, x1, y1, x2, y2) {
        let l = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line");
        l.setAttribute('x1', x1);
        l.setAttribute('y1', y1);
        l.setAttribute('x2', x2);
        l.setAttribute('y2', y2);
        l.setAttribute('stroke', this.stroke);
        parent.appendChild(l);
        return l;
    }

    circle(parent, cx, cy, r) {
        let c = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle");
        c.setAttribute('cx', cx);
        c.setAttribute('cy', cy);
        c.setAttribute('r', r);
        c.setAttribute('stroke', this.stroke);
        c.setAttribute('fill', this.fill);
        parent.appendChild(c);
        return c;
    }

    setFillForWeight(weight) {
        if (weight > 2.0) {
            this.fill = "#000";
            this.stroke = "#000"
        } else if (weight < -2.0) {
            this.fill = "#fff";
            this.stroke = "#000"
        } else {
            let a = 255 * (Math.abs(weight) / 2.0);
            // let b = 255 * (-weight / 4.0 + 0.5);
            let b = (weight > 0) ? 255 : 0;
            let ch = Math.round(b).toString(16);
            let cha = Math.round(a).toString(16);
            this.fill = "#" + ch + ch + ch + cha;
            this.stroke = "#000000" + cha;
        }
    }

    renderWeights1(parent, weights, offsetX) {
        let shape = weights.shape;
        let data = weights.val.dataSync();
        console.log(shape);

        this.stroke = "#000";
        this.line(parent, offsetX + 30, 0,
          offsetX + 30, shape[0] * 15 + 15);

        let i = 0;
        for (let d0 = 0; d0 < shape[0]; ++d0) {
            this.setFillForWeight(data[i]);
            let c = this.circle(parent, offsetX + 30, d0 * 15 + 30  , 5);
            c.setAttribute("weight", data[i]);
            ++i;
        }
        return 60;
    }

    renderWeights2(parent, weights, offsetX) {
        let shape = weights.shape;
        let data = weights.val.dataSync();
        console.log(shape);

        this.stroke = "#000";
        for (let i = 0; i < shape[0]; ++i) {
            this.line(parent, i * 15 + 30, 0, 
              i*15+30, shape[1] * 15 + 15);
        }

        for (let i = 0; i < shape[1]; ++i) {
            this.line(parent, 30, i * 15 + 30,
              shape[0] * 15 + 60, i*15+30);
        }

        let i = 0;
        for (let d0 = 0; d0 < shape[0]; ++d0) {
            for (let d1 = 0; d1 < shape[1]; ++d1) {
                this.setFillForWeight(data[i]);
                let c = this.circle(parent, 
                offsetX + d0 * 15 + 30, d1 * 15 + 30  , 5);
                c.setAttribute("weight", data[i]);
                ++i;
            }
        }
        return shape[0] * 15 + 5;
    }

    renderWeights(parent, weights, offsetX) {
        if (weights.shape.length == 1) {
            return this.renderWeights1(parent, weights, offsetX);
        } else if (weights.shape.length == 2) {
            return this.renderWeights2(parent, weights, offsetX);
        }
    }

    renderModel(model) {
        this.svg.innerHTML = "";
        let x = 0;
        let lastName = "";
        let g;
        let offsetX = 0;
        for (let w of model.weights) {
            let namePrefix = w.name.split("/")[0];
            if (namePrefix != lastName) {
                lastName = namePrefix;
                offsetX = 0;
                g = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "g");
                g.setAttribute("transform",
                    "translate(" + x + " 200)" +
                    "rotate(-45 0 0) ");
                x += 250;
            }
            this.svg.appendChild(g);
            let width = this.renderWeights(g, w, offsetX);
            offsetX += width;
        }
    }
}

function getModel() {
    let model = tf.sequential();
    model.add(tf.layers.dense({
        inputShape: [9], units: 4, activation: 'tanh'
    }));
    model.add(tf.layers.dense({
        units: 1, activation: 'linear'
    }));

    model.compile({
        optimizer: 'sgd',
        loss: 'meanSquaredError'
       });
    return model;
}

function setup() {
    let body = document.getElementById("body");

    let svg = document.createElementNS(
        "http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("width", 800);
    svg.setAttribute("height", 800);
    svg.setAttribute("viewbox", "0 0 100 100")
    body.appendChild(svg);

    let ctx = new SvgContext(svg);

    let model = getModel();
    ctx.renderModel(model);

    tf.io.listModels().then(models => {
        for (let m of Object.keys(models)) {
            console.log(m);
            let div = document.createElement("div");
            div.innerText = m;
            body.appendChild(div);   
            div.addEventListener("click",
              function(e) {
tf.loadLayersModel(m)
.then(model => {
                  ctx.renderModel(model);
});
        }.bind(ctx, m));
        }
    });
    
        
}

function draw() {
    background(color("Orchid"));
}