function NetworkGraph(el) {
    this.addNode = function (id, name) {
        nodes.push({"id":id, "name":name, "group":1});
        update();
    };

    this.removeNode = function (id) {
        var i = 0;
        var n = this.findNode(id);

        while (i < links.length) {
          if ((links[i]['source'] == n)||(links[i]['target'] == n)) { links.splice(i,1); }
          else { i++; }
        }

        nodes.splice(findNodeIndex(id),1);
        update();
    };

    this.addLink = function (source, target) {
        links.push({"source":findNode(source),"target":findNode(target)});
        update();
    };

    var findNode = function(id) {
        for (var i in nodes) {
            if (nodes[i]["id"] === id) return nodes[i];
        }
    };

    var findNodeIndex = function(id) {
        for (var i in nodes) {
            if (nodes[i]["id"] === id) return i;
        }
    };

    // set up the D3 visualisation in the specified element
    var w = $(el).innerWidth(),
        h = $(el).innerHeight();

    var vis = this.vis = d3.select(el).append("svg:svg")
        .attr("width", w)
        .attr("height", h);

    var force = d3.layout.force()
        .gravity(0.05)
        .distance(100)
        .charge(-100)
        .size([w, h]);

    var nodes = force.nodes(),
        links = force.links();

    var update = function () {
        var link = vis.selectAll("line.link").data(links, function(d) { return d.source.id + "-" + d.target.id; });

        link.enter().insert("line").attr("class", "link");
        link.exit().remove();

        var node = vis.selectAll("g.node").data(nodes, function(d) { return d.id;});
        var nodeEnter = node.enter().append("g").attr("class", "node").call(force.drag);

        nodeEnter.append("image")
            .attr("class", "circle")
            .attr("xlink:href", "https://d3nwyuy0nl342s.cloudfront.net/images/icons/public.png")
            .attr("x", "-8px")
            .attr("y", "-8px")
            .attr("width", "16px")
            .attr("height", "16px");

        nodeEnter.append("text")
            .attr("class", "nodetext")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(function(d) {return d.id;});

        node.exit().remove();

        force.on("tick", function() {
          link.attr("x1", function(d) { return d.source.x; })
              .attr("y1", function(d) { return d.source.y; })
              .attr("x2", function(d) { return d.target.x; })
              .attr("y2", function(d) { return d.target.y; });

          node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        });

        force.start();
    };

    // Make it all go
    update();
}

/*
graph = new networkGraph("#graph");
*/
