export class Graph {
    SCREENWIDTH = window.screen.width;
    constructor(c) {
        this.dimenstion = {
            height: ((this.SCREENWIDTH < 1300) ? 250 : 400),
            graphHeight: ((this.SCREENWIDTH < 1300) ? 250 - 20 : 400 - 20),
            barwidth: 0
        };
        this.xoffset = {
            left: 100,
            right: 30
        };
        this.c = c;
        this.isMobile = this.SCREENWIDTH < 1300;
        this.graphdata = [];
        this.graphdates = [];
        this.preddates = [];
        this.stocknames = [];
        this.graphdots = [];
        this.tooltipstocks = {};
    }

    init(data) {
        this.mergeDates(data);
        const alldots = [];
        for (let i = 0; i < data.length; i++) {
            this.graphdata.push({ data: [], pred: [] });
            this.stocknames.push(data[i][0].name);
            alldots.push(this.initGraphData(data[i], i));
        }

        return alldots.flat(1);
    }

    draw() {
        this.dimenstion = {
            height: ((window.screen.width < 1300) ? 250 : 400),
            graphHeight: ((window.screen.width < 1300) ? 250 - 20 : 400 - 20),
            barwidth: 0
        };
        this.isMobile = window.screen.width < 1300;

        this.tooltipstocks = {};
        this.dates = this.graphdates;
        let maxdata = this.mergeData();

        if (this.graphdata.length == 0) {
            maxdata = {
                max: 0
            }
        }

        // find max numberic value in data
        var max = Math.ceil(maxdata.max / 50) * 50;
        max = (max === 0) ? 50 : max;

        this.dimenstion.width = document.getElementById("graph").offsetWidth;
        this.ctx = this.c.getContext("2d");
        this.ctx.canvas.width = this.dimenstion.width;
        this.dots = [];

        // outer frame
        this.ctx.beginPath();
        this.ctx.strokeStyle = "#333";
        this.ctx.lineWidth = 0.5;
        this.ctx.strokeRect(this.xoffset.left / 2, 1, this.dimenstion.width - this.xoffset.left / 2 - this.xoffset.right, this.dimenstion.graphHeight);

        // frame lines
        const gap = (this.dimenstion.graphHeight) / 5;
        this.ctx.moveTo(this.xoffset.left / 2, gap);
        for (let i = 1; i < 5; i++) {
            this.ctx.lineTo(this.dimenstion.width - this.xoffset.right, i * gap);
            this.ctx.moveTo(this.xoffset.left / 2, (i + 1) * gap);
        }
        this.ctx.stroke();

        // y axis details
        this.ctx.beginPath();
        this.ctx.font = "12px Arial";
        this.ctx.fillStyle = "#8a8a8a";
        for (let i = 0; i < 5; i++) {
            let off = (i == 0) ? 0 : 5;
            let yval = max / 5 * (5 - i);
            this.ctx.fillText(yval, this.xoffset.left / 2 - this.ctx.measureText(yval).width - 5, 10 + gap * i - off);
        }
        this.ctx.fillText("0", this.xoffset.left / 2 - 10, this.dimenstion.graphHeight);


        // x axis details
        const graphwidth = this.dimenstion.width - this.xoffset.left / 2 - this.xoffset.right;
        const barwidth = graphwidth / this.dates.length;
        const baroffset = barwidth / 2 + this.xoffset.left / 2;
        this.dimenstion.barwidth = barwidth;
        for (let i = this.dates.length - 1; i >= 0; i--) {
            const xval = this.formatdate(this.dates[i]);
            const xposition = barwidth * (this.dates.length - i - 1) + baroffset - this.ctx.measureText(xval).width / 2;
            if ((this.isMobile && i % 3 === 0) || !this.isMobile)
                this.ctx.fillText(xval, xposition, this.dimenstion.height - 5);
        }
        this.ctx.stroke();

        this.graphdots = [];
        for (let i = 0; i < this.graphdata.length; i++) {
            if (this.graphdata[i].data.length > 0) {
                this.drawLine(baroffset, this.graphdata[i].data, max, graphwidth, barwidth, this.graphdata[i].pred, i);
                this.graphdots.push(this.dots);
                this.dots = [];
            }
        }

        this.cleanDots();
        for (let i = 1; i <= this.graphdots.length; i++) {
            this.placeGraphDots(i);
        }
        this.initTooltip();
    }

    static COLORS = {
        linecolors:
            [["#53c4ee", "#8bd6f2"],
            ["#eea353", "#f2b68b"],
            ["#e9ee53", "#eff28b"],
            ["#6e53ee", "#938bf2"],
            ["#66ee53", "#a6f28b"]]
        , graphcolor:
            ["#8bd6f257", "#f2bb8b57", "#eff28b57", "#a68bf257", "#93f28b57"]
        , horizontalcolor: {
            positive: ["#66ee53", "#a6f28b"],
            negative: ["#ee535a", "#a73237"]
        }

    }

    drawLine(baroffset, data, max, graphwidth, barwidth, pred, color) {
        var linegrad = this.ctx.createLinearGradient(baroffset, this.Y((data[0]["close"] ? data[0]["close"] : max), max), graphwidth, this.dimenstion.graphHeight);
        linegrad.addColorStop(0, Graph.COLORS.linecolors[color][0]);
        linegrad.addColorStop(1, Graph.COLORS.linecolors[color][1]);

        // graph line
        this.ctx.beginPath();
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = linegrad;
        this.ctx.moveTo(baroffset, this.Y(data[data.length - 1]["close"], max));

        let skipped = 0;
        for (let i = 0; i < data.length; i++) {

            if (data[data.length - i - 1].ispred && pred[data.length - i - 1].prediction) {
                skipped++;
            }

            if ((data[data.length - i - 1].ispred && pred[data.length - i - 1].prediction !== undefined) || !data[data.length - i - 1].ispred) {
                let xposition = barwidth * i + baroffset;
                let close = (data[data.length - i - 1].close === -1) ? max / 2 : data[data.length - i - 1].close;
                this.dots.push({
                    x: xposition, y: this.Y(close, max),
                    val: data[data.length - i - 1].close,
                    pred: pred[data.length - i - 1].prediction
                });

                if (data[data.length - i - 1].close > 0) {
                    this.ctx.lineTo(this.dots[this.dots.length - 1].x, this.dots[this.dots.length - 1].y);
                } else {
                    if (!data[data.length - i - 1].ispred)
                        this.ctx.lineTo(this.dots[this.dots.length - 1].x, this.dots[this.dots.length - 1].y);
                }
            }
        }
        this.ctx.stroke();
        this.ctx.lineTo(this.dots[this.dots.length - 1 - skipped].x, this.dimenstion.graphHeight);
        this.ctx.lineTo(baroffset, this.dimenstion.graphHeight);
        this.ctx.closePath();

        // gradient shadow
        var x1 = barwidth / 2 + this.xoffset.left, y1 = 0;
        var x2 = x1, y2 = this.dimenstion.graphHeight;
        var fillgrad = this.ctx.createLinearGradient(x1, y1, x2, y2);

        fillgrad.addColorStop(0, Graph.COLORS.graphcolor[color]);
        fillgrad.addColorStop(1, "#ffffff00");
        this.ctx.fillStyle = fillgrad;
        this.ctx.fill();
    }

    Y(val, max) {
        return this.dimenstion.graphHeight - (val / (max === 0 ? 1 : max)) * this.dimenstion.graphHeight;
    }

    mergeData() {
        const data = [];
        var max = 0;
        for (let i = 0; i < this.graphdata.length; i++) {
            for (let j = 0; j < this.graphdata[i]["data"].length; j++) {
                const d = this.graphdata[i]['data'][j];
                data.push(d);
                max = (d.close > max ? d.close : max);
            }
        }
        return {
            data: data.flat(1),
            max
        };
    }

    graphwidth() {
        return this.dimenstion.barwidth;
    }

    formatdate(fulldate) {
        const date = new Date(fulldate);
        var d = date.getDate();
        var m = date.getMonth() + 1;
        var y = date.getFullYear() - 2000;
        return (d <= 9 ? '0' + d : d) + '.' + (m <= 9 ? '0' + m : m) + '.' + y;
    }

    static externalFormatdate(fulldate) {
        const date = new Date(fulldate);
        var d = date.getDate();
        var m = date.getMonth() + 1;
        var y = date.getFullYear() - 2000;
        return (d <= 9 ? '0' + d : d) + '.' + (m <= 9 ? '0' + m : m) + '.' + y;
    }

    mergeDates = (data) => {
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                if (!this.graphdates.includes(data[i][j].date))
                    this.graphdates.push(data[i][j].date);

                if (data[i][j].prediction !== null
                    && data[i][j].close === null && !this.preddates.includes(data[i][j].date))
                    this.preddates.push(data[i][j].date);
            }
        }

        this.graphdates.sort(function (a, b) {
            return new Date(b) - new Date(a);
        });
    }

    placeGraphDots = (index) => {
        const width = this.graphwidth();
        const graphdots = this.graphdots[index - 1];
        for (let i = graphdots.length; i >= 1; i--) {
            let elementId = "point_" + index + "_" + this.graphdates[this.graphdates.length - i];
            let d = graphdots[i - 1];
            if (d.val > 0 || (d.val === -1 && d.pred !== null)) {
                document.getElementById(elementId).style.left = (width * (i - 1) + 50) + "px";
                document.getElementById(elementId).style.paddingTop = (d.y) + "px";
                document.getElementById(elementId).style.width = width + "px";
                document.getElementById(elementId).style.display = "block";

                document.getElementById(elementId).classList.remove("raise");
                document.getElementById(elementId).classList.remove("fall");

                const tipdata = {
                    date: this.graphdates[this.graphdates.length - i],
                    price: (!this.graphdata[index - 1].data[this.graphdates.length - i].ispred ? (d.val + (!isNaN(d.val) ? "$" : "")) : ""),
                    prediction: ""
                }

                if (d.pred > 0) {
                    document.getElementById(elementId).classList.add("raise");
                    tipdata.prediction = "<b>PREDICTED</b><i class='bi bi-chevron-compact-up raise'></i>";
                } else if (d.pred < 0) {
                    document.getElementById(elementId).classList.add("fall");
                    tipdata.prediction = "<b>PREDICTED</b><i class='bi bi-chevron-compact-down fall'></i>";
                }

                if (!this.tooltipstocks[tipdata.date])
                    this.tooltipstocks[tipdata.date] = "";

                this.tooltipstocks[tipdata.date] += "<div class='tooltip-stock'>";
                this.tooltipstocks[tipdata.date] += (this.stocknames.length > 1 ? "<b>" + this.stocknames[index - 1] + "</b>" : "");
                this.tooltipstocks[tipdata.date] += (Number(tipdata.price.slice(0, -1)) > 0 ? "<h3>" + tipdata.price + "</h3>" : '');
                this.tooltipstocks[tipdata.date] += (tipdata.prediction) + "</div>";

            }
        }
    }


    cleanDots = () => {
        const points = document.getElementsByClassName("point-space");
        for (let i = 0; i < points.length; i++) {
            points[i].style.display = "none";
        }
    }

    initTooltip = () => {
        for (const date in this.tooltipstocks) {
            let representative_dot = 1;
            for (let i = 1; i <= this.graphdata.length; i++) {
                if (document.getElementById('point_' + i + '_' + date).style.display !== "none") {
                    representative_dot = i;
                }
            }

            const elementId = 'point_' + representative_dot + '_' + date;
            document.getElementById(elementId).setAttribute("data-tooltip-html",
                "<h1>" + date + "</h1><div class='tooltip-container'>" + this.tooltipstocks[date] + "</div>");
            document.getElementById(elementId).setAttribute("data-tooltip-id", "graph-tooltip");
            document.getElementById(elementId).style.zIndex = 100;

        }
    }

    initGraphData = (stockdata, index) => {
        let dotselements = [];
        let skipped = 0;
        var i = 0;
        for (i = 0; i < stockdata.length; i++) {
            while (stockdata[i].date !== this.graphdates[i + skipped] && i + skipped < this.graphdates.length) {
                dotselements.push(
                    this.addDot(index, i + skipped, { close: 0, pred: 0, date: this.graphdates[i + skipped] }));
                skipped++;
            }

            dotselements.push(
                this.addDot(index, i + skipped, stockdata[i]));
        }

        while (dotselements.length < this.graphdates.length) {
            dotselements.push(
                this.addDot(index, i + skipped, { close: 0, pred: 0, date: this.graphdates[i + skipped] }));
            i++;
        }

        return dotselements;
    };

    addDot = (index, i, dotdata) => {
        let close = (dotdata.close !== null) ? dotdata.close : -1;
        this.graphdata[index].data.push({
            ispred: this.preddates.includes(this.graphdates[i]),
            close: close,
            date: this.graphdates[i]
        });

        this.graphdata[index].pred.push({
            prediction: dotdata.prediction,
            date: this.graphdates[i]
        });

        return (<div className='point-space' key={"point_" + (index + 1) + "_" + dotdata.date}
            id={"point_" + (index + 1) + "_" + dotdata.date}
            onMouseEnter={this.dotHover} onMouseLeave={this.cleanHover}>
            <div className='point'></div>
        </div>);
    }


    dotHover = e => {
        const dotid = e.target.id.split('_');
        for (let i = 1; i <= this.graphdata.length; i++) {
            document.getElementById("point_" + i + "_" + dotid[2]).classList.add("hover");
        }
    }

    cleanHover = () => {
        const points = document.getElementsByClassName("point-space");
        for (let i = 0; i < points.length; i++) {
            points[i].classList.remove("hover");
        }
    }

}

