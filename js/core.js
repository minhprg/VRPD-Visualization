var nodeWidth = 5;
var nodeHeight = 5;

function convertY(yCoord) {
    return document.getElementById("dot").height - yCoord - 2 * nodeHeight;
}

function drawTruckNode(x, y, ctx, label = "") {
    ctx.fillStyle = "#000000";
    ctx.fillRect(x, convertY(y), nodeWidth, nodeHeight);
    ctx.fillText(label, x, convertY(y + nodeHeight));
}

function drawDroneNode(x, y, ctx, label = "") {
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(x, convertY(y), nodeWidth, nodeHeight);
    ctx.fillText(label, x, convertY(y + nodeHeight));
}

function drawSolidLine(x1, y1, x2, y2, ctx) {
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(x1 + nodeWidth / 2, convertY(y1 - nodeHeight / 2));
    ctx.lineTo(x2 + nodeWidth / 2, convertY(y2 - nodeHeight / 2));
    ctx.stroke();
}

function drawDashLine(x1, y1, x2, y2, ctx) {
    ctx.setLineDash([5, 3]);/*dashes are 5px and spaces are 3px*/
    ctx.beginPath();
    ctx.moveTo(x1 + nodeWidth / 2, convertY(y1 - nodeHeight / 2));
    ctx.lineTo(x2 + nodeWidth / 2, convertY(y2 - nodeHeight / 2));
    ctx.stroke();
}

function getCoordsFromText(id) {
    var text = document.getElementById(id).innerText;
    var parts = text.split(',');
    var coords = [];
    for (var i = 0; i < parts.length; i = i + 3) {
        coords.push([parseInt(parts[i]), parts[i + 1] * 50.0, parts[i + 2] * 50.0]);
    }
    return coords;
}

function getCoordsById(id, coords) {
    var x = -1;
    var y = -1;
    for (var i = 0; i < coords.length; ++i) {
        if (parseInt(coords[i][0]) === parseInt(id)) {
            x = coords[i][1];
            y = coords[i][2];
        }
    }
    return [x, y];
}

function getTruckTour(id) {
    var text = document.getElementById(id).innerText;
    var parts = text.split(',');
    var truckTour = [];
    for (var i = 0; i < parts.length; ++i) {
        truckTour.push(parseInt(parts[i]));
    }
    return truckTour;
}

function getDroneDeliveries(id) {
    var text = document.getElementById(id).innerText;
    var parts = text.split(',');
    var tuple = [];
    for (i = 0; i < parts.length; i = i + 3) {
        tuple.push([parseInt(parts[i]), parseInt(parts[i + 1]), parseInt(parts[i + 2])]);
    }
    return tuple;
}

function visualize(coords, truckDeliveries, droneDeliveries) {
    var c = document.getElementById("dot");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height); // Clear context for redraw

    // Draw truck nodes
    for (var i = 0; i < truckDeliveries.length; ++i) {
        var coord = getCoordsById(truckDeliveries[i], coords);
        drawTruckNode(coord[0], coord[1], ctx, truckDeliveries[i]);
    }

    // Draw drone nodes
    for (var i = 0; i < droneDeliveries.length; ++i) {
        var coord = getCoordsById(droneDeliveries[i][1], coords);
        drawDroneNode(coord[0], coord[1], ctx, droneDeliveries[i][1]);
    }

    // Draw lines truck tour
    for (var i = 0; i < truckDeliveries.length - 1; ++i) {
        var coord1 = getCoordsById(truckDeliveries[i], coords);
        var coord2 = getCoordsById(truckDeliveries[i + 1], coords);
        drawSolidLine(coord1[0], coord1[1], coord2[0], coord2[1], ctx);
    }

    // Draw lines drone deliveries
    for (var i = 0; i < droneDeliveries.length; ++i) {
        var launch = getCoordsById(droneDeliveries[i][0], coords);
        var drone = getCoordsById(droneDeliveries[i][1], coords);
        var rdv = getCoordsById(droneDeliveries[i][2], coords);
        drawDashLine(launch[0], launch[1], drone[0], drone[1], ctx);
        drawDashLine(drone[0], drone[1], rdv[0], rdv[1], ctx);
    }
}